import ActionLogModel from "../Models/ActionLog.js";
import TaskModel from "../Models/TaskModel.js";
import { emitSocketEvent } from "../socket.js";

export const AddTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority } = req.body;

    if (!title || !description || !assignedTo || !priority) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const alreadyExists = await TaskModel.findOne({
      title,
      createdBy: req.user._id,
    });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Task with this title already exists",
      });
    }

    // 1. Create the task
    const newTask = await TaskModel.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      priority,
      status: "In Progress",
    });

    //  Step 2: Limit ActionLog to 20 entries
    const actionCount = await ActionLogModel.countDocuments();
    if (actionCount >= 20) {
      const oldest = await ActionLogModel.findOne().sort({ createdAt: 1 }); // oldest first
      if (oldest) await ActionLogModel.findByIdAndDelete(oldest._id);
    }

    // 3. Create the action log
    const actionLog = await ActionLogModel.create({
      actionType: "ADD",
      task: newTask._id,
      performedBy: req.user._id,
      description: `Task created by ${req.user.name}`,
      changes: {
        title,
        description,
        assignedTo,
        priority,
      },
    });

    // 4. Push action log ID to task.Changes and save
    newTask.Changes.push(actionLog._id);
    await newTask.save();

    emitSocketEvent("taskAdded", newTask);

    return res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "problem while creating task" });
  }
}; 

export const EditTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo, status, priority } = req.body;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const userId = req.user._id.toString();

    // ✅ Check if current user is allowed to edit
    const isCreator = task.createdBy.toString() === userId;
    const isAssigned = task.assignedTo.some((id) => id.toString() === userId);

    if (!isCreator && !isAssigned) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this task",
      });
    }

    const changes = {};

    if (title) {
      changes.title = title;
      task.title = title;
    }
    if (description) {
      changes.description = description;
      task.description = description;
    }
    if (
      task.createdBy.toString() === req.user._id.toString() &&
      Array.isArray(assignedTo)
    ) {
      const newAssignedTo = assignedTo.map((id) => id.toString());
      const oldAssignedTo = task.assignedTo.map((id) => id.toString());

      const addedUsers = newAssignedTo.filter(
        (id) => !oldAssignedTo.includes(id)
      );
      const removedUsers = oldAssignedTo.filter(
        (id) => !newAssignedTo.includes(id)
      );

      if (addedUsers.length > 0 || removedUsers.length > 0) {
        changes.assignedTo = {
          added: addedUsers,
          removed: removedUsers,
        };
        task.assignedTo = newAssignedTo;
      }
    }

    if (status) {
      changes.status = status;
      task.status = status;
    }
    if (priority) {
      changes.priority = priority;
      task.priority = priority;
    }

    await task.save();

    // Step 1: Limit ActionLog to 20 entries
    const actionCount = await ActionLogModel.countDocuments();
    if (actionCount >= 20) {
      const oldest = await ActionLogModel.findOne().sort({ createdAt: 1 }); // oldest first
      if (oldest) await ActionLogModel.findByIdAndDelete(oldest._id);
    }

    const action = await ActionLogModel.create({
      actionType: "EDIT",
      task: task._id,
      performedBy: req.user._id,
      description: `Task updated by ${req.user.name}`,
      changes: changes,
    });

    //  Push action log ID to task.Changes and save
    task.Changes.push(action._id);
    await task.save();

    await task.populate([
      { path: "createdBy", select: "_id name" },
      { path: "assignedTo", select: "_id name" },
    ]);

    emitSocketEvent("taskUpdated", task);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
      changes,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while updating task" });
  }
};

export const DeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const userId = req.user._id.toString();

    // ✅ Check if current user is allowed to delete
    const isCreator = task.createdBy.toString() === userId;

    if (!isCreator) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this task",
      });
    }

    // Step 1: Limit ActionLog to 20 entries
    const actionCount = await ActionLogModel.countDocuments();
    if (actionCount >= 20) {
      const oldest = await ActionLogModel.findOne().sort({ createdAt: 1 }); // oldest first
      if (oldest) await ActionLogModel.findByIdAndDelete(oldest._id);
    }

    // Step 2: Create the action log
    const action = await ActionLogModel.create({
      actionType: "DELETE",
      task: task._id,
      performedBy: req.user._id,
      description: `Task deleted by ${req.user.name}`,
      changes: {
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        priority: task.priority,
        status: task.status,
      },
    });

    // Step 4: Delete the task
    await TaskModel.findByIdAndDelete(taskId);
    // Step 5: Emit socket event
    emitSocketEvent("taskDeleted", task._id.toString());

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while deleting task" });
  }
};

export const GetAdminTasks = async (req, res) => {
  try {
    const alltask = await TaskModel.find({ createdBy: req.user._id })
      .populate("assignedTo", "name email") // Populate assignedTo with User details
      .populate("createdBy", "name email") // Populate createdBy with User details
      .populate("Changes"); // Populate Changes with ActionLog details

    return res.status(200).json({ success: true, tasks: alltask });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while fetching tasks" });
  }
};

export const getalltasks = async (req, res) => {
  try {
    const allTasks = await TaskModel.find()
      .populate("assignedTo", "name email") // Populate assignedTo with User details
      .populate("createdBy", "name email"); // Populate createdBy with User details
    // Populate Changes with ActionLog details

    return res.status(200).json({ success: true, tasks: allTasks });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Problem while fetching tasks" });
  }
};

export const gettaskbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await TaskModel.findById(id)
      .populate("assignedTo", "name email") // Populate assignedTo with User details
      .populate("createdBy", "name email"); // Populate createdBy with User details

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({ success: true, task });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while fetching task" });
  }
};

export const getallactionlogsbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const actionLogs = await ActionLogModel.find({ task: id })
      .populate("performedBy", "name email") // Populate performedBy with User details
      .populate("task", "title description"); // Populate task with Task details

    return res.status(200).json({ success: true, actionLogs });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while fetching action logs" });
  }
};


export const getallAssignedTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await TaskModel.find({ assignedTo: userId })
      .populate("assignedTo", "name email") // Populate assignedTo with User details
      .populate("createdBy", "name email"); // Populate createdBy with User details

    return res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Problem while fetching assigned tasks" });
  }
}
