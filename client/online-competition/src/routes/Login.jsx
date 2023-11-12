import { useContext, useRef } from "react";
import '../styles/LoginRegister.css';
import { useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { roleContext } from "../custom_hooks/roleContext";
const Login = () => {
    /** @type {React.MutableRefObject<string>} */
    const usernameRef = useRef("");
    const passwordRef = useRef("");
    const navigate = useNavigate()
    const { role, setRole } = useContext(roleContext)
    /**
     * @param {React.FormEvent} event
     */
    const HandleSubmit = (event) => {
        event.preventDefault()
        fetch("/api/auth/login", {
            method: "POST",
            headers:
            {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                username: usernameRef.current,
                password: passwordRef.current
            })
        })
        .then(res => res.json())
        .then(data => {
             localStorage.setItem("access_token", data);
                let decoded = jwtDecode(data);
                localStorage.setItem("user_id", decoded.id);
                localStorage.setItem("role", decoded.role);
                setRole(decoded.role)
                navigate("/dashboard");
        })
        .catch(err => navigate("/error"));

    }
    return (
        <>
            <form className="register-login-form" onSubmit={HandleSubmit}>
                <h2>Jelentkezzen be!</h2>
                <input type="text" ref={usernameRef} onChange={(e) => usernameRef.current = e.target.value} placeholder="Felhasználónév" />
                <input type="password" ref={passwordRef} onChange={(e) => passwordRef.current = e.target.value} placeholder="Jelszó" />
                <button type="submit">Bejelentkezés</button>
            </form>
        </>
    );
}

export default Login;
