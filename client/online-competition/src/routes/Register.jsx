import { useRef } from "react";

const Register = () => {
    const usernameRef = useRef(null)
    const passwordRef = useRef(null)
    const roleRef = useRef(null)
    const gradeRef = useRef(null)
    const groupRef = useRef(null)

    const competitorInfosRef = useRef(null)
    
    const handleRegister = () => {
        // TODO: Handle Register
    }

    const handleInputs = (e) => {
        const div = competitorInfosRef.current
        if(e.target.value == "versenyző"){
            div.className = ""
        } else {
            div.className = "d-none"
            gradeRef.current.value = ""
            groupRef.current.value = ""
        }
    } 

    return (
        <form method="POST" onSubmit={handleRegister}>
            <h2>Felhasználó regisztrálása</h2>
            <input ref={usernameRef} type="text" placeholder="Felhasználónév" />
            <input ref={passwordRef} type="password" placeholder="Jelszó" />
            <select ref={roleRef} onChange={(e) => handleInputs(e)}>
                <option>Válasszon!</option>
                <option value="versenyző">versenyző</option>
                <option value="tanár">tanár</option>
                <option value="zsűritag">zsűritag</option>
            </select>
            {/* Ha versenyző*/}
            <div className="d-none" ref={competitorInfosRef}>
                <input ref={gradeRef} type="number" placeholder="Évfolyam" />
                <input ref={groupRef} type="text" placeholder="Csoport" />
            </div>

            <button type="submit">Regisztráció</button>
        </form>
    );
}
 
export default Register;