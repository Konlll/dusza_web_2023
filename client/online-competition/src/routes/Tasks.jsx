import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import '../styles/Tasks.css'
import { FetchData } from "../custom_hooks/getUsers";

const Tasks = () => {
    const [tasks, setTasks] = useState(null);

    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);

    const [modalOpen, setModalOpen] = useState(false)
    const [editedTask, setEditedTask] = useState(null);

    /**
     * Fetch the list of tasks
     */
    const fetchTasks = () => {
        fetch(`/api/tasks`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const grouped = data.reduce((hash, obj) => ({ ...hash, [obj["grade"]]: (hash[obj["grade"]] || []).concat(obj) }), {})
                setTasks(grouped);
            })
            .catch(err => console.log(err));
    }

    // Fetch data on first render.
    useEffect(() => {
        fetchTasks();
    }, []);


    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    /**
     * Upload the file containing tasks.
     * @param {Event} event 
     */
    const HandleUpload = async (event) => {
        event.preventDefault()
        const text = await file.text();
        FetchData("/api/tasks/upload", "POST", {
            text: text
        })
            .then(data => {
                setErrors(data.errors)
                if (data.success != 0) {
                    fetchTasks();
                }
            });
    }

    /**
     * Closes the edit modal.
     */
    const CloseModal = () => {
        setModalOpen(false);
        setEditedTask(null);
    }

    /**
     * Opens the edit modal.
     * @param {Object} task 
     */
    const EditTask = (task) => {
        setEditedTask(task);
        setModalOpen(true);
    }

    /**
     * Edits the task.
     * @param {Event} event 
     */
    const HandleEdit = async (event) => {
        event.preventDefault();
        FetchData(`/api/tasks/${editedTask.id}`, "PUT", {
            word1: event.target.word1.value,
            word2: event.target.word2.value,
            word3: event.target.word3.value,
            word4: event.target.word4.value,
            grade: parseInt(event.target.grade.value)

        })
            .then(data => {
                fetchTasks();
                CloseModal();
            });
    }

    /**
     * Deletes the task
     * @param {Object} task 
     */
    const HandleDelete = (task) => {
        FetchData(`/api/tasks/${task.id}`, "DELETE", {})
            .then(res => fetchTasks());
    }

    return (
        <div className="tasks">
            <form onSubmit={HandleUpload}>
                <input type="file" id="uploadFile" onChange={handleFileChange} accept="text/plain" />
                <div>
                    <button type="submit">Feltöltés</button>
                </div>
            </form>
            {errors?.length != 0
                ? <div className="errors">
                    <h3>Hibák</h3>
                    {errors.map(error =>
                        <p><span>"{error.line}"</span>: {error.error}</p>)}
                </div>
                : ""}
            {tasks
                ? Object.keys(tasks).map((key, index) => (
                    <TaskGroup tasks={tasks[key]} grade={key} editFunction={EditTask} deleteFunction={HandleDelete} key={index} />
                ))
                : "Loading..."}
            <Modal isOpen={modalOpen} onClose={CloseModal}>
                {editedTask ?
                    <form className="register-login-form" key={editedTask.id} onSubmit={HandleEdit}>
                        <h2>Feladat módosítása</h2>
                        <input type="text" placeholder="1. szó" name="word1" required defaultValue={editedTask.word1} />
                        <input type="text" placeholder="2. szó" name="word2" required defaultValue={editedTask.word2} />
                        <input type="text" placeholder="3. szó" name="word3" required defaultValue={editedTask.word3} />
                        <input type="text" placeholder="4. szó" name="word4" required pattern="(.*[aáeéiíoóöőuúüűAÁEÉIÍOÓÖŐUÚÜŰ].*){3,}" defaultValue={editedTask.word4} />
                        <input type="number" min="5" max="8" placeholder="Osztály" name="grade" required defaultValue={editedTask.grade} />

                        <button type="submit">Módosítás</button>
                    </form> : ""}
            </Modal>
        </div>
    );
}

const TaskGroup = ({ tasks, grade, editFunction, deleteFunction }) => {
    return (
        <div className="task-list">
            <h3>{grade}. évfolyam feladatai</h3>
            <ul>
                {tasks.map(item =>
                    <Task task={item} key={item.id} editFunction={editFunction} deleteFunction={deleteFunction} />)}
            </ul>
        </div>
    )
}

const Task = ({ task, editFunction, deleteFunction }) => {
    return (
        <li>
            <div>{task.word1}</div> <div>{task.word2}</div> <div>{task.word3}</div> <div>{task.word4}</div>
            {localStorage.getItem("user_id") == task.teacherId ? <div>
                <button onClick={() => editFunction(task)}><FaPencilAlt /></button>
                <button onClick={() => deleteFunction(task)}><FaTrashAlt /></button>
            </div> : <div />}
        </li>
    )
}

export default Tasks;
