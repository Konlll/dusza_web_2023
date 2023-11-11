/* 
 * This component manages the dashboard for various users
 * each user with different role sees different things
 */

import {useEffect, useState} from "react";
import UserList from "./UserList";

const Dashboard = () => 
{
    //TODO: Handle logic between roles
    //TODO: add the ability to CRUD
    const [authentication, setAuthentication] = useState(null)

    useEffect(() => {
        if(localStorage.getItem("access_token") && localStorage.getItem("role")){
            setAuthentication(localStorage.getItem("role"))
        }
    }, [])
   
    return (
        <>
            {authentication == "ADMIN" && <UserList />}
        </>
    );
};

export default Dashboard;
