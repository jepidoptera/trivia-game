// jshint esversion: 6
// jshint multistr: true
var score = 0;
var questions = [];
var currentQuestion;

class question {
    constructor(question, answers, timeallowed, rightAnswer, explanation) {
        this.text = question;
        this.answers = answers;
        this.timeallowed = timeallowed;
        this.rightAnswer = rightAnswer;
        this.explanation = explanation;
    }
    guess(number) {
        return (number == this.rightAnswer);
    }
}
function getCategories () {
    return {
    "astronomy": [
        new question("Which of these planets is the largest?",
        ["Mercury", "Venus", "Earth", "Mars"], 
        10, "c", "At 12,742 km in diameter, Earth is about 5.3% larger than Venus."),
        new question("If the sun were the size of a ping pong ball, located in Minneapolis, where might you find the next nearest star?",
        ["Saint Paul", "Pittsburg", "Antarctica", "The Moon"], 
        12, "b", "With the sun at a scale of 4cm, the next nearest star (Alpha Centauri) would be about 1,188 km away."),
        new question("Which is the largest number?",
        ["stars in the Milky Way", "humans on Earth", "age of the sun in years", "galaxies in the universe"], 
        15, "d", "There are about one to two trillion galaxies in the observable universe, more than the number of stars in the Milky Way."),
        new question("After Mars, which is the next largest object in the solar system?",
        ["Mercury", "Pluto", "Jupiter's moon Ganymede", "Saturn's moon Titan"],
        15, "c", "Ganymede is 5,268 km in diameter, larger than the planet Mercury (4,878 km)! Titan is only slightly smaller at 5,151 km.  Tiny Pluto is just 2,390km across."),
    ],
    "animals": [
        new question("What is the largest animal the has ever lived?",
        ["blue whale", "megalodon", "gigantosaurus", "ichthysaurus"], 
        10, "a", "With a mass of up to 170 metric tons, the blue whale is larger than any dinosaur ever discovered."),
        new question("Which mammal is most distantly related to humans?",
        ["kangaroo", "walrus", "elephant", "zebra"], 
        10, "a", "Kangaroos and other marsupials diverged from the rest of the mammalian evolutionary tree at least 65 million years ago."),
        new question("Which of these is not a rodent?",
        ["capybara", "chinchilla", "beaver", "elephant shrew"], 
        10, "d", "Though originally named for its trunk-like nose, it turns out that the elephant shrew is actually more closely related to elephants than to shrews.")
    ]};
}

function getCategory(categoryName) {
    return getCategories()[categoryName];
}

$('document').ready(() => {
    // choose category
    chooseCategory();
});

function beginRound() {
    $("#resultWindow").show();
    $("#questionWindow").show();
    $("#scoreWindow").show();
    $("#answersWindow").show();
    $("#countdownTimer").show();
    $("#finalScore").hide();
    $("#categories").hide();
    // clear score
    addScore(-score);
    // ask the first question
    nextQuestion();
    // on click, skip wait screen
    $("#dropdownFrame").on("mousedown", () => {
        console.log("click");
        dropScreen();
    });    
}

function postQuestion(question) {
    var letters = ["a", "b", "c", "d", "e"];
    $("#questionWindow")
        .empty()
        .text(question.text);
    $("#answersWindow")
        .empty()
        .append(
            // add the answer buttons
            question.answers.map((answer, i) => {
                return $('<button></button><br>')
                .text(letters[i] + ": " + answer)
                .on("click", () => {guessAnswer(letters[i]);})
                .addClass("answerButton");
            })
        );
    timeDown(currentQuestion.timeallowed, () => {guessAnswer("timeout");});
}

function addScore(points) {
    score += points;
    $("#scoreWindow")
    .text("SCORE: " + score)
    .addClass("pop");
    // un-pop after a moment
    setTimeout(() => {
        $("#scoreWindow").removeClass("pop");
    }, 500);
}

function guessAnswer(letterChoice) {
    var guessedRight = false;
    if (currentQuestion.guess(letterChoice)) {
        // got it
        $('#resultWindow').html('<div> <span class="correct"> Correct! </span> \ </div> \
        <div class="explanation">' + currentQuestion.explanation + '</div>');
        guessedRight = true;
    }
    else if (letterChoice == "timeout"){
        $('#resultWindow').html('<div> <span class="wrong"> Time\'s up! </span> \
        correct answer: ' + currentQuestion.rightAnswer + ' </div> \
        <div class="explanation">' + currentQuestion.explanation + '</div>');
    }
    else {
        // missed
        $('#resultWindow').html('<div> <span class="wrong"> Nope! </span> \
        correct answer: ' + currentQuestion.rightAnswer + ' </div> \
        <div class="explanation">' + currentQuestion.explanation + '</div>');
    }
    // clear timers
    timers.forEach(timer => {
        clearTimeout(timer);
    });
    // clear answer buttons
    $(".answerButton").off("click");

    // get score, clear timer
    var points = timeRemaining + 1;
    timeRemaining = 0;

    // animate score
    if (guessedRight) {
        // timer flies to score and gives that many points
        $("#countdownTimer").animate({
            "right": $("#dropdownFrame").width()/2 - $("#scoreWindow").width()/2,
            "top": $("#scoreWindow").position().top
        }, {
            duration: 500,
            complete: () => {
                $("#countdownTimer").hide();
                addScore(points);
            }
        });
    }
    else {
        // timer drops and disappears (whomp whomp)
        $("#countdownTimer").animate({
            "top": $(document).height()
        }, {
            duration: 1000,
            easing: 'easeInExpo',
            complete: () => {
                $("#countdownTimer").hide();
            }
        });
    }
    // seven seconds til next question
    // enough time to read the explainer, probably
    timers.push(setTimeout(dropScreen, 7000));
}

function dropScreen () {
    // only do this when we're ready for a new question
    if (timeRemaining > 0) return;
    // nominal timeout so this doesn't happen again by accident
    timeRemaining = 1;
    // clear explainer text
    $("#resultWindow").html("");
    // swipe frame up
    $("#dropdownFrame")
    .animate({"top": "-" + $("#dropdownFrame").height() + "px"}, {
        duration: 700,
        complete: () => {
            // bring it back down, with a new question
            $("#dropdownFrame")
            .animate({"top": "0"}, {duration: 700});
            nextQuestion();        
        }
    });
}

function nextQuestion () {
    if (questions.length == 0) {
        // out of questions - next category?
        showEndScreen();
    }
    else {
        currentQuestion = questions.shift();
        postQuestion(currentQuestion);
    }
}

function showEndScreen() {
    $("#resultWindow").hide();
    $("#questionWindow").hide();
    $("#scoreWindow").hide();
    $("#answersWindow").hide();
    $("#countdownTimer").hide();
    $("#finalScore").show().html("Round over!  Final score: " + score + 
    "<br><br>" + '<button id="categoryButton" onclick="chooseCategory()">New Category</button>');
    $("#dropdownFrame").off("mousedown");
}

function chooseCategory() {
    $("#resultWindow").hide();
    $("#questionWindow").hide();
    $("#scoreWindow").hide();
    $("#answersWindow").hide();
    $("#countdownTimer").hide();
    $("#finalScore").hide();

    // build categories list
    var categoryDivs = [];
    $.each(getCategories(), (category) => {
        categoryDivs.push($("<button>")
            .text(category)
            .attr('categoryData', category)
            .addClass("categoryButton")
            .on("click", function() {
                questions = getCategory($(this).attr('categoryData'));
                beginRound();
            })
        );
    });
    // show list
    $("#categories")
        .empty()
        .show()
        .html("<h3>Choose a category...</h3><hr>")
        .append(
            $("<div>")
            .append(categoryDivs)
    );
}

var timeRemaining = 0;
var timers = [];
function timeDown (seconds, next) {
    timeRemaining = seconds;
    console.log ("clear timers");
    timers.forEach((timer) => {clearTimeout(timer);});
    timers = [];
    // position and show the timer element
    $("#countdownTimer")
    .css({"left": "", "right": "10px", "top": "10px"})
    .show();
    // setup a cascading succession of timers
    for (i = 0; i <= seconds; i++) {
        var timeleft = seconds - i;
        timers.push(setTimeout(() => {
            $("#countdownTimer")
                .text(timeRemaining)
                // this doesn't work for some reason, had to replace the css instead (believe me, I tried and tested.  It's not working how it's supposed to...)
                .addClass("pop")
                .css({"border": "15px solid red", "border-radius": "40px", "top": "5px", "right": "5px"});
            setTimeout(() => {
                // this 
                // $("#countdownTimer").removeClass("pop");
                $("#countdownTimer").css({"border": "10px solid red", "border-radius": "35px", "top": "10px", "right": "10px"});
            }, 50);
            timeRemaining--;
            console.log("countdown: " + timeRemaining);
        }, (seconds-i) * 1000));
    }
    timers.push(setTimeout(next, seconds * 1000));
}
