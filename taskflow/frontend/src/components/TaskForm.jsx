import React, { useState } from 'react';

/**
 * TaskForm component for creating new tasks
 */
function TaskForm({ onAddTask, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      // Clear form on successful submission
      setTitle('');
      setDescription('');
      setPriority('Medium');
    } catch (err) {
      setError(err.message || 'Failed to add task');
    }
  };

  return (
    <div className="task-form-card">
      <h2 className="task-form-title">What needs to be done?</h2>

      {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="task-title">Task title</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Prepare presentation slides"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-desc">Description (optional)</label>
            <input
              id="task-desc"
              type="text"
              className="form-input"
              placeholder="Add key details or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-add-task"
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? 'Adding...' : '+ Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
