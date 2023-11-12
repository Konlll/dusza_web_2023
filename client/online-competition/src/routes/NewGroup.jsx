import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FetchData } from "../custom_hooks/getUsers";

const NewGroup = () => {
    const nameRef = useRef(null);
    const descriptionRef = useRef(null);
    const navigate = useNavigate();

    /** 
     * Creates a new group.
     * @param {React.FormEvent} event
     */
    const handleAddNewGroup = (event) => {
        event.preventDefault()
        FetchData("/api/admin/groups/", "POST", {
            name: nameRef.current.value,
            description: descriptionRef.current.value
        }).then(data => navigate('/groups'));
    }

    return (
        <form className="register-login-form" onSubmit={handleAddNewGroup}>
            <h2>Új csoport létrehozása</h2>
            <input ref={nameRef} type="text" required placeholder="Csoport neve" />
            <input ref={descriptionRef} type="text" required placeholder="Csoport leírása" />

            <button type="submit">Csoport létrehozása</button>
        </form>
    );
}

export default NewGroup;