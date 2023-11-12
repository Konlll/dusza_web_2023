import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import '../styles/userAndGroupList.css'

const AssignGroups = () => {
    const { id } = useParams()
    const [competition, setCompetition] = useState(null);
    const [groups, setGroups] = useState(null);

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

    useEffect(() => {
        fetchData();
    }, []);

    const AssignGroup = (group) => {
        fetch(`/api/admin/groups/${group.id}/assign`, {
            method: "POST",
            headers:
            {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                competition: competition.id
            })
        })
            .then(res => fetchData())
            .catch(err => console.log(err));
    };

    const UnassignGroup = (group) => {
        fetch(`/api/admin/groups/${group.id}/unassign`, {
            method: "POST",
            headers:
            {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                "Content-type": "application/json"
            },
        })
            .then(res => fetchData())
            .catch(err => console.log(err));
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
