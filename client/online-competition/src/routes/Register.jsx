import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const roleRef = useRef(null)
    const gradeRef = useRef(null)
    const classRef = useRef(null)
    const navigate = useNavigate()

    const competitorInfosRef = useRef(null)
    /** 
     * @param {React.FormEvent} event
     */
    const handleRegister = (event) => {
        // TODO: Handle Register
        event.preventDefault()
        fetch("/api/auth/register", 
            {
                method: "POST",
                headers: 
                {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify(
                    {
                        username: usernameRef.current.value,
                        password: passwordRef.current.value,
                        role: roleRef.current.value,
                        grade: parseInt(gradeRef.current.value) || null,
                        class : classRef.current.value
                    })
            }).then(res => res.json()).then(data => {
                console.log(data)
            });
            navigate('/dashboard')
    }

    const handleInputs = (e) => {
        const div = competitorInfosRef.current
        if(e.target.value == "STUDENT"){
            div.className = ""
        } else {
            div.className = "d-none"
            gradeRef.current.value = ""
            classRef.current.value = ""
        }
    } 

    return (
        <form className="register-login-form" onSubmit={handleRegister}>
            <h2>Felhasználó regisztrálása</h2>
            <input ref={usernameRef} type="text" placeholder="Felhasználónév" />
            <input ref={passwordRef} type="password" placeholder="Jelszó" />
            <select ref={roleRef} onChange={(e) => handleInputs(e)}>
                <option>Válasszon!</option>
                <option value="STUDENT">versenyző</option> 
                <option  value="TEACHER">tanár</option>
                <option value="JUDGE">zsűritag</option>
            </select>
            {/* Ha versenyző*/}
            <div className="d-none" ref={competitorInfosRef}>
                <input ref={gradeRef} type="number" min={5} max={8} placeholder="Évfolyam" />
                <input ref={classRef} type="text" placeholder="Osztály" />
            </div>

            <button type="submit">Regisztráció</button>
        </form>
    );
}
 
export default Register;
