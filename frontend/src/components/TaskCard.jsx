export default function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <div className="border p-3 rounded shadow mb-2 bg-white flex flex-col">
      <h3 className="font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="flex justify-between mt-2">
        <select className="border p-1 rounded" value={task.status} onChange={(e) => onStatusChange(task._id, e.target.value)}>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button onClick={() => onDelete(task._id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
      </div>
    </div>
  );
}
