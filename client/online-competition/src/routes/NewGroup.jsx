import { useRef } from "react"
import { useNavigate } from "react-router-dom"

const NewGroup = () => {
    const nameRef = useRef(null)
    const descriptionRef = useRef(null)

    const navigate = useNavigate()

    const competitorInfosRef = useRef(null)
    /** 
     * @param {React.FormEvent} event
     */
    const handleAddNewGroup = (event) => {
        event.preventDefault()
        fetch(`/api/admin/groups/`, 
            {
                method: "POST",
                headers: 
                {
                    "Content-type" : "application/json",
                    authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(
                    {
                        name: nameRef.current.value,
                        description: descriptionRef.current.value
                    })
            }).then(res => res.json()).then(data => {
                console.log(data)
            });
            navigate('/groups')
    }

    return (
        <form className="register-login-form" onSubmit={handleAddNewGroup}>
            <h2>Új csoport létrehozása</h2>
            <input ref={nameRef} type="text" placeholder="Csoport neve" />
            <input ref={descriptionRef} type="text" placeholder="Csoport leírása" />

            <button type="submit">Csoport létrehozása</button>
        </form>
    );
}
 
export default NewGroup;