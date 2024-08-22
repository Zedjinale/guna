

const words = ["ასტრონავტი", "ფლამინგო", "პირამიდა", "კლავიატურა", "სოკო", "ტელესკოპი", "ვულკანი", "თავსატეხი", "მარათონი", "ჟირაფი", "კარუსელი", "რვაფეხა", "ნაბიჯი", "მზესუმზირა", "ბავშვი", "შუქურა", "სიმფონია", "ომი", "ტრომბონი", "რობოტი", "კაქტუსი", "ღუმელი", "მედუზა", "მოზაიკა", "ტორნადო", "თვითმფრინავი", "დრამი", "ფარშევანგი", "სკამი", "სასტვენი", "დელფინი", "ქანდაკება", "ლიფტი", "ხიდი", "ცისარტყელა", "მორევი", "კრისტალი", "კალეიდოსკოპი", "სტეტოსკოპი", "პინგვინი", "შადრევანი", "მანგო", "კიტრი", "არფა", "ბრილიანტი", "ამფიბია", "ჰამაკი", "გასაღები", "გვირილა", "მარმარილო", "სფინქსი", "ნოუთბუქი", "დრონი", "ბუხარი", "ქოლგა", "პლაზმა", "აისბერგი", "თუთიყუში", "სანდალი", "რაკეტა", "ჯუნგლები", "ჰორიზონტი", "წყალქვეშა ნავი", "მაიამი", "ტანგო", "ფარანი", "სკეიტბორდი", "ტრიუმფი", "ესპრესო", "საიდუმლო", "ჭაღი", "მეტეორი", "ბალიში", "ბილეთი", "მყინვარი", "ზღვის ცხენი", "ორქიდეა", "ლეპტოპი", "კიბე", "სამზარეულო", "ცათამბჯენი", "ვეშაპი", "ქურთუკი", "კანიონი", "ველოსიპედი", "ფეიერვერკი", "რვაკვუთხა", "ხალიჩა", "ვაზა", "პანდა", "ღრუბელი"];

    // Get all the divs inside the grid container
    const divs = document.querySelectorAll('.container div');
    const redScoreElement = document.getElementById('redScore');
    const blueScoreElement = document.getElementById('blueScore');

    let redScore = 0;
    let blueScore = 0;
    let gameEnded = false;

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to assign words and teams to divs
    function assignWordsAndTeams() {
        if (gameEnded) return; // Prevent reassigning if game has ended

        shuffle(words);
        
        // Create an array with 7 "blue", 7 "red", and 1 "bomb"
        let teams = ["blue", "blue", "blue", "blue", "blue", "blue", "blue",
                     "red", "red", "red", "red", "red", "red", "red",
                     "bomb"];
        
        shuffle(teams); // Shuffle the teams array

        // Assign each div a word and a team color
        divs.forEach((div, index) => {
            div.textContent = words[index]; // Assign a word
            div.dataset.team = teams[index]; // Store the team in a data attribute
            div.dataset.clicked = 'false'; // Initialize the clicked state

            // Set the color immediately based on the team or bomb
            div.classList.remove('blue', 'red', 'bomb', 'clicked-blue', 'clicked-red', 'clicked-bomb'); // Remove previous classes
            if (teams[index] === "blue") {
                div.classList.add('blue');
            } else if (teams[index] === "red") {
                div.classList.add('red');
            } else if (teams[index] === "bomb") {
                div.classList.add('bomb');
            }
        });

        // Store the game data in localStorage
        const gameData = words.map((word, index) => ({
            word: word,
            team: teams[index % teams.length], // Assign teams in a circular manner
        }));
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }



    // Add event listener to each div to reveal its team on click
divs.forEach(div => {
    div.addEventListener('click', revealTeam);
});

// Add event listener to the shuffle button
document.getElementById('shuffleButton').addEventListener('click', assignWordsAndTeams);

// Add event listener to the reset button
document.getElementById('resetButton').addEventListener('click', resetGame);

// Retrieve and use saved game data
const gameData = JSON.parse(localStorage.getItem('gameData'));

if (gameData) {
    const container = document.querySelector('.container');

    // Clear current divs before populating with saved data
    container.innerHTML = '';

    // Use the game data to populate the divs
    gameData.forEach((data) => {
        const div = document.createElement('div');
        div.textContent = data.word;
        div.dataset.team = data.team;
        div.dataset.clicked = 'false';

        // Add any necessary attributes or event listeners
        div.addEventListener('click', function() {
            // Handle the click event based on team
            if (div.dataset.clicked === 'true') return;

            div.dataset.clicked = 'true';
            if (data.team === 'blue') {
                div.style.backgroundColor = 'skyblue';
            } else if (data.team === 'red') {
                div.style.backgroundColor = 'pink';
            } else if (data.team === 'bomb') {
                div.style.backgroundColor = 'orange';
                alert("Bomb hit! Game over.");
            }
        });

        // Append the div to the container
        container.appendChild(div);
    });
} else {
    alert('No game data found! Please start the game from the explainer page.');
}

// Function to handle click on a div
function revealTeam(event) {
    if (gameEnded) return; // Prevent further clicks if game has ended

    const div = event.target;
    const team = div.dataset.team;
    
    // Check if the div has already been clicked
    if (div.dataset.clicked === 'true') {
        return; // Exit if already clicked
    }
    
    // Set the clicked state
    div.dataset.clicked = 'true';

    // Increment the score based on the team
    if (team === "blue") {
        blueScore++;
        blueScoreElement.textContent = blueScore;
        div.classList.add('clicked-blue'); // Apply clicked color for blue
    } else if (team === "red") {
        redScore++;
        redScoreElement.textContent = redScore;
        div.classList.add('clicked-red'); // Apply clicked color for red
    } else if (team === "bomb") {
        endGame("Bomb hit! Game over.");
        div.classList.add('clicked-bomb'); // Apply clicked color for bomb
        return; // End the function here if bomb is clicked
    }

    // Check for win condition
    if (redScore === 7) {
        endGame("Team Red wins!");
    } else if (blueScore === 7) {
        endGame("Team Blue wins!");
    }
}

// Function to end the game
function endGame(message) {
    gameEnded = true;
    alert(message); // Show game over message
}

// Function to reset the game
function resetGame() {
    gameEnded = false;
    redScore = 0;
    blueScore = 0;
    redScoreElement.textContent = redScore;
    blueScoreElement.textContent = blueScore;
    assignWordsAndTeams();
}

// Assign words and teams initially
assignWordsAndTeams();

// Add event listener to each div to reveal its team on click
divs.forEach(div => {
    div.addEventListener('click', revealTeam);
});

// Add event listener to the shuffle button
document.getElementById('shuffleButton').addEventListener('click', assignWordsAndTeams);

// Add event listener to the reset button
document.getElementById('shuffleButton').addEventListener('click', resetGame);




function loadGameData() {
    return JSON.parse(localStorage.getItem('gameData'));
}

document.addEventListener("DOMContentLoaded", function() {
    const gameData = loadGameData();
    const container = document.querySelector('.container');

    if (gameData) {
        gameData.forEach(data => {
            const div = document.createElement('div');
            div.textContent = data.word;
            div.dataset.team = data.team;
            div.dataset.clicked = 'false';
            container.appendChild(div);

            div.addEventListener('click', function() {
                if (div.dataset.clicked === 'true') return;

                div.dataset.clicked = 'true';

                if (data.team === 'blue') {
                    div.classList.add('clicked-blue');
                } else if (data.team === 'red') {
                    div.classList.add('clicked-red');
                } else if (data.team === 'bomb') {
                    div.classList.add('clicked-bomb');
                    alert("Bomb hit! Game over.");
                }
            });
        });
    } else {
        alert('No game data found! Please start the game from the explainer page.');
    }
});



