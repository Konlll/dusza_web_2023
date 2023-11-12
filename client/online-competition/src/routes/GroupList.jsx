import { useEffect, useState } from "react";
import { BsPlusSquareFill } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { FetchData } from "../custom_hooks/getUsers";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    /**
     * Fetched the list of all groups.
     */
    const FetchGroups = () => {
        console.log("AAAA")
        FetchData("/api/admin/groups/", "GET", {})
            .then(data => setGroups(data));
    }

    // Fetch data when the component is first loaded.
    useEffect(() => {
        FetchGroups();
    }, [])

    /**
     * Opens the edit modal.
     * @param {object} group The group to delete.
     */
    const OpenEdit = (group) => {
        setEditModal(true);
        setCurrentGroup(group);
        setEditName(group.name);
        setEditDescription(group.description);
    }

    /**
     * Edits the group.
     * @param {Event} e 
     */
    const handleEdit = (e) => {
        e.preventDefault();
        FetchData(`/api/admin/groups/${parseInt(currentGroup.id)}`, "PUT", {
            name: editName,
            description: editDescription
        })
            .then(data => FetchGroups());

        CloseModals();
    }

    /**
     * Opens the delete modal.
     * @param {object} group The group to delete.
     */
    const OpenDelete = (group) => {
        setDeleteModal(true);
        setCurrentGroup(group);
    }

    /**
     * Deletes the group.
     */
    const handleDelete = () => {
        FetchData(`/api/admin/groups/${parseInt(currentGroup.id)}`, "DELETE", {})
            .then(data => FetchGroups());

        CloseModals();
    }

    /**
     * Closes the edit and delete modals.
     */
    const CloseModals = () => {
        setEditModal(false)
        setEditName("")
        setEditDescription("")

        setDeleteModal(false)
        setCurrentGroup(null)
    }

    return (
        <div className="group-list">
            <div className="title">
                <h1>Csoportok</h1>
                <span>
                    <Link to='/new-group'><BsPlusSquareFill /></Link>
                </span>
            </div>
            <div className="users-table">
                <div className="users-header">
                    <div>Név</div>
                    <div>Leírás</div>
                    <div>Interakció</div>
                </div>
                {groups.map(group => {
                    return (
                        <div className="user-row" key={group.id}>
                            <div>{group.name}</div>
                            <div>{group.description}</div>
                            <div>
                                <button onClick={(e) => OpenEdit(group)}><FaPencilAlt /></button>
                                <button onClick={() => OpenDelete(group)}><FaTrashAlt /></button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Modal isOpen={deleteModal} onClose={CloseModals} children={
                <>
                    <h2>Biztosan el szeretné távolítani?</h2>
                    <div className="delete-buttons">
                        <button onClick={handleDelete}>Megerősítés</button>
                        <button onClick={CloseModals}>Mégsem</button>
                    </div>
                </>
            } />

            <Modal isOpen={editModal} onClose={CloseModals} children={
                <>
                    <h2>Csoport szerkesztése</h2>
                    <form method="POST" className="edit-user-form register-login-form">

                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required placeholder="Csoport neve" />
                        <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required placeholder="Csoport leírása" />

                        <div className="edit-buttons">
                            <button onClick={(e) => handleEdit(e)}>Jóváhagyás</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                CloseModals();
                            }}>Mégsem</button>
                        </div>
                    </form>
                </>
            } />
        </div>
    );
}

export default GroupList;