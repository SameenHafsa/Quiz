const toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", () => {
    document.body.classList.add("fade-transition");
    document.body.classList.toggle("dark-mode");
    
    setTimeout(() => {
        document.body.classList.remove("fade-transition"); 
    }, 500);
    
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

window.onload = () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};

var audio = document.getElementById("customAudio");
var isPaused = false; 

function playAudio() {
    isPaused = false; 
    audio.play();
}

function pauseAudio() {
    isPaused = true; 
    audio.pause();
}

audio.addEventListener("ended", function () {
    if (!isPaused) {
        this.currentTime = 0;
        this.play(); 
    }
});

let selectedCategory = "General Knowledge and Aptitude";
let selectedQuestions = 10;
let score = 0;
let timer;
let timeLeft = 20; 
let totalQuizTime = 120; 
let currentQuestionIndex = 0;
let selectedQuestionsList = [];


document.querySelectorAll('.catg-option').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.catg-option').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCategory = button.getAttribute('data-category');
    });
});



document.querySelector('.startquiz').addEventListener('click', () => {
    console.log(`Starting quiz with category: ${selectedCategory} and ${selectedQuestions} questions.`);
    document.querySelector('.conf-container').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'block';
    startQuiz(selectedCategory, selectedQuestions);
});


const questions = {
    "General Knowledge and Aptitude": [
        { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
        { question: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
        { question: "Who wrote '1984'?", options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.K. Rowling"], answer: "George Orwell" },
        { question: "What is the capital of Japan?", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"], answer: "Tokyo" }
    ],
    "Academics & Science": [
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
        { question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"], answer: "300,000 km/s" },
        { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], answer: "Mitochondria" },
        { question: "What is the chemical symbol for gold?", options: ["Au", "Ag", "Pb", "Fe"], answer: "Au" }
    ],
    "Programming & Tech": [
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Marking Language"], answer: "Hyper Text Markup Language" },
        { question: "What is the value of 2^3?", options: ["6", "8", "10", "12"], answer: "8" },
        { question: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
        { question: "What is the main programming language used for Android development?", options: ["Java", "Swift", "Python", "C++"], answer: "Java" },
   { question: "What does GUI stand for?", options: ["Graphical User Interface", "Graphical User Interaction", "Graphical User Integration", "Graphical User Interchange"], answer: "Graphical User Interface" },
  { question: "What does OOP stand for?", options: ["Object Oriented Programming", "Object Oriented Process", "Object Oriented Protocol", "Object Oriented Package"], answer: "Object Oriented Programming" },
        { question: "What does MVC stand for?", options: ["Model View Controller", "Model View Component", "Model View Configuration", "Model View Connection"], answer: "Model View Controller" },
        { question: "What does REST stand for?", options: ["Representational State Transfer", "Representational State Transition", "Representational State Transaction", "Representational State Transformation"], answer: "Representational State Transfer" },
        { question: "What does CRUD stand for?", options: ["Create Read Update Delete", "Create Read Update Data", "Create Read Update Document", "Create Read Update Directory"], answer: "Create Read Update Delete" },
    ],
    "Competitive Exam Preparation": [
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" },
        { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
        { question: "What is the capital of Japan?", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"], answer: "Tokyo" },
        { question: "What is the square root of 64?", options: ["6", "7", "8", "9"], answer: "8" },
        { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "NaCl"], answer: "H2O" },
        { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
        { question: "What is the chemical symbol for potassium chloride?", options: ["KCl", "KCl2", "KCl3", "KCl4"], answer: "KCl" }
    ],
    "Entertainment & Pop Culture": [
        { question: "Who is known as the King of Pop?", options: ["Elvis Presley", "Michael Jackson", "Prince", "Madonna"], answer: "Michael Jackson" },
        { question: "Which movie won the Best Picture Oscar in 2020?", options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"], answer: "Parasite" },
        { question: "Who played the character of Harry Potter in the movie series?", options: ["Daniel Radcliffe", "Rupert Grint", "Elijah Wood", "Tom Felton"], answer: "Daniel Radcliffe" },
        { question: "What is the name of the fictional city where Batman lives?", options: ["Metropolis", "Gotham", "Star City", "Central City"], answer: "Gotham" },
        { question: "Which movie features the song 'My Heart Will Go On'?", options: ["Titanic", "The Bodyguard", "Pretty Woman", "Ghost"], answer: "Titanic" },
        { question: "Which artist painted the Mona Lisa?", options: ["Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Claude Monet"], answer: "Leonardo da Vinci" }
    ],
    "Miscellaneous & Fun Topics": [
        { question: "What is the tallest animal in the world?", options: ["Elephant", "Giraffe", "Lion", "Tiger"], answer: "Giraffe" },
        { question: "What is the smallest country in the world?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: "Vatican City" },
        { question: "What is the main ingredient in guacamole?", options: ["Tomato", "Onion", "Avocado", "Pepper"], answer: "Avocado" },
        { question: "What is the most spoken language in the world?", options: ["English", "Mandarin Chinese", "Spanish", "Hindi"], answer: "Mandarin Chinese" },
        { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: "Nile" },
        { question: "What is the largest desert in the world?", options: ["Sahara", "Gobi", "Kalahari", "Arctic"], answer: "Sahara" }
    ]
};


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz(category, questionsCount) {
    selectedQuestionsList = shuffle(questions[category]).slice(0, questionsCount);
    score = 0;
    currentQuestionIndex = 0;
    totalQuizTime = questionsCount * 20;
    displayQuestion(currentQuestionIndex);
    startTimer();
    startQuizTimer();
}

function displayQuestion(index) {
    const quizContent = document.querySelector('.quizcontent');
    quizContent.innerHTML = '';

    const question = selectedQuestionsList[index];
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
        <h1 class="ques-text">${question.question}</h1>
        <ul class="answer-opts">
            ${question.options.map(option => `<li class="answer-opt" onclick="selectAnswer('${option}', ${index})">${option}</li>`).join('')}
        </ul>
    `;
    quizContent.appendChild(questionElement);

    const quesStatus = document.querySelector('.ques-status');
    quesStatus.innerHTML = `<b>${index + 1}</b> of <b>${selectedQuestionsList.length}</b> Questions.`;
}

function selectAnswer(selectedOption, questionIndex) {
    const question = selectedQuestionsList[questionIndex];
    const options = document.querySelectorAll('.answer-opt');
    options.forEach(option => {
        if (option.innerText === question.answer) {
            option.classList.add('correct');
        } else if (option.innerText === selectedOption) {
            option.classList.add('wrong');
        }
        option.onclick = null;
    });

    if (selectedOption === question.answer) {
        score++;
    }

    clearInterval(timer);
    setTimeout(() => {
        if (currentQuestionIndex < selectedQuestionsList.length - 1) {
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
            startTimer();
        } else {
            showResults();
        }
    }, 1000);
}

function startTimer() {
    timeLeft = 5;
    const timeDur = document.querySelector('.time-dur');
    timeDur.innerText = `${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timeDur.innerText = `${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            selectAnswer("", currentQuestionIndex); 
        }
    }, 1000);
}

function startQuizTimer() {
    const quizTimer = setInterval(() => {
        totalQuizTime--;

        if (totalQuizTime <= 0) {
            clearInterval(quizTimer);
            showTimeoutPage();
        }
    }, 1000);
}

function showResults() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'block';
    document.getElementById('correct-answers').innerText = score;
    document.getElementById('total-questions').innerText = selectedQuestionsList.length;
    const percentage = (score / selectedQuestionsList.length) * 100;
    document.getElementById('score-percentage').innerText = percentage.toFixed(2);
}

function showTimeoutPage() {
    document.querySelector('.quiz-container').style.display = 'none';
    document.querySelector('.result-container').style.display = 'none';
    document.querySelector('.timeout-container').style.display = 'block';
}

function restartQuiz() {
    document.querySelector('.result-container').style.display = 'none';
    document.querySelector('.timeout-container').style.display = 'none';
    document.querySelector('.conf-container').style.display = 'block';
}