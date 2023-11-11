import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";

const Competitions = () => {
    const [competitions, setCompetitions] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [editedCompetition, setEditedCompetition] = useState(null);

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

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const CloseModal = () => {
        setEditedCompetition(null);
        setModalOpen(false);
    }

    const EditCompetition = (competition) => {
        setEditedCompetition(competition);
        setModalOpen(true);
    }

    const SubmitForm = async (event) => {
        event.preventDefault();
        fetch(`/api/competitions/${editedCompetition ? editedCompetition.id : "new"}`, {
            method: "PUT",
            headers:
            {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                name: event.target.name.value,
                description: event.target.description.value,
                grade: parseInt(event.target.grade.value),
                startDate: event.target.startDate.value,
                endDate: event.target.endDate.value

            })
        })
            .then(res => res.json())
            .then(data => {
                fetchCompetitions();
                CloseModal();
            })
            .catch(err => console.log(err));
    }

    const HandleDelete = (competition) => {
        fetch(`/api/competitions/${competition.id}`, {
            method: "DELETE",
            headers:
            {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-type": "application/json"
            }
        })
            .then(res => fetchCompetitions())
            .catch(err => console.log(err));
    }

    const FormatDate = (text) => text ? new Date(Date.parse(text)).toISOString().split('T')[0] : undefined;

    return (
        <div>
            <button onClick={() => setModalOpen(true)}>Új verseny</button>
            {competitions ?
                <ul>
                    {competitions.map(comp => <Competition competition={comp} editFunction={EditCompetition} deleteFunction={HandleDelete} key={comp.id} />)}
                </ul>
                : "Loading..."}
            <Modal isOpen={modalOpen} onClose={CloseModal}>
                <form key={editedCompetition?.id} onSubmit={SubmitForm}>
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
    return (
        <li>
            <span>{competition.name} {competition.startDate} {competition.endDate}</span>
            {Date.parse(competition.startDate) > new Date() ?
                <div>
                    <button onClick={() => editFunction(competition)}>Szerkesztés</button>
                    <button onClick={() => deleteFunction(competition)}>Törlés</button>
                </div> : ""}
        </li>
    )
}

export default Competitions;
