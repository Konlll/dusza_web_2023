import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { useParams } from "react-router";
import '../styles/userAndGroupList.css';
import { FetchData } from "../custom_hooks/getUsers";

const AssignTasks = () => {
    const { id } = useParams()
    const [competition, setCompetition] = useState(null);
    const [tasks, setTasks] = useState(null);
    const [showError, setShowError] = useState(false);

    /**
     * Fetch the competition and a list of tasks.
     */
    const fetchData = async () => {
        let res = await fetch(`/api/competitions/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });
        let data = await res.json();
        setCompetition(data);

        res = await fetch(`/api/tasks?grade=${data.grade}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        data = await res.json();
        setTasks(data);
    }

    // Fetch data when first rendered
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Assings selected tasks to the competition.
     */
    const AssignTasks = () => {
        const elements = document.querySelectorAll("input[name='task']:checked");
        const tasks = Array.from(elements).map(x => x.value);

        setShowError(false);

        if (tasks.length % 3 != 0) {
            setShowError(true);
            return;
        }

        FetchData(`/api/competitions/${id}/tasks`, "POST", {
            tasks: tasks
        });
    };

    const IsDefaultChecked = (id) => {
        return competition.tasks.find(x => x.id == id) != undefined
    }

    return (
        <div className="assign-tasks">
            {competition && tasks ?
                <div>
                    <h2>Feladatok hozzáadása</h2>
                    {tasks.map(task =>
                        <div key={task.id} className="task">
                            <input type="checkbox" name="task" id={task.id} value={task.id} defaultChecked={IsDefaultChecked(task.id)} />
                            <label htmlFor={task.id}>{task.word1} {task.word2} {task.word3} {task.word4}</label>
                        </div>)}
                    <button onClick={AssignTasks}>Mentés</button>
                    {showError ? <p>A feladatok száma hárommal osztható kell hogy legyen.</p> : ""}
                </div> : <h3>Jelenleg nincs feladat amit hozzá lehet adni.</h3>}
        </div>
    );
}

export default AssignTasks;
