import React from 'react';
import TaskItem from './TaskItem.jsx';

/**
 * TaskList component handles search, filtering, and renders the list of tasks
 */
function TaskList({
  tasks,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onToggleComplete,
  onDelete,
  onUpdatePriority,
  stats,
}) {
  // Filter by status/priority tab
  let displayedTasks = tasks.filter((task) => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    if (filter === 'High Priority') return task.priority === 'High';
    return true; // 'All'
  });

  // Filter by search query (by title)
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    displayedTasks = displayedTasks.filter((task) =>
      task.title.toLowerCase().includes(query)
    );
  }

  return (
    <div>
      {/* Search and Filters Toolbar */}
      <div className="toolbar-section">
        {/* Search input */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter buttons */}
        <div className="filter-pills">
          <button
            type="button"
            className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All <span className="filter-count">{stats.total}</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Pending <span className="filter-count">{stats.pending}</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilter('Completed')}
          >
            Completed <span className="filter-count">{stats.completed}</span>
          </button>

          <button
            type="button"
            className={`filter-btn ${filter === 'High Priority' ? 'active' : ''}`}
            onClick={() => setFilter('High Priority')}
          >
            High Priority <span className="filter-count">{stats.highPriority}</span>
          </button>
        </div>
      </div>

      {/* Task Cards List */}
      {displayedTasks.length > 0 ? (
        <div className="task-list">
          {displayedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onUpdatePriority={onUpdatePriority}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state-title">
            {searchQuery
              ? 'No tasks match your search'
              : filter !== 'All'
              ? `No ${filter.toLowerCase()} tasks found`
              : 'You have no tasks yet'}
          </p>
          <p className="empty-state-text">
            {searchQuery
              ? 'Try searching with a different term or clear the search input.'
              : 'Use the form above to add a new task and stay organized.'}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
