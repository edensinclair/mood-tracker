// Assume moodData is populated with your mood tracking data from localStorage
let moodData = localStorage.getItem('moodData');
moodData = moodData ? JSON.parse(moodData) : [];

function displayChart() {
    const labels = moodData.map(entry => entry.date);
    const moodValues = moodData.map(entry => entry.mood);
    const waterValues = moodData.map(entry => entry.water);
    const sleepValues = moodData.map(entry => entry.sleep);
    const painValues = moodData.map(entry => entry.pain);
    const stressValues = moodData.map(entry => entry.stress);
    const outsideValues = moodData.map(entry => entry.outside);

    const ctx = document.getElementById('mood-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Mood',
                    data: moodValues,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Water Intake (l)',
                    data: waterValues,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                {
                    label: 'Sleep',
                    data: sleepValues,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
                {
                    label: 'Pain Levels',
                    data: painValues,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                },
                {
                    label: 'Stress Levels',
                    data: stressValues,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                },
                {
                    label: 'Time Spent Outside',
                    data: outsideValues,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                },
            ]
        }
    });

    // Display insights
    displayInsights();
}

function displayInsights() {
    const insightsContainer = document.getElementById('insightsList');
    const insights = generateInsights();

    insights.forEach(insight => {
        const li = document.createElement('li');
        li.textContent = insight;
        insightsContainer.appendChild(li);
    });
}

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
    const painValues = moodData.map(entry => entry.pain);
    const outsideValues = moodData.map(entry => entry.outside);

    // Calculate correlations
    const correlationSleep = calculateCorrelation(moodValues, sleepValues);
    const correlationWater = calculateCorrelation(moodValues, waterValues);
    const correlationStress = calculateCorrelation(moodValues, stressValues);
    const correlationPainStress = calculateCorrelation(painValues, stressValues);
    const correlationOutside = calculateCorrelation(moodValues, outsideValues);

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

    if (correlationPainStress > 0.5) {
        insights.push(`Higher pain levels tend to correlate with higher stress levels.`);
    } else if (correlationPainStress < -0.5) {
        insights.push(`Lower pain levels tend to correlate with lower stress levels.`);
    }

    if (correlationOutside > 0.5) {
        insights.push(`Spending more time outside seems to positively influence mood.`);
    } else if (correlationOutside < -0.5) {
        insights.push(`Less time spent outside might negatively impact mood.`);
    }

    // Additional insights based on ideal sleep duration
    const idealSleepDuration = 8; // Ideal sleep duration in hours
    const averageSleepDuration = sleepValues.reduce((acc, value) => acc + value, 0) / sleepValues.length;

    if (averageSleepDuration >= idealSleepDuration) {
        insights.push(`Your average sleep duration meets or exceeds the recommended 8 hours per day.`);
    } else if (averageSleepDuration < idealSleepDuration) {
        insights.push(`Your average sleep duration is below the recommended 8 hours per day, which may affect mood.`);
    }

    // Additional insights based on ideal water intake
    const idealWaterIntake = 2; // Ideal water intake in liters
    const averageWaterIntake = waterValues.reduce((acc, value) => acc + value, 0) / waterValues.length;

    if (averageWaterIntake >= idealWaterIntake) {
        insights.push(`Your average water intake meets or exceeds the recommended 2 liters per day.`);
    } else {
        insights.push(`Your average water intake is below the recommended 2 liters per day, which may affect mood.`);
    }

    return insights;
}

document.addEventListener('DOMContentLoaded', displayChart);
