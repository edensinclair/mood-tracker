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

    // Show feedback message
    document.getElementById('feedback').textContent = 'Entry added successfully!';
    setTimeout(() => document.getElementById('feedback').textContent = '', 3000);

    displayEntries();
});

function displayEntries() {
    let moodData = localStorage.getItem('moodData');
    moodData = moodData ? JSON.parse(moodData) : [];

    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = '';
    moodData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date}: Mood ${entry.mood}, Water ${entry.water} litres, Sleep ${entry.sleep} hours, Pain ${entry.pain}, Stress ${entry.stress}, Outside ${entry.outside} hours`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            if (confirm('Are you sure you want to remove this entry?')) {
                moodData.splice(index, 1);
                localStorage.setItem('moodData', JSON.stringify(moodData));
                displayEntries();
            }
        };
        listItem.appendChild(removeButton);
        entriesList.appendChild(listItem);
    });
}

document.addEventListener('DOMContentLoaded', displayEntries);
