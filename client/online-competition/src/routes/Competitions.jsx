import React, { useEffect, useState } from "react";
import { FaClipboardList, FaPencilAlt, FaTrashAlt, FaTrophy } from 'react-icons/fa';
import { MdGroupAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import '../styles/Competitions.css';
import '../styles/LoginRegister.css';
import { FetchData } from "../custom_hooks/getUsers";

const Competitions = () => {
    const [competitions, setCompetitions] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [editedCompetition, setEditedCompetition] = useState(null);

    /**
     * Fetch a list of competitions
     */
    const fetchCompetitions = () => {
        fetch(`/api/competitions`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setCompetitions(data);
            })
            .catch(err => console.log(err));
    }

    // Fetch data on first render
    useEffect(() => {
        fetchCompetitions();
    }, []);

    /**
     * Close the edit modal.
     */
    const CloseModal = () => {
        setEditedCompetition(null);
        setModalOpen(false);
    }

    /**
     * Open the edit modal.
     * @param {object} competition 
     */
    const EditCompetition = (competition) => {
        setEditedCompetition(competition);
        setModalOpen(true);
    }

    /**
     * Edit the competition.
     * @param {event} event 
     */
    const SubmitForm = async (event) => {
        event.preventDefault();
        FetchData(`/api/competitions/${editedCompetition ? editedCompetition.id : "new"}`, "PUT", {
            name: event.target.name.value,
            description: event.target.description.value,
            grade: parseInt(event.target.grade.value),
            startDate: event.target.startDate.value,
            endDate: event.target.endDate.value

        })
            .then(data => {
                fetchCompetitions();
                CloseModal();
            })
    }

    /**
     * Delete the competition
     * @param {object} competition 
     */
    const HandleDelete = (competition) => {
        FetchData(`/api/competitions/${competition.id}`, "DELETE", {})
            .then(res => fetchCompetitions())
    }

    const FormatDate = (text) => text ? new Date(Date.parse(text)).toISOString().split('T')[0] : undefined;

    return (
        <div className="competitions">
            <button onClick={() => setModalOpen(true)} className="new-competition-button">Új verseny</button>
            <div className="competition-header">
                <div>Név</div>
                <div>Leírás</div>
                <div>Kezdődátum</div>
                <div>Végdátum</div>
                <div>Interakciók</div>
            </div>
            {competitions ?
                <ul className="competition-list">
                    {competitions.map(comp => <Competition competition={comp} editFunction={EditCompetition} deleteFunction={HandleDelete} key={comp.id} />)}
                </ul>
                : "Loading..."}
            <Modal isOpen={modalOpen} onClose={CloseModal}>
                <form className="register-login-form add-new-competition" key={editedCompetition?.id} onSubmit={SubmitForm}>
                    <h2>{editedCompetition ? "Verseny szerkesztése" : "Új verseny"}</h2>
                    <input type="text" placeholder="Név" name="name" required defaultValue={editedCompetition?.name} />
                    <textarea name="description" placeholder="Leírás" defaultValue={editedCompetition?.description}></textarea>
                    <input type="number" min="5" max="8" placeholder="Osztály" name="grade" required defaultValue={editedCompetition?.grade} />
                    <input type="date" name="startDate" required defaultValue={FormatDate(editedCompetition?.startDate)} />
                    <input type="date" name="endDate" required defaultValue={FormatDate(editedCompetition?.endDate)} />

                    <button type="submit">{editedCompetition ? "Szerkesztés" : "Létrehozás"}</button>
                </form>
            </Modal>
        </div>
    );
}

const Competition = ({ competition, editFunction, deleteFunction }) => {
    let startDate = new Date(competition.startDate)
    let endDate = new Date(competition.endDate)
    return (
        <li className="user-row">
            <div>{competition.name}</div>
            <div>{competition.description}</div>
            <div>{`${startDate.getFullYear()}-${startDate.getMonth() < 10 ? "0" + parseInt(startDate.getMonth() + 1) : startDate.getMonth() + 1}-${startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()}`}</div>
            <div>{`${endDate.getFullYear()}-${endDate.getMonth() + 1 < 10 ? "0" + parseInt(endDate.getMonth() + 1) : endDate.getMonth() + 1}-${endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()}`}</div>
            <div>
                {Date.parse(competition.startDate) > new Date()
                    ? <>
                        <button onClick={() => editFunction(competition)}><FaPencilAlt /></button>
                        <button onClick={() => deleteFunction(competition)}><FaTrashAlt /></button>
                        <button title="Hozzárendelés csoporthoz"><Link to={`/competitions/${competition.id}/groups`}><MdGroupAdd /></Link></button>
                        <button title="Hozzárendelés feladthoz"><Link to={`/competitions/${competition.id}/tasks`}><FaClipboardList /></Link></button>
                    </>
                    : <>
                        <button title="Eredmények megtekintése"><Link to={`/competitions/${competition.id}/results`}><FaTrophy /></Link></button>
                    </>}
            </div>
        </li>
    )
}

export default Competitions;
