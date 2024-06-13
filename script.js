document.getElementById('mood-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const mood = document.getElementById('mood').value;
    const water = document.getElementById('water').value;
    const sleep = document.getElementById('sleep').value;
    const pain = document.getElementById('pain').value;
    const stress = document.getElementById('stress').value;
    const outside = document.getElementById('outside').value;

    const data = { date, mood, water, sleep, pain, stress, outside };
    
    let moodData = localStorage.getItem('moodData');
    moodData = moodData ? JSON.parse(moodData) : [];
    
    moodData.push(data);
    localStorage.setItem('moodData', JSON.stringify(moodData));
    
    displayChart();
});

function displayChart() {
    let moodData = localStorage.getItem('moodData');
    moodData = moodData ? JSON.parse(moodData) : [];
    
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
                    label: 'Water Intake',
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
}

document.addEventListener('DOMContentLoaded', displayChart);
