// jshint esversion: 6
// jshint multistr: true
var score = 0;
var maxScore = 0;
var questions = [];
var category = "";
var currentQuestion;

class question {
    constructor(question, answers, timeallowed, rightAnswer, explanation) {
        this.text = question;
        this.answers = answers;
        this.timeallowed = timeallowed;
        this.rightAnswer = rightAnswer;
        this.explanation = explanation;
    }
    guess(letter) {
        return (letter == this.rightAnswer);
    }
}
function getCategories () {
    var rnd = Math.random();
    return {
    "astronomy": [
        new question("Which of these is not a planet?",
        ["Mercury", "Saturn", "Neptune", "Ceres"], 
        15, "d", "Officially classified as a dwarf planet, Ceres is the largest object in the asteroid belt."),
        new question("Which planet is furthest from the sun?",
        ["Neptune", "Saturn", "Mars", "Jupiter"], 
        15, "a", "Averaging 4.5 billion km from the sun, Neptune take almost 165 years to complete one orbit."),
        new question("Which planet is the hottest?",
        ["Jupiter", "Venus", "Mercury", "Mars"], 
        15, "b", "The surface of Venus averages 467° C, hot enough to melt lead."),
        new question("Which of these planets is the largest?",
        ["Mercury", "Venus", "Earth", "Mars"], 
        15, "c", "At 12,742 km in diameter, Earth is about 5.3% larger than Venus."),
        new question("If the sun were the size of a ping pong ball, located in Minneapolis, where might you find the next nearest star?",
        ["Saint Paul", "Pittsburg", "Antarctica", "The Moon"], 
        15, "b", "With the sun at a scale of 4cm, the next nearest star (Alpha Centauri) would be about 1,188 km away."),
        new question("Which is the largest number?",
        ["stars in the Milky Way", "humans on Earth", "age of the sun in years", "galaxies in the universe"], 
        15, "d", "There are about one to two trillion galaxies in the observable universe, more than the number of stars in the Milky Way."),
        new question("After Mars, which is the next largest object in the solar system?",
        ["Mercury", "Pluto", "Jupiter's moon Ganymede", "Saturn's moon Titan"],
        15, "c", "Ganymede is 5,268 km in diameter, larger than the planet Mercury (4,878 km)! Titan is only slightly smaller at 5,151 km.  Tiny Pluto is just 2,390km across."),
        new question("Which of these objects is largest in diameter?",
        ["neutron star", "brown dwarf", "black hole", "Earth"],
        15, "b", "Though massive, neturon stars and black holes are extremely dense, making them physically much smaller than Earth.  A brown dwarf (a would-be star too small to ignite) is nonetheless larger than Jupiter.")
    ],
    "animals": [
        new question("What is the name of the largest shark that ever lived?",
        ["megalodon", "gigantosaurus", "hammerhead", "jaws"], 
        15, "a", "Estimated to grown to over 50 feet, the megalodon preyed on early whales."),
        new question("Which animal lives the furthest north?",
        ["gazelle", "walrus", "penguin", "sloth"], 
        15, "b", "Walruses swim in the artic sea, sometimes sleeping on icebergs."),
        new question("Which of these animals can bite the hardest?",
        ["baboon", "chinchilla", "lion", "spotted hyena"], 
        15, "d", "Hyenas' powerful jaws are built for crushing bone."),
        new question("What is the largest animal the has ever lived?",
        ["blue whale", "megalodon", "gigantosaurus", "ichthysaurus"], 
        15, "a", "With a mass of up to 170 metric tons, the blue whale is larger than any dinosaur ever discovered."),
        new question("Which mammal is most distantly related to humans?",
        ["kangaroo", "walrus", "elephant", "zebra"], 
        15, "a", "Kangaroos and other marsupials diverged from the rest of the mammalian family tree at least 65 million years ago."),
        new question("Which of these is not a rodent?",
        ["capybara", "chinchilla", "beaver", "elephant shrew"], 
        15, "d", "Though originally named for its trunk-like nose, it turns out that the elephant shrew is actually more closely related to elephants than shrews."),
        new question("Which of these creatures does not lay eggs?",
        ["echidna", "giant tortise", "rattlesnake", "bullfrog"], 
        15, "c", "Many snakes do lay eggs; the rattlesnake, however, gives birth to live young."),
        new question("Which of these swims the fastest?",
        ["blue whale", "flying fish", "Michael Phelps", "sailfish"], 
        15, "d", "With a top speed comparable to that of a cheetah, the sailfish is the fastest fish in the sea.")
    ],
    "math": [
        new question("Which of these is an even number?",
        ["32", "13", "25", "37"], 
        15, "a", "That was a softball."),
        new question("What is " + (parseInt(rnd * (43) % 9) + 1) + " * " + (parseInt(rnd * (675) % 10) + 1) + "?",
        [(parseInt(rnd * (43) % 9) + 1) * (parseInt(rnd * (675) % 10) + 1), "42", "57", "63"], 
        15, "a", "You can use a calculator if you want."),
        new question("?",
        ["baboon", "chinchilla", "lion", "spotted hyena"], 
        15, "d", "Hyenas' powerful jaws are built for crushing bone."),
        new question("What is the largest animal the has ever lived?",
        ["blue whale", "megalodon", "gigantosaurus", "ichthysaurus"], 
        15, "a", "With a mass of up to 170 metric tons, the blue whale is larger than any dinosaur ever discovered."),
        new question("Which mammal is most distantly related to humans?",
        ["kangaroo", "walrus", "elephant", "zebra"], 
        15, "a", "Kangaroos and other marsupials diverged from the rest of the mammalian family tree at least 65 million years ago."),
        new question("Which of these is not a rodent?",
        ["capybara", "chinchilla", "beaver", "elephant shrew"], 
        15, "d", "Though originally named for its trunk-like nose, it turns out that the elephant shrew is actually more closely related to elephants than shrews."),
        new question("Which of these creatures does not lay eggs?",
        ["echidna", "giant tortise", "rattlesnake", "bullfrog"], 
        15, "c", "Many snakes do lay eggs; the rattlesnake, however, gives birth to live young."),
        new question("Which of these swims the fastest?",
        ["blue whale", "flying fish", "Michael Phelps", "sailfish"], 
        15, "d", "With a top speed comparable to that of a cheetah, the sailfish is the fastest fish in the sea.")
    ]};
}

function getCategory(categoryName) {
    category = categoryName;
    questions = getCategories()[category];
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
    // calculate max points
    maxScore = questions.map((question) => {return question.timeallowed * 2;})
    .reduce((sum, add) => {return sum + add;});
    console.log(maxScore);
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
        // base points = question.timeallowed
        addScore(currentQuestion.timeallowed);
        // timer flies to score and gives that many bonus points
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
    var htmlResponse = "Round over!  Final score: <span style='color: blue'>" + score + "</span> ";
    var percentage = (score / maxScore) * 100;
    htmlResponse += "(" + percentage + "%).<br><br>";
    htmlResponse += '<span style="font-size: 16pt">';
    if (percentage >= 90) {
        htmlResponse += "Wow! Fast <i>and</i> accurate!  You must be " +
        {"astronomy": "an astronomer", "animals": "a zoologist"}
        [category] + "!";
    }
    else if (percentage >= 75) {
        htmlResponse += "Solid!  You really know your stuff!";
    }
    else if (percentage >= 50) {
        htmlResponse += "Not bad!  Looks like you know a thing or two about " + category + ".";
    }
    else {
        htmlResponse += "Maybe this is not your area of expertise.";
    }
    htmlResponse += "</span>";
    htmlResponse += "<br><br>" + '<button id="categoryButton" onclick="chooseCategory()">New Category</button>';
    $("#finalScore").show().html(htmlResponse);
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
                getCategory($(this).attr('categoryData'));
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
    // clear timers
    timers.forEach((timer) => {clearTimeout(timer);});
    timers = [];
    // position and show the timer element
    $("#countdownTimer")
    .css({"left": "", "right": "20px", "top": "10px"})
    .show();
    // setup a cascading succession of timers
    for (i = 0; i <= seconds; i++) {
        var timeleft = seconds - i;
        timers.push(setTimeout(() => {
            $("#countdownTimer")
                .text(timeRemaining)
                // this doesn't work for some reason, had to replace the css instead (believe me, I tried and tested.  It's not working how it's supposed to...)
                // .addClass("pop")
                .css({"border": "15px solid red", "border-radius": "40px", "top": "5px", "right": "15px"});
            setTimeout(() => {
                // this should work, but doesn't.
                // $("#countdownTimer").removeClass("pop");
                // put it back the way it was (use css)
                $("#countdownTimer").css({"border": "10px solid red", "border-radius": "35px", "top": "10px", "right": "20px"});
            }, 50);
            timeRemaining--;
            console.log("countdown: " + timeRemaining);
        }, (seconds-i) * 1000));
    }
    timers.push(setTimeout(next, seconds * 1000));
}
