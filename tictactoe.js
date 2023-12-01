// Ask the player on startup of the page who the current player is, determines who goes first
var currentPlayer = prompt("Who is the Current Player X=1 O=2");
var fireWorksRunning = false;
var interval;

// Change turn to show who is currently going by changing innerHTML
if (currentPlayer == 1) {
    document.getElementById('turn').innerHTML = 'X Turn Now';
}
else {
    document.getElementById('turn').innerHTML = 'O Turn Now';
}

var grid = new Array(9);        // Create new array of length 9, undefined values

function resetCell() {      // Output: [1, 2, 4, 8, 16, 32, 64, 128, 256]
    for (var i = 0; i < grid.length; i++) {
        grid[i] = Math.pow(2, i);
    }
}

document.addEventListener('load', resetCell());     // When page loads, reset the cells

// Keep track of counter and the score of player x and o
var counter = 0;
var xscore, oscore;

function clickCell(x) {
    counter++;
    // if player clicked a grid already populated, alert them to pick a new grid
    if (grid[x] == 'X' || grid[x] == 'O' || grid[x] == 'W') {
        alert('Try Again OR Start New Game!!!');
        counter--;
    // if current player is 1(x) and cell is unpopulated, change the background color of the grid to green, set innerHTML to X, and set the grid value to X
    } else if (currentPlayer == 1) {
        document.getElementById(x).style.backgroundColor = 'green';
        document.getElementById(x).innerHTML = 'X';
        grid[x] = 'X';

        // call checkWinner, if true alert x is winner, disable all cells, increment score for x
        if (checkWinner() == true) {
            disableCell()
                .then(triggerFireworks)
                .then(() => {
                    alert('X is the Winner');
                    var score = document.getElementById('xscore').innerHTML;
                    score++;
                    document.getElementById('xscore').innerHTML = score;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // if false and all cells are used, alert that its a draw
        else if (checkWinner() == false && counter & 9 == 0){
            alert('Draw');
        }

        // switch player and update turn HTML
        currentPlayer = 2;
        document.getElementById('turn').innerHTML = 'O Turn Now';
    } 
    // if current player is 2(O) and cell is unpopulated, change the background color of the grid to midnightblue, set innerHTML to O, and set the grid value to O
    else {
        document.getElementById(x).style.backgroundColor = 'midnightblue';
        document.getElementById(x).innerHTML = 'O';
        grid[x] = 'O';

        // call checkWinner, if true alert o is winner, disable all cells, increment score for o
        if (checkWinner() == true) {
            disableCell()
                .then(triggerFireworks)
                .then(() => {
                    alert('O is the Winner');
                    var score = document.getElementById('oscore').innerHTML;
                    score++;
                    document.getElementById('oscore').innerHTML = score;
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // if false and all cells are used, alert that its a draw
        else if (checkWinner() == false && counter & 9 == 0){
            alert('Draw');
        }

        // switch player and update turn HTML
        currentPlayer = 1;
        document.getElementById('turn').innerHTML = 'X Turn Now';
    }
}

function checkWinner() {
    var winner = false;

    winner = 
        compare(0, 1, 2)? true :
        compare(3, 4, 5)? true :
        compare(6, 7, 8)? true :
        compare(0, 3, 6)? true :
        compare(1, 4, 7)? true :
        compare(2, 5, 8)? true :
        compare(0, 4, 8)? true :
        compare(2, 4, 6)? true :
        false;

    function compare(a, b, c) {
        return grid[a] == grid[b] && grid[b] == grid[c];
    }

    return winner;
}

function triggerFireworks() {
    return new Promise((resolve) => {
        fireWorksRunning = true;
        var duration = 5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
        function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
        }
    
        interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
    
        if (timeLeft <= 0) {
            clearInterval(interval);
            resolve();      // resolve the promise to be able to proceed to disabling cell
            fireWorksRunning = false;
        }
    
        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    });
}

function disableCell() {
    return new Promise((resolve) => {
        for (var i = 0; i < 9; i++) {
            if (grid[i] == Math.pow(2, i)) {
                document.getElementById(i).style.backgroundColor = 'black';
                document.getElementById(i).innerHTML = 'W';
                grid[i] = 'W';
            }
        }
        counter = 0;
        resolve();      // resolve the promise to be able to proceed
    });
}

function resetGame() {
    for (var i = 0; i < 9; i++) {
        grid[i] = 0;

        document.getElementById(i).style.backgroundColor = 'cadetblue';
        document.getElementById(i).innerHTML = '';
    }
    clearInterval(interval); //FIX CLEAR INTERVAL PROPERLY
    resetCell();
}

function newGame() {
    location.reload();
}