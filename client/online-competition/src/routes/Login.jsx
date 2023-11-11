//ts@check
"use strict";
import { useRef } from "react";
import '../styles/LoginRegister.css';
import { useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Login = () => {
    /** @type {React.MutableRefObject<string>} */
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const navigate = useNavigate()
    /**
     * @param {React.FormEvent} event
     */
    const HandleSubmit = (event) => {
        event.preventDefault()
        fetch("/api/auth/login",  {
            method : "POST",
            headers: 
            {
                "Content-type" : "application/json"
            },
            body: JSON.stringify({
                username : usernameRef.current,
                password : passwordRef.current
            })
        })
        .then(res => res.json())
        .then(data => {
             localStorage.setItem("access_token", data);
                let decoded = jwtDecode(data);
                localStorage.setItem("role", decoded.role);
                navigate("/dashboard");
        })
        .catch(err => navigate("/error")));
    }
    return (
        <>
            <h1>Online Vetélkedő</h1>
            <form  onSubmit={HandleSubmit}>
                <h2>Jelentkezzen be!</h2>
                <input type="text" ref={usernameRef}  onChange={(e) => usernameRef.current = e.target.value} placeholder="Felhasználónév"/>
                <input type="password" ref={passwordRef} onChange={(e) => passwordRef.current = e.target.value} placeholder="Jelszó" />
                <button type="submit">Bejelentkezés</button>
            </form>
        </>
    );
}
 
export default Login;
