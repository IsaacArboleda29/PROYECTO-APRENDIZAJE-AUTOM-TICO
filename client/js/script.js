document.getElementById('predictForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const team1 = document.getElementById('team1').value;
    const team2 = document.getElementById('team2').value;

    const randomPercentage = (Math.random() * 100).toFixed(2);

    const result = `${team1} tiene ${randomPercentage}% de probabilidad de ganar contra ${team2}`;

    document.getElementById('result').innerText = result;
});
