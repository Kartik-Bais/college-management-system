/* Filename: exam-logic.js */

// --- 1. Configuration & Data ---
const examDuration = 30 * 60; // 30 minutes in seconds
let timeLeft = examDuration;
let timerInterval;

const questionsDB = [
    {
        id: 1,
        text: "Which of the following is NOT a valid variable name in C++?",
        options: ["_myVar", "my_Var", "123Var", "Var123"],
        correct: 2
    },
    {
        id: 2,
        text: "What is the time complexity of QuickSort in the worst case?",
        options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"],
        correct: 1
    },
    {
        id: 3,
        text: "Which protocol is used to secure HTTP connections?",
        options: ["FTP", "SMTP", "SSL/TLS", "TCP"],
        correct: 2
    },
    {
        id: 4,
        text: "In React, what is used to pass data to a component from outside?",
        options: ["State", "Props", "Render", "Effect"],
        correct: 1
    },
    {
        id: 5,
        text: "Which data structure follows the LIFO principle?",
        options: ["Queue", "Tree", "Stack", "Graph"],
        correct: 2
    },
    {
        id: 6,
        text: "What does SQL stand for?",
        options: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Standard Query Level"],
        correct: 1
    },
    {
        id: 7,
        text: "Which color is #000000 in Hex?",
        options: ["White", "Red", "Blue", "Black"],
        correct: 3
    },
    {
        id: 8,
        text: "Identify the interpreted language.",
        options: ["C++", "Java", "Python", "Go"],
        correct: 2
    },
    {
        id: 9,
        text: "HTML tag for the largest heading?",
        options: ["<h6>", "<head>", "<h1>", "<header>"],
        correct: 2
    },
    {
        id: 10,
        text: "Who is known as the father of the computer?",
        options: ["Alan Turing", "Charles Babbage", "Bill Gates", "Steve Jobs"],
        correct: 1
    }
];

// State Variables
let currentQuestion = 0;
let userResponses = new Array(questionsDB.length).fill(null); // Stores selected option index
let questionStatus = new Array(questionsDB.length).fill('not-visited'); // 'answered', 'review', 'not-answered', 'not-visited'

// --- 2. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    generatePalette();
    loadQuestion(0);
});

// --- 3. Timer Logic ---
function startTimer() {
    const display = document.getElementById('examTimer');
    
    timerInterval = setInterval(() => {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        
        // Add leading zero
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        
        display.innerText = `${m}:${s}`;
        
        // Warning color
        if(timeLeft < 300) display.style.color = '#e53e3e';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam(true);
        }
        timeLeft--;
    }, 1000);
}

// --- 4. Question Loading ---
function loadQuestion(index) {
    if(index < 0 || index >= questionsDB.length) return;
    
    currentQuestion = index;
    const qData = questionsDB[index];

    // Update UI
    document.getElementById('qNum').innerText = `Question ${index + 1}`;
    document.getElementById('qText').innerText = qData.text;

    const container = document.getElementById('optionsContainer');
    container.innerHTML = ''; // Clear previous

    qData.options.forEach((opt, i) => {
        // Create Option Card
        const card = document.createElement('div');
        card.className = `option-card ${userResponses[index] === i ? 'selected' : ''}`;
        card.onclick = () => selectOption(i, card);
        
        card.innerHTML = `
            <div class="option-marker">${String.fromCharCode(65 + i)}</div>
            <div>${opt}</div>
        `;
        container.appendChild(card);
    });

    updatePalette();
}

// --- 5. Interaction Logic ---
function selectOption(optIndex, cardElem) {
    userResponses[currentQuestion] = optIndex;
    
    // Visual Update
    const allCards = document.querySelectorAll('.option-card');
    allCards.forEach(c => c.classList.remove('selected'));
    cardElem.classList.add('selected');
}

window.saveAndNext = function() {
    // Determine status
    if (userResponses[currentQuestion] !== null) {
        questionStatus[currentQuestion] = 'answered';
    } else {
        questionStatus[currentQuestion] = 'not-answered';
    }

    // Move next
    if (currentQuestion < questionsDB.length - 1) {
        loadQuestion(currentQuestion + 1);
    } else {
        updatePalette();
        alert("You have reached the last question. Click 'Submit Exam' if you are done.");
    }
};

window.markForReview = function() {
    questionStatus[currentQuestion] = 'review';
    
    if (currentQuestion < questionsDB.length - 1) {
        loadQuestion(currentQuestion + 1);
    } else {
        updatePalette();
    }
};

window.clearResponse = function() {
    userResponses[currentQuestion] = null;
    questionStatus[currentQuestion] = 'not-visited';
    loadQuestion(currentQuestion); // Reload to remove selection
};

// --- 6. Palette Logic ---
function generatePalette() {
    const grid = document.getElementById('paletteGrid');
    grid.innerHTML = '';
    
    questionsDB.forEach((_, i) => {
        const btn = document.createElement('div');
        btn.className = 'palette-item not-visited';
        btn.innerText = i + 1;
        btn.id = `pal-${i}`;
        btn.onclick = () => loadQuestion(i);
        grid.appendChild(btn);
    });
}

function updatePalette() {
    questionsDB.forEach((_, i) => {
        const btn = document.getElementById(`pal-${i}`);
        
        // Reset classes
        btn.className = 'palette-item';
        
        // Add specific status class
        if (questionStatus[i] === 'answered') btn.classList.add('answered');
        else if (questionStatus[i] === 'review') btn.classList.add('review');
        else if (questionStatus[i] === 'not-answered') btn.classList.add('not-answered');
        else btn.classList.add('not-visited');

        // Highlight current
        if (i === currentQuestion) btn.classList.add('current');
    });
}

// --- 7. Submission ---
window.submitExam = function(auto = false) {
    if (!auto && !confirm("Are you sure you want to submit? This action cannot be undone.")) return;
    
    clearInterval(timerInterval);
    
    // Calculate Score
    let score = 0;
    let correct = 0;
    let wrong = 0;

    userResponses.forEach((resp, i) => {
        if (resp === questionsDB[i].correct) {
            score += 4;
            correct++;
        } else if (resp !== null) {
            score -= 1;
            wrong++;
        }
    });

    // Replace Main Content with Result
    const mainArea = document.querySelector('.question-area');
    mainArea.innerHTML = `
        <div style="text-align:center; padding: 40px;">
            <i class="fas fa-trophy" style="font-size: 4rem; color: #ffc107; margin-bottom: 20px;"></i>
            <h2 style="color: #004a99; margin-bottom: 10px;">Exam Submitted Successfully!</h2>
            <p style="color: #666; font-size: 1.1rem;">Here is your performance summary</p>
            
            <div style="display:flex; justify-content:center; gap:30px; margin-top:30px;">
                <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1); width:150px;">
                    <h1 style="color:#004a99; margin:0;">${score}</h1>
                    <p>Total Score</p>
                </div>
                <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1); width:150px;">
                    <h1 style="color:#28a745; margin:0;">${correct}</h1>
                    <p>Correct</p>
                </div>
                <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1); width:150px;">
                    <h1 style="color:#e53e3e; margin:0;">${wrong}</h1>
                    <p>Wrong</p>
                </div>
            </div>

            <a href="student-portal.html" class="btn-primary" style="background:#004a99; display:inline-block; margin-top:40px; text-decoration:none;">Back to Dashboard</a>
        </div>
    `;
    
    // Hide Palette on Mobile
    document.querySelector('.question-palette-panel').classList.remove('open');
};