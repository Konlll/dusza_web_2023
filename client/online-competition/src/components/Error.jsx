import {useEffect, useState} from "react";


const ErrorPage = () => 
{   useEffect({
        const fetchError = async () => 
            {
            await fetch("/api/error")
            .then(res => res.json())
            .then(data => setError(data))
            .catch(error => setError(error));
            }
       fetchError()}
    ,[])
    const [error, setError] = useState("")
    return (
        <>
            <h2>Error</h2>
            <h3>HTTP error code: {error}</h3>
        </>
    );
}

export default ErrorPage;
