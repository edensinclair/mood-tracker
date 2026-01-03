// Example moodData (replace with your actual data)
let moodData = [
    { date: '2024-06-01', mood: 7, sleep: 8, water: 5, stress: 3 },
    { date: '2024-06-02', mood: 6, sleep: 7, water: 4, stress: 5 },
    { date: '2024-06-03', mood: 8, sleep: 9, water: 6, stress: 2 },
    { date: '2024-06-04', mood: 5, sleep: 6, water: 3, stress: 7 },
    { date: '2024-06-05', mood: 7, sleep: 8, water: 5, stress: 4 },
    { date: '2024-06-06', mood: 6, sleep: 7, water: 4, stress: 5 },
    { date: '2024-06-07', mood: 8, sleep: 9, water: 6, stress: 3 }
];

// Function to calculate Pearson correlation coefficient
function calculateCorrelation(xArray, yArray) {
    const n = xArray.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += xArray[i];
        sumY += yArray[i];
        sumXY += xArray[i] * yArray[i];
        sumX2 += Math.pow(xArray[i], 2);
        sumY2 += Math.pow(yArray[i], 2);
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt((n * sumX2 - Math.pow(sumX, 2)) * (n * sumY2 - Math.pow(sumY, 2)));

    if (denominator === 0) {
        return 0; // Avoid division by zero
    }

    return numerator / denominator;
}

// Function to generate insights based on mood data
function generateInsights() {
    const sleepValues = moodData.map(entry => entry.sleep);
    const waterValues = moodData.map(entry => entry.water);
    const stressValues = moodData.map(entry => entry.stress);

    const moodValues = moodData.map(entry => entry.mood);

    // Calculate correlations
    const correlationSleep = calculateCorrelation(moodValues, sleepValues);
    const correlationWater = calculateCorrelation(moodValues, waterValues);
    const correlationStress = calculateCorrelation(moodValues, stressValues);

    // Prepare insights based on correlations
    const insights = [];

    if (correlationSleep > 0.5) {
        insights.push(`Higher mood scores correlate positively with better sleep.`);
    } else if (correlationSleep < -0.5) {
        insights.push(`Lower mood scores correlate negatively with poor sleep.`);
    }

    if (correlationWater > 0.5) {
        insights.push(`Drinking more water seems to positively affect mood.`);
    } else if (correlationWater < -0.5) {
        insights.push(`Low water intake might contribute to lower mood scores.`);
    }

    if (correlationStress > 0.5) {
        insights.push(`Reducing stress levels may lead to higher mood scores.`);
    } else if (correlationStress < -0.5) {
        insights.push(`High stress levels appear to correlate with lower mood.`);
    }

    return insights;
}

// Function to display insights on the webpage
function displayInsights() {
    const insightsContainer = document.getElementById('insightsContainer');
    const insights = generateInsights();

    insights.forEach(insight => {
        const div = document.createElement('div');
        div.classList.add('insight');
        div.textContent = insight;
        insightsContainer.appendChild(div);
    });
}

// Display mood chart and insights when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Display mood chart (replace with your chart code)
    const ctx = document.getElementById('mood-chart').getContext('2d');
    const moodValues = moodData.map(entry => entry.mood);
    const labels = moodData.map(entry => entry.date);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood',
                data: moodValues,
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                        max: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Mood Score'
                    }
                }]
            }
        }
    });

    // Display insights
    displayInsights();
});
