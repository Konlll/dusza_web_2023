import {useEffect, useState} from "react";
import React from "react";
import { FetchData } from "../custom_hooks/getUsers";
const Intro = () => 
{
    const [parsedResult,setParsedResult] = useState([]);
    //Fetch the data 
    useEffect(() => 
        {
            FetchData("/api/intro/","GET",
            localStorage.getItem("access_token"),{})
           .then(data => 
                {
                   setParsedResult(data.text.split('\n'));
                });
        },[]);
    return (
        <>
            <h1>Bemutatkozó oldal</h1>
            {parsedResult.map((text,index) => 
                {
                    return <p key={index}>{text}</p>
                })}
                    
       </>
    )
};

export default Intro;
