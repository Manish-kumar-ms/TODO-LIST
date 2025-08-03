import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import { UserDataContext } from "../context/UserContext";

const ActionLog = () => {
  const { id } = useParams(); // taskId from URL
  const [logs, setLogs] = useState([]); // ✅ initialize as empty array
  const [loading, setLoading] = useState(true);
  const {serverUrl} = useContext(UserDataContext)

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/tasks/getallactionlogsbyId/${id}`, {
        withCredentials: true,
      });

      // ✅ Safely set logs only if response has the expected data
      setLogs(res.data?.actionLogs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setLogs([]); // fallback to empty array to avoid undefined
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [id]);

  return (
    <>
    <Navbar/>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">Action Logs</h1>

      {loading ? (
        <div className="text-gray-300">Loading...</div>
      ) : logs && logs.length === 0 ? (
        <div className="text-gray-300">No logs available.</div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-[#1f1f1f] text-gray-200 p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    log.actionType === "EDIT"
                      ? "bg-yellow-600"
                      : log.actionType === "ADD"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {log.actionType}
                </span>
              </div>
              <p className="mt-2">
                <span className="font-medium text-white">
                  {log.performedBy?.name}
                </span>{" "}
                ({log.performedBy?.email}) performed this action.
              </p>
              <p className="text-sm mt-1">{log.description}</p>

              {log.changes && Object.keys(log.changes).length > 0 && (
                <div className="mt-2 bg-[#2b2b2b] p-3 rounded text-sm">
                  <p className="font-semibold mb-1 text-white">Changes:</p>
                  <ul className="list-disc pl-5 text-gray-300">
                    {Object.entries(log.changes).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong>{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ActionLog;
