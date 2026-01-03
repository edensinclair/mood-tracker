// Assume moodData is populated with your mood tracking data from localStorage
let moodData = localStorage.getItem('moodData');
moodData = moodData ? JSON.parse(moodData) : [];

// Initialize with the latest week's data
let currentWeekData = getLastWeekData();
let moodChart = null; // Variable to hold the Chart.js instance

function displayChart() {
    const labels = currentWeekData.map(entry => entry.date);
    const moodValues = currentWeekData.map(entry => entry.mood);
    const waterValues = currentWeekData.map(entry => entry.water);
    const sleepValues = currentWeekData.map(entry => entry.sleep);
    const painValues = currentWeekData.map(entry => entry.pain);
    const stressValues = currentWeekData.map(entry => entry.stress);
    const outsideValues = currentWeekData.map(entry => entry.outside);

    const ctx = document.getElementById('mood-chart').getContext('2d');

    // Destroy existing chart if it exists
    if (moodChart) {
        moodChart.destroy();
    }

    // Adjust aspect ratio based on the window width
    let aspectRatio = 2; // Initial aspect ratio (width:height)
    if (window.innerWidth < 768) {
        aspectRatio = 0.8; // Adjust for smaller screens
    }

    moodChart = new Chart(ctx, {
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
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: aspectRatio, // Set the aspect ratio dynamically
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        precision: 0 // Prevents squishing decimal values on the y-axis
                    }
                }]
            }
        }
    });

    // Display insights
    generateInsights();
}

// Function to get data for the last week
function getLastWeekData() {
    // Assuming the data is sorted by date descending
    const now = new Date();
    const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const lastWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    return moodData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= lastWeekStart && entryDate <= lastWeekEnd;
    });
}

// Function to get data for the next week
function getNextWeekData() {
    // Assuming the data is sorted by date descending
    const now = new Date();
    const nextWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const nextWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    return moodData.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= nextWeekStart && entryDate <= nextWeekEnd;
    });
}

// Event listeners for previous and next week buttons
document.getElementById('prevWeek').addEventListener('click', () => {
    currentWeekData = getLastWeekData();
    updateChart();
});

document.getElementById('nextWeek').addEventListener('click', () => {
    currentWeekData = getNextWeekData();
    updateChart();
});

// Function to update chart with new data
function updateChart() {
    displayChart();
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
    const insightsContainer = document.getElementById('insightsList');
    insightsContainer.innerHTML = '';

    const insights = [];
    const sleepValues = currentWeekData.map(entry => entry.sleep);
    const waterValues = currentWeekData.map(entry => entry.water);
    const stressValues = currentWeekData.map(entry => entry.stress);
    const moodValues = currentWeekData.map(entry => entry.mood);
    const painValues = currentWeekData.map(entry => entry.pain);
    const outsideValues = currentWeekData.map(entry => entry.outside);

    // Calculate correlations
    const correlationSleep = calculateCorrelation(moodValues, sleepValues);
    const correlationWater = calculateCorrelation(moodValues, waterValues);
    const correlationStress = calculateCorrelation(moodValues, stressValues);
    const correlationPainStress = calculateCorrelation(painValues, stressValues);
    const correlationOutside = calculateCorrelation(moodValues, outsideValues);

    // Prepare insights based on correlations
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
    const averageSleepDuration = sleepValues.reduce((acc, val) => acc + val, 0) / sleepValues.length;
    if (averageSleepDuration > idealSleepDuration) {
        insights.push(`Getting more sleep than average might contribute to a better mood.`);
    } else if (averageSleepDuration < idealSleepDuration) {
        insights.push(`Consider adjusting your sleep schedule to get closer to ${idealSleepDuration} hours per night.`);
    }

    // Display insights in the UI
    insights.forEach(insight => {
        const listItem = document.createElement('li');
        listItem.textContent = insight;
        insightsContainer.appendChild(listItem);
    });
}

// Initial display of chart and insights
displayChart();
