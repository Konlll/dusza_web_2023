import { useEffect, useRef, useState } from "react";
import '../styles/userAndGroupList.css'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { BsPlusSquareFill } from 'react-icons/bs'
import Modal from "./Modal";
import { Link, useNavigate } from "react-router-dom";
import {FetchData} from "../custom_hooks/getUsers";
const UserList = () => {
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [editUsername, setEditUsername] = useState("")
    const [editPassword, setEditPassword] = useState("")
    const [editRole, setEditRole] = useState("")
    const [editGrade, setEditGrade] = useState(null)
    const [editClass, setEditClass] = useState("")
    const [editGroup, setEditGroup] = useState("")

    const [groups, setGroups] = useState([])

    const competitorInfosRef = useRef(null)

    const roles = {
        ADMIN: "Webmester",
        JUDGE: "Zsűritag",
        TEACHER: "Tanár",
        STUDENT: "Versenyző"
    }

    const handleInputs = (e) => {
        const div = competitorInfosRef.current
        if(e.target.value == "STUDENT"){
            div.className = "w-500"
        } else {
            div.className = "d-none w-500"
            setEditGrade("")
            setEditClass("")
            setEditGroup(null)
        }
    } 

    /*const getGroup = (groupId) => {
        if(groupId){
            fetch(`/api/admin/group/${groupId}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            })
            .then(res => res.json())
            .then(data => {
                setGroups([...groups, data.name])
            })
            .catch(error => console.log(error))
        }
    }*/

    const handleDelete = () => {
        /*
        fetch(`/api/admin/${parseInt(currentUser.id)}`, {
            method: "DELETE",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        */
        
        const data = FetchData(`/api/admin/${parseInt(currentUser.id)}`,
            "DELETE",
            localStorage.getItem("access_token"),{}); 
        //console.log(data);
        
        setDeleteModal(false)
        setUsers(users.filter(user => user !== currentUser))
        setCurrentUser(null)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        if(editPassword != null && editPassword != ""){
            /*
            fetch(`/api/admin/${parseInt(currentUser.id)}`, {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: editUsername,
                    password: editPassword,
                    role: editRole,
                    grade: editGrade,
                    class: editClass,
                    groupId: parseInt(editGroup)
                })
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
            */
             
                FetchData(`/api/admin/${parseInt(currentUser.id)}`,"PUT", 
                    {
                    username: editUsername,
                    password: editPassword,
                    role: editRole,
                    grade: editGrade,
                    class: editClass,
                    groupId: parseInt(editGroup)
                    });
             
            } 
            else {

            fetch(`/api/admin/${parseInt(currentUser.id)}`, {
                method: "PUT",
                headers: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: editUsername,
                    role: editRole,
                    grade: editGrade,
                    class: editClass,
                    groupId: editGroup
                })
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
        }
        setEditModal(false)
        setUsers([])
        setCurrentUser(null)
        setEditUsername("")
        setEditPassword("")
        setEditRole("")
        setEditGrade(null)
        setEditClass("")
    }

    const UserList =  () => {
        if(localStorage.getItem("access_token") && localStorage.getItem("role") == "ADMIN"){
            
             FetchData("/api/admin/","GET",localStorage.getItem("access_token"),{})
            .then(data => setUsers(data));
            
            FetchData("/api/admin/groups/", "GET", localStorage.getItem("access_token"),{})
            .then(data => setGroups(data))
            
        } else {
            const navigate = useNavigate()
            navigate('/')
        }
    };
    useEffect( () => 
        {
            UserList();
        },[]);

    useEffect( () => 
        {
            const intervalId = setInterval(() => 
                {
                    UserList();
                },900);
            return () => clearInterval(intervalId);
        },[])

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
                    return(
                        <div className="user-row" key={user.id}>
                            <div>{user.username}</div>
                            <div>{roles[user.role]}</div>
                            <div>{user.grade}</div>
                            <div>{user.class}</div>
                            <div>{/*getGroup(user.groupId)*/}</div>
                            <div>
                                <button onClick={() => {
                                    setEditModal(true)
                                    setCurrentUser(user)
                                    setEditUsername(user.username)
                                    setEditRole(user.role)
                                    setEditGrade(user.grade && user.grade)
                                    setEditClass(user.class && user.class)
                                    setEditGroup(user.groupId ? user.groupId : "")
                                }}><FaPencilAlt /></button>
                                <button onClick={() => {
                                    setDeleteModal(true)
                                    setCurrentUser(user)
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
                            setCurrentUser(null)
                        }}>Mégsem</button>
                    </div>
                </>
            } />
            <Modal isOpen={editModal} onClose={setEditModal} children={
                <>
                    <h2>Felhasználó szerkesztése</h2>
                    <form method="POST" className="edit-user-form register-login-form">

                        <input type="text" value={editUsername && editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Felhasználónév" />
                        <input type="password" onChange={(e) => setEditPassword(e.target.value)} placeholder="Jelenelegi jelszó módosítása" />
                        <select value={editRole && editRole} onChange={(e) => {
                            handleInputs(e)
                            setEditRole(e.target.value)
                        }}>
                            <option value="STUDENT">versenyző</option>
                            <option value="TEACHER">tanár</option>
                            <option value="JUDGE">zsűritag</option>
                        </select>
                        <div className={currentUser && currentUser.role != "STUDENT" ? "d-none w-500" : "w-500"} ref={competitorInfosRef}>
                            <input type="text" value={editClass && editClass} onChange={(e) => setEditClass(e.target.value)} placeholder="Osztály" />
                            <input type="number" value={editGrade && editGrade} onChange={(e) => setEditGrade(e.target.value)} min={5} max={8} placeholder="Évfolyam" />
                            <select onChange={(e) => setEditGroup(e.target.value)} value={editGroup && editGroup}>
                                <option>Válasszon!</option>
                                {groups.map(group => {
                                    return(
                                        <option key={group.id} value={parseInt(group.id)}>{group.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="edit-buttons">
                            <button onClick={(e) => {
                                
                                handleEdit(e)
                            }}>Jóváhagyás</button>
                            <button onClick={(e) => {
                                e.preventDefault()
                                setEditModal(false)
                                setCurrentUser(null)
                            }}>Mégsem</button>
                        </div>
                    </form>
                </>
            } />
        </div>
    );
}
 
export default UserList;
