import React, { useRef } from "react";

const Register = () => {
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const roleRef = useRef(null)
    const gradeRef = useRef(null)
    const groupRef = useRef(null)

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
                        //TODO: implement searching group id by group name
                        // group -> database - select where name == group return id
                        username: usernameRef.current,
                        password: passwordRef.current,
                        role: roleRef.current,
                        grade: gradeRef.current,
                        group : groupRef.current
                    })
            }).then(res => res.json()).then(data => console.log(data));
    }

    const handleInputs = (e) => {
        const div = competitorInfosRef.current
        if(e.target.value == "STUDENT"){
            div.className = ""
        } else {
            div.className = "d-none"
            gradeRef.current.value = ""
            groupRef.current.value = ""
        }
    } 

    return (
        <form onSubmit={handleRegister}>
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
                <input ref={groupRef} type="text" placeholder="Csoport" />
            </div>

            <button type="submit">Regisztráció</button>
        </form>
    );
}
 
export default Register;
