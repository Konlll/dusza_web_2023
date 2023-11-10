//ts@check
"use strict";
import { useRef } from "react";
import '../styles/Login.css';

const Login = () => {
    /** @type {React.MutableRefObject<string>} */
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    /**
     * @param {React.FormEvent} event
     */
    const HandleSubmit = (event) => {
        event.preventDefault()
        fetch("/api/login",  {
            method : "POST",
            body: {
                username : usernameRef.current,
                password : passwordRef.current
            }
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
    return (
        <>
            <form method="POST" onSubmit={HandleSubmit}>
                <h1>Jelentkezzen be!</h1>
                <input type="text" ref={usernameRef}  onChange={(e) => usernameRef.current = e.target.value}/>
                <input type="password" ref={passwordRef} onChange={(e) => passwordRef.current = e.target.value} />
                <button type="submit">Bejelentkezés</button>
            </form>
        </>
    );
}
 
export default Login;