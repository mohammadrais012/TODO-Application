import mongoose from 'mongoose';

/**
 * Task Schema definition for MongoDB via Mongoose
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compile standard Mongoose Model
const MongooseTask = mongoose.models.Task || mongoose.model('Task', taskSchema);

// In-memory collection fallback for offline evaluation/demo when MongoDB is not connected
const memoryTasks = [];

/**
 * Task data-access object supporting both connected MongoDB and offline demo fallback
 */
class TaskModel {
  static isConnected() {
    return mongoose.connection && mongoose.connection.readyState === 1;
  }

  static async find(query = {}) {
    if (this.isConnected()) {
      return await MongooseTask.find(query).sort({ createdAt: -1 });
    }

    let results = [...memoryTasks];
    if (query.user) {
      results = results.filter((t) => t.user.toString() === query.user.toString());
    }
    // Sort descending by createdAt
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  static async findById(id) {
    if (this.isConnected()) {
      return await MongooseTask.findById(id);
    }

    const task = memoryTasks.find((t) => t._id.toString() === id.toString());
    return task ? { ...task } : null;
  }

  static async create(taskData) {
    if (this.isConnected()) {
      return await MongooseTask.create(taskData);
    }

    const newTask = {
      _id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      priority: ['Low', 'Medium', 'High'].includes(taskData.priority)
        ? taskData.priority
        : 'Medium',
      completed: Boolean(taskData.completed),
      user: taskData.user,
      createdAt: new Date(),
    };

    memoryTasks.unshift(newTask);
    return { ...newTask };
  }

  static async findByIdAndUpdate(id, updateData, options = { new: true }) {
    if (this.isConnected()) {
      return await MongooseTask.findByIdAndUpdate(id, updateData, options);
    }

    const index = memoryTasks.findIndex((t) => t._id.toString() === id.toString());
    if (index === -1) return null;

    const existing = memoryTasks[index];
    const updated = {
      ...existing,
      ...updateData,
      _id: existing._id, // Ensure id never changes
      user: existing.user, // Ensure owner never changes
    };

    memoryTasks[index] = updated;
    return { ...updated };
  }

  static async findByIdAndDelete(id) {
    if (this.isConnected()) {
      return await MongooseTask.findByIdAndDelete(id);
    }

    const index = memoryTasks.findIndex((t) => t._id.toString() === id.toString());
    if (index === -1) return null;

    const deleted = memoryTasks.splice(index, 1)[0];
    return deleted;
  }
}

export default TaskModel;
