import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchData } from "../custom_hooks/getUsers.js";
import { FormatSeconds } from "../utils.js";

const Results = () => {
    const { id } = useParams()
    const [results, setResults] = useState(null);

    /**
     * Fetch a list of teams and their results.
     */
    useEffect(() => {
        FetchData(`/api/competitions/${id}/results`, "GET", {})
            .then(data => {
                setResults(data);
            })
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
