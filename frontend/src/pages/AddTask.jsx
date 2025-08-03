import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import socket from '../Socket';

const AddTask = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
  });

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auth/getuser', {
          withCredentials: true,
        });
        setUsers(res.data.users || []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:8000/api/tasks/addtask',
        {
          ...formData,
          assignedTo: selectedUsers.map(user => user._id),
        },
        {
          withCredentials: true,
        }
      );
      
      navigate(-1); // Go back to home after adding
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Assigned To</label>
            <div
              onClick={() => setShowModal(true)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg flex flex-wrap gap-2 cursor-pointer min-h-[44px]"
            >
              {selectedUsers.map(user => (
                <div
                  key={user._id}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-2"
                >
                  {user.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUsers(prev => prev.filter(u => u._id !== user._id));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {selectedUsers.length === 0 && <span className="text-gray-400">Select users...</span>}
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            Create Task
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[90%] max-w-md space-y-4">
              <input
                type="text"
                placeholder="Search user..."
                className="w-full border p-2 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto space-y-2">
                {users
                  .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
                  .map(user => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between px-2 py-1 border rounded"
                    >
                      <span>{user.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedUsers.some(u => u._id === user._id)}
                        onChange={() => {
                          setSelectedUsers(prev =>
                            prev.some(u => u._id === user._id)
                              ? prev.filter(u => u._id !== user._id)
                              : [...prev, user]
                          );
                        }}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="text-gray-600">Cancel</button>
                <button onClick={() => setShowModal(false)} className="bg-blue-500 text-white px-4 py-1 rounded">Done</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AddTask;
