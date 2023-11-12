import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip
} from 'chart.js';
import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import { FetchData } from "../custom_hooks/getUsers";

// Needed by charts.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
);

/**
 * Config for the activity chart.
 */
const chartConfig = {
    responsive: true,
    plugins: {
        legend: { display: false }
    }
}

/**
 * Generates the data to display in the chart.
 * @param {object} activity 
 * @returns 
 */
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

    /**
     * Fetch activity data.
     */
    useEffect(() => {
        FetchData("/api/activity", "GET", {})
            .then(data => {
                setActivity(data);
            })
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