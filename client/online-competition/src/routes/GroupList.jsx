import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { BsPlusSquareFill } from 'react-icons/bs'
import Modal from "../components/Modal";

const GroupList = () => {
    const [groups, setGroups] = useState([])
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [currentGroup, setCurrentGroup] = useState(null)
    const [editName, setEditName] = useState("")
    const [editDescription, setEditDescription] = useState("")

    const handleEdit = (e) => {
        e.preventDefault()
        fetch(`/api/admin/groups/${parseInt(currentGroup.id)}`, {
            method: "PUT",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name:editName,
                description: editDescription
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        setEditModal(false)
        setGroups([])
        setEditName("")
        setEditDescription("")
    }

    const handleDelete = () => {
        fetch(`/api/admin/groups/${parseInt(currentGroup.id)}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
        setDeleteModal(false)
        setGroups(groups.filter(group => group !== currentGroup))
        setCurrentGroup(null)
    }

    useEffect(() => {
        if (localStorage.getItem("access_token") && localStorage.getItem("role") == "ADMIN") {
            fetch(`/api/admin/groups/`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            })
                .then(res => res.json())
                .then(data => setGroups(data))
        } else {
            const navigate = useNavigate()
            navigate('/')
        }
    }, [groups])

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
                                <button onClick={(e) => {
                                    setEditModal(true)
                                    setCurrentGroup(group)
                                    setEditName(group.name)
                                    setEditDescription(group.description)
                                }}><FaPencilAlt /></button>
                                <button onClick={() => {
                                    setDeleteModal(true)
                                    setCurrentGroup(group)
                                }}><FaTrashAlt /></button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <Modal isOpen={deleteModal} onClose={setDeleteModal} children={
                <>
                    <h2>Biztosan el szeretné távolítani?</h2>
                    <div className="delete-buttons">
                        <button onClick={handleDelete}>Megerősítés</button>
                        <button onClick={() => {
                            setDeleteModal(false)
                            setCurrentGroup(null)
                        }}>Mégsem</button>
                    </div>
                </>
            } />

            <Modal isOpen={editModal} onClose={setEditModal} children={
                <>
                    <h2>Csoport szerkesztése</h2>
                    <form method="POST" className="edit-user-form register-login-form">

                    <input type="text" value={editName && editName} onChange={(e) => setEditName(e.target.value)} placeholder="Csoport neve" />
                    <input type="text" value={editDescription && editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Csoport leírása" />

                        <div className="edit-buttons">
                            <button onClick={(e) => {
                                handleEdit(e)
                            }}>Jóváhagyás</button>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setEditModal(false)
                                setCurrentGroup(null)
                            }}>Mégsem</button>
                        </div>
                    </form>
                </>
            } />
        </div>
    );
}

export default GroupList;