import {useState, useEffect} from "react";

/**
 * This function gets all users or the user with the given ID
 * @param {number} id - the users ID
 * @returns {Object} the user with the ID and the error, if ID is -1, returns all the users
 */
export function useGetUsers(id=-1) {
    const [data, setData] = useState(null);
    const [error,setError] = useState(null);
    useEffect(() => 
    {
        const has_id = id === -1 ? "/" : `/user/${id}`
        const fetchUsers = async () => {
            await fetch("/api/admin" + has_id)
            .then(res => res.json())
            .then(data => setData(data))
            .catch(error => setError(error))
        }
        fetchUsers();
    },[])
    return {data,error};
}
