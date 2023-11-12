import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FormatSeconds } from "../utils.js";

const Results = () => {
    const { id } = useParams()
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetch(`/api/competitions/${id}/results`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setResults(data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            {results
                ? <div className="competitions">
                    <div className="title">
                        <h1>{results.competition.name} - Eredmények</h1>
                    </div>
                    <div className="competition-header">
                        <div>Helyezés</div>
                        <div>Név</div>
                        <div>Pontszám</div>
                        <div>Idő</div>
                    </div>
                    <ul className="competition-list">
                        {results.results.map((team, index) =>
                            <li key={team.id} className="user-row">
                                <div>{index + 1}.</div>
                                <div>{team.name}</div>
                                <div>{team.score}</div>
                                <div>{team.time ? FormatSeconds(team.time) : "-"}</div>
                            </li>)}
                    </ul>
                </div>
                : "Loading"}
        </div>
    );
}

export default Results;
