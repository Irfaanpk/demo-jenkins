import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const fetchTasks = async () => {

        const res = await axios.get("http://localhost:5000/tasks");

        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {

        await axios.post("http://localhost:5000/tasks", {
            title,
            completed: false
        });

        fetchTasks();
    };

    const deleteTask = async (id) => {

        await axios.delete(`http://localhost:5000/tasks/${id}`);

        fetchTasks();
    };

    return (
        <div>

            <h1>Task Manager 🚀</h1>

            <input
                onChange={(e) => setTitle(e.target.value)}
            />

            <button onClick={addTask}>
                Add
            </button>

            {tasks.map((t) => (
                <div key={t._id}>

                    {t.title}

                    <button onClick={() => deleteTask(t._id)}>
                        Delete
                    </button>

                </div>
            ))}

        </div>
    );
}

export default App;
