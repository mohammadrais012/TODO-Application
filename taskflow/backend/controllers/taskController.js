import Task from '../models/Task.js';

/**
 * @desc    Get all tasks belonging to the authenticated user
 * @route   GET /api/tasks
 * @access  Private (Protected by JWT)
 */
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Failed to retrieve tasks. Please try again.' });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private (Protected by JWT)
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    // Default to 'Medium' if priority is invalid
    const validPriority = ['Low', 'Medium', 'High'].includes(priority)
      ? priority
      : 'Medium';

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: validPriority,
      completed: false,
      user: req.user.id,
    });

    return res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Failed to create task. Please try again.' });
  }
};

/**
 * @desc    Update an existing task (title, description, priority, completed)
 * @route   PUT /api/tasks/:id
 * @access  Private (Protected by JWT)
 */
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You do not own this task' });
    }

    // Build update object only with provided fields
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title.trim();
    if (req.body.description !== undefined) updates.description = req.body.description.trim();
    if (req.body.priority !== undefined) {
      if (['Low', 'Medium', 'High'].includes(req.body.priority)) {
        updates.priority = req.body.priority;
      }
    }
    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    return res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Failed to update task. Please try again.' });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Protected by JWT)
 */
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ensure the task belongs to the authenticated user
    if (task.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You cannot delete this task' });
    }

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({
      message: 'Task deleted successfully',
      id: taskId,
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Failed to delete task. Please try again.' });
  }
};
