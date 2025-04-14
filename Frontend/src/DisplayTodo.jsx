import { useState } from "react";

export default function DisplayTodo({ tasks }) {
    const [editId, setEditId] = useState(null);
    const [editedTask, setEditedTask] = useState("");
    const [editedDate, setEditedDate] = useState("");
    const [editedStatus, setEditedStatus] = useState("");

    async function deleteTask(id) {
        try {
            const res = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete task");

            window.location.reload(); // Refresh the list
        } catch (err) {
            console.error(err);
        }
    }

    async function updateTask(id) {
        try {
            const updated = {
                task: editedTask,
                date: editedDate,
                state: editedStatus
            };

            const res = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updated)
            });

            if (!res.ok) throw new Error("Failed to update task");

            setEditId(null);
            window.location.reload(); 
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <h2>Tasks:</h2>
            <ul>
                {tasks.map((t) => (
                    <li key={t._id}>
                        {editId === t._id ? (
                            <>
                                <input
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    placeholder="New Task Description"
                                />
                                <input
                                    type="date"
                                    value={editedDate}
                                    onChange={(e) => setEditedDate(e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                    placeholder="New Status"
                                />
                                <button onClick={() => updateTask(t._id)}>Save</button>
                                <button onClick={() => setEditId(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <strong>{t.Description || t.task}</strong> |{" "}
                                &nbsp;&nbsp;
                                {new Date(t.due_Date || t.date).toLocaleDateString()} | {t.state}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={() => deleteTask(t._id)}>Delete</button>
                                &nbsp;&nbsp;
                                <button onClick={() => {
                                    setEditId(t._id);
                                    setEditedTask(t.Description || t.task);
                                    setEditedDate(t.due_Date?.split("T")[0] || t.date);
                                    setEditedStatus(t.state);
                                }}>
                                    Edit Task
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
