//ts@check
"use strict";
import { useRef } from "react";
import '../styles/LoginRegister.css';

const Login = () => {
    /** @type {React.MutableRefObject<string>} */
    const usernameRef = useRef("");
    const passwordRef = useRef("");
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
        .then(data => console.log(data))
        .catch(err => console.log(err));
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
