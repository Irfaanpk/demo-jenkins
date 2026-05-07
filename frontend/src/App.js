import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const API = "http://backend:5000/tasks";

    const fetchTasks = async () => {

        const res = await axios.get(API);

        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const addTask = async () => {

        await axios.post(API, {
            title,
            completed: false
        });

        setTitle("");

        fetchTasks();
    };

    const deleteTask = async (id) => {

        await axios.delete(`${API}/${id}`);

        fetchTasks();
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Task Manager 🚀</h1>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task"
            />

            <button onClick={addTask}>
                Add
            </button>

            <hr />

            {tasks.map((t) => (

                <div key={t._id}>

                    {t.title}

                    <button
                        onClick={() => deleteTask(t._id)}
                    >
                        Delete
                    </button>

                </div>
            ))}

        </div>
    );
}

export default App;
