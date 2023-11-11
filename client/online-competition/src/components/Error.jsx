import {useEffect, useState} from "react";



const ErrorPage = (props) => 
{     
    const [error, setError] = useState("")
    useEffect( () => 
    {
        fetch("/api/error")
        .then(res => res.json())
        .then(data => setError(data))
        .catch(err => setError(error))
    });
    return (
        <>
            <h2>Error</h2>
        {!props.errorValue ? 
            <h3>HTTP error code: {error?.err || "Unknown"}</h3> :
            <h3>Page not found.</h3>
        }
        </>
    );
}

export default ErrorPage;
