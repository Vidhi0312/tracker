document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const registerContainer = document.getElementById("registerContainer");
    const loginContainer = document.getElementById("loginContainer");
    const showRegister = document.getElementById("showRegister");
    const showLogin = document.getElementById("showLogin");

    const moodForm = document.getElementById("moodForm");
    const moodHistory = document.getElementById("moodHistory");
    const downloadBtn = document.getElementById('downloadBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const quotePopup = document.getElementById("quotePopup");
    const quoteText = document.getElementById("quoteText");
    const closeBtn = document.querySelector(".close-btn");

    const quotes = {
        happy: "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
        sad: "Every moment is a fresh beginning. - T.S. Eliot",
        angry: "For every minute you are angry, you lose sixty seconds of happiness. - Ralph Waldo Emerson",
        neutral: "In the middle of every difficulty lies opportunity. - Albert Einstein"
    };

    // User registration
    if (registerForm) {
        const users = JSON.parse(localStorage.getItem('users')) || {};
        showRegister.addEventListener("click", (event) => {
            event.preventDefault();
            registerContainer.style.display = 'block';
            loginContainer.style.display = 'none';
        });

        showLogin.addEventListener("click", (event) => {
            event.preventDefault();
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        });

        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("registerUsername").value;
            const password = document.getElementById("registerPassword").value;

            if (users[username]) {
                alert("User already exists!");
                return;
            }

            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration successful!");
            registerForm.reset();
            registerContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // User login
    if (loginForm) {
        const users = JSON.parse(localStorage.getItem('users')) || {};

        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;

            if (users[username] && users[username] === password) {
                localStorage.setItem('currentUser', username);
                window.location.href = 'home.html'; // Redirect to home page
            } else {
                alert("Invalid credentials");
            }

            loginForm.reset();
        });
    }

    // Home page functionality
    if (moodForm) {
        const moodData = JSON.parse(localStorage.getItem('moodData')) || {};
        const currentUser = localStorage.getItem('currentUser');

        if (!currentUser || !JSON.parse(localStorage.getItem('users'))[currentUser]) {
            alert("You are not logged in!");
            window.location.href = 'login.html'; // Redirect to login page
        }

        // Log mood
        moodForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const mood = document.getElementById("mood").value;
            const date = new Date().toLocaleDateString();

            if (!moodData[currentUser]) {
                moodData[currentUser] = {};
            }
            if (!moodData[currentUser][date]) {
                moodData[currentUser][date] = [];
            }
            moodData[currentUser][date].push(mood);
            localStorage.setItem('moodData', JSON.stringify(moodData));

            loadMoodHistory();
            showQuote(mood);
            moodForm.reset();
        });

        // Load mood history
        function loadMoodHistory() {
            moodHistory.innerHTML = "";
            const userMoods = moodData[currentUser] || {};
            for (const [date, moods] of Object.entries(userMoods)) {
                const li = document.createElement("li");
                li.textContent = `${date}: ${moods.join(", ")}`;
                moodHistory.appendChild(li);
            }
        }

        // Show quote pop-up
        function showQuote(mood) {
            quoteText.textContent = quotes[mood] || "Keep pushing forward!";
            quotePopup.style.display = "block";
        }

        // Close pop-up
        closeBtn.addEventListener("click", () => {
            quotePopup.style.display = "none";
        });

        // Click outside the pop-up to close
        window.onclick = (event) => {
            if (event.target === quotePopup) {
                quotePopup.style.display = "none";
            }
        };

        // Download functionality
        downloadBtn.addEventListener('click', () => {
            const moodsArray = [];
            const userMoods = moodData[currentUser] || {};

            for (const [date, moods] of Object.entries(userMoods)) {
                moodsArray.push({ Date: date, Moods: moods.join(', ') });
            }

            const ws = XLSX.utils.json_to_sheet(moodsArray);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Mood Logs");

            // Generate Excel file and trigger download
            XLSX.writeFile(wb, 'Mood_Logs.xlsx');
        });

        // Logout functionality
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            alert("You have logged out.");
            window.location.href = 'login.html'; // Redirect to login page
        });

        loadMoodHistory();
    }
});
