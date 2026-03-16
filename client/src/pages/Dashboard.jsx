import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";

const STATUS_FILTERS = ["All", "Pending", "Completed"];

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [fetchError, setFetchError] = useState("");

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const params = {};
      if (activeFilter !== "All") params.status = activeFilter;
      if (search.trim()) params.search = search.trim();

      const { data } = await fetchTasks(params);
      setTasks(data);
    } catch (err) {
      setFetchError("Could not load tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // simple debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCreate = async (formData) => {
    setCreating(true);
    try {
      const { data } = await createTask(formData);
      setTasks((prev) => [data, ...prev]);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || "Could not create task");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const { data } = await updateTask(id, formData);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete task");
    }
  };

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {pendingCount} pending &middot; {completedCount} completed
            </p>
          </div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition self-start sm:self-auto"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {/* task creation form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
            <p className="text-sm font-medium text-gray-700 mb-4">Add a new task</p>
            <TaskForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={creating}
            />
          </div>
        )}

        {/* search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          <div className="flex gap-2">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                  activeFilter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* task list */}
        {loading ? (
          <div className="text-center py-16 text-sm text-gray-400">Loading tasks...</div>
        ) : fetchError ? (
          <div className="text-center py-16 text-sm text-red-500">{fetchError}</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              {search || activeFilter !== "All"
                ? "No tasks match your search or filter."
                : "No tasks yet. Add your first one above."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
