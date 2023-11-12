import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import '../styles/userAndGroupList.css';
import { FetchData } from "../custom_hooks/getUsers";

const AssignGroups = () => {
    const { id } = useParams()
    const [competition, setCompetition] = useState(null);
    const [groups, setGroups] = useState(null);

    /**
     * Fetch the competition and a list of groups.
     */
    const fetchData = async () => {
        let res = await fetch(`/api/competitions/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        });
        let data = await res.json();
        setCompetition(data);

        res = await fetch(`/api/admin/groups`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
        data = await res.json();
        setGroups(data);
    }

    // Fetch data when first rendered
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Assign group to competition.
     * @param {object} group 
     */
    const AssignGroup = (group) => {
        FetchData(`/api/admin/groups/${group.id}/assign`, "POST", {
            competition: competition.id
        })
            .then(data => fetchData())
    };

    /**
     * Remove group from competition.
     * @param {object} group 
     */
    const UnassignGroup = (group) => {
        FetchData(`/api/admin/groups/${group.id}/unassign`, "POST", {
            competition: competition.id
        })
            .then(data => fetchData())
    };

    return (
        <div>
            {competition && groups ?
                <div className="assign-groups">
                    <h2>Csapatok hozzáadása</h2>
                    {groups.map(group => <div key={group.id} className="assign-group-list">
                        <span>{group.name}</span>
                        {group.competitionId == competition.id
                            ? <button className="remove" onClick={() => UnassignGroup(group)}>Eltávolítás</button>
                            : <button onClick={() => AssignGroup(group)}>Hozzáadás</button>
                        }
                    </div>)}
                </div> : <h2>Jelenleg nem található csapat</h2>}
        </div>
    );
}

export default AssignGroups;
