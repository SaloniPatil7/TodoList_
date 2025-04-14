import { useState, useEffect } from "react";
import DisplayTodo from "./DisplayTodo.jsx";
export default function TodoList() {
    const [task, setTask] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const res = await fetch("https://todolist-1-oxid.onrender.com/tasks");
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks:", err);
        }
    }

    async function submitTask(e) {
        e.preventDefault();

        const newTask = { task, date, state: status };

        try {
            const response = await fetch('https://todolist-1-oxid.onrender.com/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Failed to submit");

            const result = await response.json();
            console.log("Task submitted:", result);

            setTask("");
            setDate("");
            setStatus("");

            fetchTasks(); 
        } catch (e) {
            console.error("Error submitting task:", e);
        }
    }

    return (
        <>
            <h1>Todo List</h1>
            <form onSubmit={submitTask}>
                <input
                    type="text"
                    name="task"
                    placeholder="Enter Your Task"
                    value={task}
                    onChange={e => setTask(e.target.value)}
                />
                <br />
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
                <br />
                <input
                    type="text"
                    name="state"
                    placeholder="Enter state of task"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                />
                <br />
                <button type="submit">Submit</button>
            </form>
          
          <DisplayTodo tasks={tasks}/>

        </>
    );
}
