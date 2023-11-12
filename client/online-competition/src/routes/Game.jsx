import React, { useState, useEffect } from "react";
import '../styles/Game.css'
import { FormatSeconds } from "../utils.js";
import { FetchData } from "../custom_hooks/getUsers.js";

const Game = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    /**
     * Get the user's and competition's data.
     */
    useEffect(() => {
        FetchData("/api/game", "GET",)

            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setUserData(data)
                }
            });
    }, []);

    const startDate = () => new Date(Date.parse(userData.startDate));
    const endDate = () => new Date(Date.parse(userData.endDate));

    return (
        <div className="pre-game">
            {error
                ? <p>{error}</p>
                : (userData
                    ? <div>
                        <h2>{userData.competitionName}</h2>
                        <p>{userData.groupName} - {userData.username}</p>
                        {startDate() > new Date()
                            ? <p>A verseny hamarosan kezdődik.</p>
                            : (endDate() < new Date()
                                ? <p>A verseny véget ért.</p>
                                : <QuestionManager endDate={endDate()} />)}
                    </div>
                    : "Loading...")}
        </div>
    );
}

const QuestionManager = ({ endDate }) => {
    const [questions, setQuestions] = useState(null);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState(null);

    const [submitResults, setSubmitResults] = useState(null);

    const [time, setTime] = useState(0);

    /**
     * Fetches the list of questions.
     */
    useEffect(() => {
        FetchData("/api/game/questions", "GET", {})
            .then(data => {
                setQuestions(data);
                setAnswers(Array(data.length).fill(""));
            });
    }, []);

    /**
     * Start a timer to measure the elapsed time.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [time]);

    /**
     * Save the answer when edited
     * @param {Event} e 
     */
    const HandleChange = (e) => {
        let newAnswers = [...answers];
        newAnswers[questionIndex] = e.target.value;
        setAnswers(newAnswers);
    }

    /**
     * Switch to the next question, or submit answers.
     */
    const Next = () => {
        if (questionIndex == questions.length - 1) {
            FetchData("/api/game/submit", "POST", {
                answers: answers.map((x, i) => ({ id: questions[i].id, answer: x })),
                time: time
            })
                .then(data => {
                    setSubmitResults(data);
                });
        } else {
            setQuestionIndex(questionIndex + 1);
        }
    }

    /**
     * Switch to the previous question.
     */
    const Prev = () => {
        if (questionIndex != 0) {
            setQuestionIndex(questionIndex - 1);
        }
    }

    /**
     * Calculate the time left until the end of the competition.
     * @returns 
     */
    const TimeLeft = () => {
        const total = Math.floor((endDate - new Date()) / 1000);
        return FormatSeconds(total);
    }

    return (
        <div className="game">
            {questions
                ? (submitResults
                    ? <div>
                        <h3>Beküldés sikeres</h3>
                        <p>Eltelt idő: {submitResults.minutes} perc</p>
                    </div>
                    : <div>
                        <h3>Segítség:</h3>
                        <ul>
                            {questions[questionIndex].hints.map(hint =>
                                <li key={hint}>
                                    {hint}
                                </li>)}
                        </ul>
                        <h3>Kitalálandó szó:</h3>
                        <h4><i>{questions[questionIndex].word}</i></h4>
                        <input type="text" placeholder="Válasz" onChange={HandleChange} key={questionIndex} defaultValue={answers[questionIndex]} />
                        <div className="button-div">
                            <button onClick={Prev} disabled={questionIndex == 0}>Előző kérdés</button>
                            <button onClick={Next}>{questionIndex == questions.length - 1 ? "Beküldés" : "Következő kérdés"}</button>
                        </div>
                        <p>Feladat: {questionIndex + 1} / {questions.length}</p>
                        <p>Eltelt idő: {time} másodperc</p>
                        <p>Hátralévő idő: {TimeLeft()}</p>
                    </div>)
                : "Loading..."}
        </div>
    );
}

export default Game;
