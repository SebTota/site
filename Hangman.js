var canvas = document.getElementById('hangman_canvas');
var ctx = canvas.getContext("2d");
var wordsArray = ["abruptly", "askew", "azure", "buzzing", "duplex", "grogginess", "jawbreaker", "microwave",
    "thumbscrew", "wristwatch", "numbskull", "razzmatazz", "xylophone", "yachtsman", "buzz", "fizz"];
var word = wordsArray[Math.floor(Math.random() * wordsArray.length+1)];
var correctGuessArray = [];
var wrongGuesses = [];
var status = 0;

reset();

//head, body, leftarm, rightarm, leftleg, rightleg

//Hang Station
ctx.fillStyle = "#919b59";
ctx.fillRect(70,50,10,300); //long upright
ctx.fillRect(70,50,150,10); //top section
ctx.fillRect(25,350,100,10); //bottom
ctx.fillRect(220,50,10,50); //noose
drawStatus();

function checkWin() {
    if (!correctGuessArray.includes(" _ ")) {
        endGame("Nice job!")
    }
}


function loss() {
    endGame("Sorry you lost!")
}

function endGame(endMessage) {
    document.getElementById("button_submit").disabled = true;
    document.getElementById("letter_input").disabled = true;
    document.getElementById("letter_input").value = endMessage;
    document.getElementById("guess_label").innerText = "";
    for (var a=0; a < word.length; a++) {
        document.getElementById("guess_label").append(word[a]);
    }
}

function reset() {
    document.getElementById("button_submit").disabled = false;
    document.getElementById("letter_input").disabled = false;
    document.getElementById("letter_input").value = "";
    correctGuessArray = [];
    wrongGuesses = [];
    status  = 0;
    word = wordsArray[Math.floor(Math.random() * wordsArray.length+1)];
    for (var i=0; i < word.length; i++) {
        correctGuessArray.push(" _ ");
    }
    drawStatus();
}

function checkInput() {
    document.getElementById("error_label").innerText = "";
    var guessInput = document.getElementById("letter_input").value;
    var guessLower = guessInput.toLowerCase();
    document.getElementById("letter_input").value = "";
    if (guessLower.length === 1 && guessLower.match(/[a-z]/i)) {
        checkGuess(guessLower);
    } else {
        document.getElementById("error_label").innerText = "Please make sure your input is only one letter.";
    }
}

function checkGuess(guessLetter) {
    if (word.toLowerCase().includes(guessLetter)) {
        for (var i = 0, len = word.length; i < len; i++) {
            if (guessLetter === word[i].toLowerCase()) {
                correctGuessArray[i] = word[i];
                drawStatus();
                checkWin();
            }
        }
    }
    if (!word.toLowerCase().includes(guessLetter)) {
        if (wrongGuesses.includes(guessLetter)) {
            document.getElementById("error_label").innerText = "You've already made that bad guess."
        } else {
            status++;
            wrongGuesses.push(guessLetter);
        }
        drawStatus();
    }
}

function drawStatus() {
    document.getElementById("guess_label").innerText = "";
    for (var a=0; a < correctGuessArray.length; a++) {
        document.getElementById("guess_label").append(correctGuessArray[a]);
    }
    document.getElementById("wrong_guesses").innerText = "";
    for (var b=0; b < wrongGuesses.length; b++) {
        document.getElementById("wrong_guesses").append(wrongGuesses[b] + " ");
    }
    ctx.lineWidth = 5;
    if (status == 0) {
        ctx.clearRect(0, 0, 400, 400);
        ctx.fillStyle = "#919b59";
        ctx.fillRect(70,50,10,300); //long upright
        ctx.fillRect(70,50,150,10); //top section
        ctx.fillRect(25,350,100,10); //bottom
        ctx.fillRect(220,50,10,50); //noose
    }
    ctx.fillStyle = "#c14b59";
    ctx.strokeStyle = "#c14b59";
    if (status >= 1) {
        ctx.beginPath();
        ctx.arc(225,130,30,0,2 * Math.PI);
        ctx.stroke();
    }
    if (status >= 2) {
        ctx.fillRect(223, 160, 4, 100);
    }
    if (status >=3) {
        ctx.beginPath();
        ctx.moveTo(225, 190);
        ctx.lineTo(300, 150);
        ctx.stroke();
    }
    if (status >=4) {
        ctx.beginPath();
        ctx.moveTo(225, 190);
        ctx.lineTo(150, 150);
        ctx.stroke();
    }
    if (status >=5) {
        ctx.beginPath();
        ctx.moveTo(225, 260);
        ctx.lineTo(300, 300);
        ctx.stroke();
    }
    if (status >=6) {
        ctx.beginPath();
        ctx.moveTo(225, 260);
        ctx.lineTo(150, 300);
        ctx.stroke();
        loss();
    }
}
