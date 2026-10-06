import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/api.js';

/**
 * Dashboard Page Component
 */
function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show a momentary friendly notification
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fetch all tasks for the logged in user
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Compute greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Add task handler
  const handleAddTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const response = await createTask(taskData);
      // Immediately update local state
      setTasks((prev) => [response.task, ...prev]);
      showToast('Task created successfully');
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle complete handler
  const handleToggleComplete = async (taskId, newStatus) => {
    try {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, completed: newStatus } : t))
      );

      await updateTask(taskId, { completed: newStatus });
      showToast(newStatus ? 'Task marked as completed' : 'Task marked as pending');
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
      // Revert on failure
      fetchTasks();
    }
  };

  // Update priority handler
  const handleUpdatePriority = async (taskId, newPriority) => {
    try {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, priority: newPriority } : t))
      );

      await updateTask(taskId, { priority: newPriority });
      showToast(`Priority changed to ${newPriority}`);
    } catch (err) {
      showToast(err.message || 'Failed to update priority', 'error');
      fetchTasks();
    }
  };

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      // Remove from UI immediately
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      await deleteTask(taskId);
      showToast('Task deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
      fetchTasks();
    }
  };

  // Compute stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && !t.completed).length;

  const stats = {
    total: totalTasks,
    completed: completedTasks,
    pending: pendingTasks,
    highPriority: highPriorityTasks,
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Header Greeting */}
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">
            {getGreeting()}, {user?.name || 'there'}
          </h1>
          <p className="dashboard-subheading">
            Here's what you need to get done today.
          </p>
        </div>

        {/* Compact Summary Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Tasks</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Completed</div>
            <div className="stat-value" style={{ color: '#059669' }}>
              {stats.completed}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending</div>
            <div className="stat-value" style={{ color: '#2563eb' }}>
              {stats.pending}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">High Priority</div>
            <div className="stat-value" style={{ color: '#dc2626' }}>
              {stats.highPriority}
            </div>
          </div>
        </div>

        {/* Task Creation Form */}
        <TaskForm onAddTask={handleAddTask} isLoading={isSubmitting} />

        {/* Task List with Search and Filters */}
        {isLoading ? (
          <div className="empty-state">
            <p className="empty-state-text">Loading your tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onUpdatePriority={handleUpdatePriority}
            stats={stats}
          />
        )}
      </main>

      {/* Floating Notification */}
      {notification && (
        <div className="toast-container">
          <div className={`toast toast-${notification.type}`}>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
