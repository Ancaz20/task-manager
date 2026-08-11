const priorityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-red-100 text-red-800 border-red-200'
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700'
}

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description || 'No description'}</p>

      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>

      {task.dueDate && (
        <div className="mt-3 text-xs text-gray-400">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  )
}

export default TaskCard
