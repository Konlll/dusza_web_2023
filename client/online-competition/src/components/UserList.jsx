import { useEffect, useState } from "react";
import { BsPlusSquareFill } from 'react-icons/bs';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { FetchData } from "../custom_hooks/getUsers";
import '../styles/userAndGroupList.css';
import Modal from "./Modal";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editUsername, setEditUsername] = useState("");
    const [editPassword, setEditPassword] = useState("");
    const [editRole, setEditRole] = useState("");
    const [editGrade, setEditGrade] = useState("");
    const [editClass, setEditClass] = useState("");
    const [editGroup, setEditGroup] = useState("");

    const [groups, setGroups] = useState([]);

    const roles = {
        ADMIN: "Webmester",
        JUDGE: "Zsűritag",
        TEACHER: "Tanár",
        STUDENT: "Versenyző"
    };

    /**
     * Fetches the list of all users and groups.
     */
    const FetchUsers = () => {

        FetchData("/api/admin/", "GET", {})
            .then(data => setUsers(data));

        FetchData("/api/admin/groups/", "GET", {})
            .then(data => setGroups(data))
    };

    // Fetch data when the component is first loaded.
    useEffect(() => {
        FetchUsers();
    }, []);

    /**
     * Clears all fields and closes modals.
     */
    const ClearFields = () => {
        setEditModal(false);
        setDeleteModal(false);

        setCurrentUser(null);
        setEditUsername("");
        setEditPassword("");
        setEditRole("");
        setEditGrade("");
        setEditClass("");
        setEditGroup("");
    };

    /**
     * Opens the edit modal.
     * @param {object} user The user to edit.
     */
    const OpenEdit = (user) => {
        setEditModal(true);
        setCurrentUser(user);

        setEditUsername(user.username);
        setEditPassword("");
        setEditRole(user.role);
        setEditGrade(user.grade || "");
        setEditClass(user.class || "");
        setEditGroup(user.groupId || "");
    }

    /**
     * Edits the user.
     * @param {Event} e 
     */
    const handleEdit = (e) => {
        e.preventDefault();

        let body = {
            username: editUsername,
            password: editPassword,
            role: editRole,
            groupId: parseInt(editGroup)
        };

        if (editRole == "STUDENT") {
            body.grade = editGrade;
            body.class = editClass;
        };

        if (editPassword != null && editPassword != "") {
            body.password = editPassword;
        };

        FetchData(`/api/admin/${parseInt(currentUser.id)}`, "PUT", body)
            .then(data => FetchUsers());

        ClearFields();
    }

    /**
     * Opens the delete modal.
     * @param {object} user The user to delete.
     */
    const OpenDelete = (user) => {
        setDeleteModal(true);
        setCurrentUser(user);
    }

    /**
     * Deletes the user.
     */
    const handleDelete = () => {
        const data = FetchData(`/api/admin/${parseInt(currentUser.id)}`, "DELETE", {})
            .then(data => FetchUsers());

        setDeleteModal(false);
        setCurrentUser(null);
    }

    return (
        <div className="user-list">
            <div className="title">
                <h1>Felhasználók</h1>
                <span>
                    <Link to='/register'><BsPlusSquareFill /></Link>
                </span>
            </div>
            <div className="users-table">
                <div className="users-header">
                    <div>Felhasználónév</div>
                    <div>Szerepkör</div>
                    <div>Évfolyam</div>
                    <div>Osztály</div>
                    <div>Csoport</div>
                    <div>Interakció</div>
                </div>
                {users.map(user => {
                    return (
                        <div className="user-row" key={user.id}>
                            <div>{user.username}</div>
                            <div>{roles[user.role]}</div>
                            <div>{user.grade}</div>
                            <div>{user.class}</div>
                            <div>{user.group?.name}</div>
                            <div>
                                <button onClick={() => OpenEdit(user)}><FaPencilAlt /></button>
                                {user.id == localStorage.getItem("user_id") ? "" : <button onClick={() => OpenDelete(user)}><FaTrashAlt /></button>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <Modal isOpen={deleteModal} onClose={ClearFields} children={
                <>
                    <h2>Biztosan el szeretné távolítani?</h2>
                    <div className="delete-buttons">
                        <button onClick={handleDelete}>Megerősítés</button>
                        <button onClick={() => {
                            setDeleteModal(false)
                            setCurrentUser(null)
                        }}>Mégsem</button>
                    </div>
                </>
            } />
            <Modal isOpen={editModal} onClose={ClearFields} children={
                <>
                    <h2>Felhasználó szerkesztése</h2>
                    <form method="POST" className="edit-user-form register-login-form">

                        <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Felhasználónév" />
                        <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Jelenelegi jelszó módosítása" />
                        <select value={editRole} onChange={(e) => setEditRole(e.target.value)}
                            className={currentUser?.id == localStorage.getItem("user_id") ? "d-none" : ""}>
                            <option value="STUDENT">Versenyző</option>
                            <option value="TEACHER">Tanár</option>
                            <option value="JUDGE">Zsűritag</option>
                        </select>
                        <div className={currentUser && editRole != "STUDENT" ? "d-none w-500" : "w-500"}>
                            <input type="number" value={editGrade} onChange={(e) => setEditGrade(e.target.value)} min={5} max={8} placeholder="Évfolyam" />
                            <input type="text" value={editClass} onChange={(e) => setEditClass(e.target.value)} placeholder="Osztály" />
                            <select onChange={(e) => setEditGroup(e.target.value)} value={editGroup}>
                                <option>Válasszon!</option>
                                {groups.map(group => {
                                    return (
                                        <option key={group.id} value={parseInt(group.id)}>{group.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="edit-buttons">
                            <button onClick={(e) => handleEdit(e)}>Jóváhagyás</button>
                            <button onClick={(e) => {
                                e.preventDefault();
                                ClearFields();
                            }}>Mégsem</button>
                        </div>
                    </form>
                </>
            } />
        </div>
    );
}

export default UserList;
