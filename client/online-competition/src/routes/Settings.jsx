import { useState } from "react";
import '../styles/Settings.css'

const Settings = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");

    const ChangeSettings = (e) => {
        e.preventDefault();
        //TODO: fetch and post the settings and get it from the database
    }
    return (
        <div className="settings">
            <h2>Beállítások szerkesztése</h2>
            <form onSubmit={ChangeSettings}>
                <input type="text" placeholder="A weboldal új neve" onChange={(e) => setTitle((prev) => prev = e.target.value)} />
                <input type="text" placeholder="A weboldal új leírása" onChange={(e) => setDesc((prev) => prev = e.target.value)} />
                <input type="file" accept=".png, .jpg, .jpeg, .ico" />
                <button>Bevitel</button>
            </form>
        </div>
    )
}

export default Settings;
