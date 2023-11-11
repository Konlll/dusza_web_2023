import { useState } from "react";
const Settings = () => 
{
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    
    const ChangeSettings = (e) => 
    {
        e.preventDefault();
        //TODO: fetch and post the settings and get it from the database
    }
    return (
          <>
            <form onSubmit={ChangeSettings}>
                <fieldset>
                    <label>Weboldal nevének megváltoztatása</label>
                   <input type="text" placeholder="A weboldal új Neve" 
                    onChange={(e) => setTitle( (prev) => prev = e.target.value)}/>
                    <br/>
                    <label>Weboldal leírásának  megváltoztatása</label>
                   <input type="text" placeholder="A weboldal új leírása" 
                    onChange={(e) => setDesc( (prev) => prev =  e.target.value)}/>
                    <label>A weboldal új logója</label> 
                   <br/>
                  <input type="file" accept=".png, .jpg, .jpeg, .ico" />
                  <input type="submit" value="Változtatás"/>
                </fieldset>
            </form>
        </>
    )
}

export default Settings;
