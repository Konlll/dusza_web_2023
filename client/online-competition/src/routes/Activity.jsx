import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

const chartConfig = {
    responsive: true,
    plugins: {
        legend: { display: false }
    }
}

const GenerateChartData = (activity) => {
    const names = activity.teachers.map(x => x.name).slice(0, 5);
    const totals = activity.teachers.map(x => x.total).slice(0, 5);

    return {
        labels: names,
        datasets: [{
            data: totals,
            backgroundColor: "darkred"
        }]
    };
};

const Activity = () => {
    const [activity, setActivity] = useState(null);

    useEffect(() => {
        fetch(`/api/activity`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setActivity(data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <div>
            {activity ?
                <div>
                    <div style={{ maxWidth: "50%" }}>
                        <Bar options={chartConfig} data={GenerateChartData(activity)} />
                    </div>
                    <table style={{ width: "50%", textAlign: "center" }}>
                        <caption>Tanárok</caption>
                        <thead>
                            <tr>
                                <th>Név</th>
                                {activity.grades.map(grade => <th key={grade}>{grade}.</th>)}
                                <th>Összesen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activity.teachers.map(teacher =>
                                <tr key={teacher.id}>
                                    <td>{teacher.name}</td>
                                    {activity.grades.map(grade =>
                                        <td key={`${teacher.id}-${grade}`}>{teacher.grades.find(x => x.grade == grade)?._count || "0"}</td>)}
                                    <td>{teacher.total}</td>
                                </tr>)}
                        </tbody>
                    </table>
                </div> : "Loading..."
            }
        </div >
    );
}

export default Activity;