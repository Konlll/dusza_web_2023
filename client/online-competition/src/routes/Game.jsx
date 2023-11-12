import React, { useState, useEffect } from "react";

const Game = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/game`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error)
                } else {
                    setUserData(data)
                }
            })
            .catch(err => console.log(err));
    }, []);

    const startDate = () => new Date(Date.parse(userData.startDate));
    const endDate = () => new Date(Date.parse(userData.endDate));

    return (
        <div>
            {error
                ? <p>{error}</p>
                : (userData
                    ? <div>
                        <h2>{userData.competitioName}</h2>
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

    useEffect(() => {
        fetch(`/api/game/questions`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setAnswers(Array(data.length).fill(""));
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTime(time + 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [time]);

    const HandleChange = (e) => {
        let newAnswers = [...answers];
        newAnswers[questionIndex] = e.target.value;
        setAnswers(newAnswers);
    }

    const Next = () => {
        if (questionIndex == questions.length - 1) {
            fetch(`/api/game/submit`, {
                method: "POST",
                headers:
                {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    answers: answers.map((x, i) => ({ id: questions[i].id, answer: x })),
                    time: time
                })
            })
                .then(res => res.json())
                .then(data => {
                    setSubmitResults(data);
                })
                .catch(err => console.log(err));
        } else {
            setQuestionIndex(questionIndex + 1);
        }
    }

    const Prev = () => {
        if (questionIndex != 0) {
            setQuestionIndex(questionIndex - 1);
        }
    }

    const TimeLeft = () => {
        const total = Math.floor((endDate - new Date()) / 1000);

        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total - (hours * 3600)) / 60);
        const seconds = total - (hours * 3600) - (minutes * 60);

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    }

    return (
        <div>
            {questions
                ? (submitResults
                    ? <div>
                        <h3>Beküldés sikeres</h3>
                        <p>Eltelt idő: {submitResults.minutes} perc</p>
                    </div>
                    : <div>
                        <ul>
                            {questions[questionIndex].hints.map(hint =>
                                <li key={hint}>
                                    {hint}
                                </li>)}
                        </ul>
                        <h4>{questions[questionIndex].word}</h4>
                        <input type="text" placeholder="Válasz" onChange={HandleChange} key={questionIndex} defaultValue={answers[questionIndex]} />
                        <button onClick={Prev} disabled={questionIndex == 0}>Előző kérdés</button>
                        <button onClick={Next}>{questionIndex == questions.length - 1 ? "Beküldés" : "Következő kérdés"}</button>
                        <p>Feladat: {questionIndex + 1} / {questions.length}</p>
                        <p>Eltelt idő: {time}</p>
                        <p>Hátralévő idő: {TimeLeft()}</p>
                    </div>)
                : "Loading..."}
        </div>
    );
}

export default Game;
