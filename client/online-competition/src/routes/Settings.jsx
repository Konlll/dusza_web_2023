import { useEffect, useState } from "react";
import '../styles/Settings.css'

const Settings = () => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [files, setFiles] = useState([])

    const handleImageUpload = (e) => {
        setFiles(e.target.files)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('/api/settings', {
            method: "PUT",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                desc
            })
        })
        .then(res => res.json())
        .then(data => {
            document.title = title
            let x = window.open("", "myWindow", "toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none")
            x.localStorage.setItem("desc", data.desc)
            x.close()
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        fetch('/api/settings', {
            method: "GET",
            headers: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            setTitle(data.title)
            setDesc(data.desc)
        })
        .catch(error => console.log(error))
    }, [])

    return (
        <div className="settings">
            <h2>Beállítások szerkesztése</h2>
            <form action="PUT">
                <input type="text" placeholder="A weboldal új neve" onChange={(e) => setTitle(e.target.value)} value={title || ""} />
                <input type="text" placeholder="A weboldal új leírása" onChange={(e) => setDesc(e.target.value)} value={desc || ""} />
                <input type="file" accept=".png, .jpg, .jpeg, .ico" onChange={(e) => handleImageUpload(e)} />
                <button onClick={(e) => handleSubmit(e)}>Bevitel</button>
            </form>
        </div>
    )
}

export default Settings;
