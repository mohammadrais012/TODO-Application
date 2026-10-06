import React from 'react';

/**
 * TaskItem component represents a single task card
 */
function TaskItem({ task, onToggleComplete, onDelete, onUpdatePriority }) {
  // Format createdAt date cleanly (e.g. "Oct 5, 2026")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handlePriorityChange = (e) => {
    const newPriority = e.target.value;
    onUpdatePriority(task._id, newPriority);
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox trigger */}
      <div className="task-checkbox-container">
        <button
          type="button"
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleComplete(task._id, !task.completed)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && <span className="checkmark-symbol">✓</span>}
        </button>
      </div>

      {/* Main Task Content */}
      <div className="task-body">
        <div className="task-header-row">
          <h3 className="task-title">{task.title}</h3>
        </div>

        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}

        <div className="task-meta-row">
          {/* Priority indicator and inline selector */}
          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
            <span>Change:</span>
            <select
              className="priority-select-inline"
              value={task.priority}
              onChange={handlePriorityChange}
              title="Change Priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          {task.completed && (
            <span className="badge badge-completed">Completed</span>
          )}

          <span className="task-date">{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="task-actions">
        <button
          type="button"
          onClick={() => onToggleComplete(task._id, !task.completed)}
          className="btn-action"
          title={task.completed ? 'Mark as pending' : 'Mark as done'}
        >
          {task.completed ? 'Mark Pending' : 'Mark Done'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(task._id)}
          className="btn-action btn-delete"
          title="Delete this task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
