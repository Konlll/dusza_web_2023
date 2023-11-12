import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FetchData } from "../custom_hooks/getUsers";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [grade, setGrade] = useState("");
    const [classValue, setClass] = useState("");

    const navigate = useNavigate();

    /** 
     * Registers a new user.
     * @param {React.FormEvent} event
     */
    const handleRegister = (event) => {
        event.preventDefault();

        FetchData("/api/auth/register", "POST", {
            username: username,
            password: password,
            role: role,
            grade: parseInt(grade) || null,
            class: classValue || null
        })
            .then(data => navigate('/dashboard'));
    }

    return (
        <form className="register-login-form" onSubmit={handleRegister}>
            <h2>Felhasználó regisztrálása</h2>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" required placeholder="Felhasználónév" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required placeholder="Jelszó" />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Válasszon!</option>
                <option value="STUDENT">Versenyző</option>
                <option value="TEACHER">Tanár</option>
                <option value="JUDGE">Zsűritag</option>
            </select>
            {/* Ha versenyző*/}
            <div className={role == "STUDENT" ? "w-500" : "d-none"}>
                <input value={grade} onChange={(e) => setGrade(e.target.value)} type="number" min={5} max={8} placeholder="Évfolyam" />
                <input value={classValue} onChange={(e) => setClass(e.target.value)} type="text" placeholder="Osztály" />
            </div>

            <button type="submit">Regisztráció</button>
        </form>
    );
}

export default Register;
