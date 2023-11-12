import { useEffect, useState } from "react";
import React from "react";
import { FetchData } from "../custom_hooks/getUsers";
import '../styles/Intro.css'
import { Link } from "react-router-dom";

const Intro = () => {
    const [parsedResult, setParsedResult] = useState([]);
    //Fetch the data 
    useEffect(() => {
        FetchData("/api/intro/", "GET",
            localStorage.getItem("access_token"), {})
            .then(data => {
                setParsedResult(data.text.split('\n'));
            });
    }, []);
    return (
        <div className="intro">
            <h1>Bemutatkozás</h1>

            <Link to='/game'><button>Tovább a játékra</button></Link>

            {parsedResult.map((text, index) => {
                return <p key={index}>{text}</p>
            })}


        </div>
    )
};

export default Intro;
