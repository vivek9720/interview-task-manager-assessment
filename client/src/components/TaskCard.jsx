import { useState } from "react";
import TaskForm from "./TaskForm";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async (formData) => {
    setSaving(true);
    await onUpdate(task._id, formData);
    setSaving(false);
    setEditing(false);
  };

  const handleToggleStatus = async () => {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    await onUpdate(task._id, { status: newStatus });
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    // no setDeleting(false) needed — card unmounts on delete
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (editing) {
    return (
      <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-4">Edit task</p>
        <TaskForm
          initialData={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* checkbox to toggle status */}
          <button
            onClick={handleToggleStatus}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              task.status === "Completed"
                ? "bg-emerald-500 border-emerald-500"
                : "border-gray-300 hover:border-indigo-400"
            }`}
          >
            {task.status === "Completed" && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-snug ${
                task.status === "Completed"
                  ? "line-through text-gray-400"
                  : "text-gray-900"
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">{formattedDate}</p>
          </div>
        </div>

        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
            task.status === "Completed"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {task.status}
        </span>
      </div>

      <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
