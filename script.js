/* ===================================================
   Main JavaScript File for Shri Vaishnav (SVITS)
   [ This one file controls all 18 pages ]
   =================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Mobile Navigation (for all pages) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon (bars <-> times)
            const icon = hamburger.querySelector('i');
            if (icon && icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 2. Login Page Logic (Simulation) ---
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        const roleSelect = document.getElementById('role');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const togglePassword = document.getElementById('togglePassword');
        const errorMessage = document.getElementById('errorMessage');
        const loginButton = document.querySelector('.btn-login');

        // 2a. Show/Hide Password
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.classList.toggle('fa-eye');
                togglePassword.classList.toggle('fa-eye-slash');
            });
        }

        // 2b. Form Submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const role = roleSelect.value;
            const email = emailInput.value;
            const password = passwordInput.value;

            errorMessage.style.display = 'none';

            // Validation
            if (!role) {
                showError('Please select a valid role.');
                return;
            }
            if (email === '' || password === '') {
                showError('Please fill in all fields.');
                return;
            }

            // Show loading spinner
            loginButton.classList.add('loading');

            // Simulate network delay
            setTimeout(() => {
                // In a real app, you get this from the backend.
                // We'll fake a name based on the email.
                let fakeName = email.split('@')[0];
                fakeName = fakeName.charAt(0).toUpperCase() + fakeName.slice(1);
                
                // Store user info in localStorage for other pages
                localStorage.setItem('userRole', role);
                localStorage.setItem('userName', fakeName);
                
                // Redirect
                if (role === 'student') {
                    window.location.href = 'student-portal.html';
                } else if (role === 'faculty') {
                    window.location.href = 'faculty-dashboard.html';
                } else if (role === 'admin') {
                    window.location.href = 'admin-panel.html';
                }
                
                loginButton.classList.remove('loading');
            }, 1500);
        });

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    // --- 3. Portal Page Personalization & Logout ---
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutButtons = document.querySelectorAll('.btn-logout, .btn-logout-desktop');

    // 3a. Personalize Welcome Message
    if (welcomeMessage) {
        const userName = localStorage.getItem('userName');
        if (userName) {
            // Check if it's an admin page to avoid replacing static titles
            const pageTitle = welcomeMessage.textContent.toLowerCase();
            if (!pageTitle.includes('admin panel') && !pageTitle.includes('manage users') && !pageTitle.includes('manage courses') && !pageTitle.includes('analytics')) {
                 welcomeMessage.textContent = `Welcome, ${userName} 👋`;
            }
        } else {
             if (!pageTitle.includes('admin panel') && !pageTitle.includes('manage users') && !pageTitle.includes('manage courses') && !pageTitle.includes('analytics')) {
                welcomeMessage.textContent = `Welcome! 👋`;
             }
        }
    }

    // 3b. Handle Logout
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            localStorage.removeItem('token'); // For future backend use
            window.location.href = 'login.html';
        });
    });


    // --- 4. AI Chatbot Logic ---
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatLog = document.querySelector('.chatbot-log');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    if (chatbotToggler && chatbotWindow && chatbotClose) {
        // Toggle window
        chatbotToggler.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        // Send message
        if (chatSend) {
            chatSend.addEventListener('click', sendMessage);
        }
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Prevent form submission
                    sendMessage();
                }
            });
        }

        function sendMessage() {
            const messageText = chatInput.value.trim();
            if (messageText === '') return;

            // Add user message to log
            addMessageToLog(messageText, 'user');
            chatInput.value = '';

            // Get bot response
            setTimeout(() => {
                const botResponse = getBotResponse(messageText);
                addMessageToLog(botResponse.text, 'bot', botResponse.options);
            }, 1000);
        }

        function addMessageToLog(text, sender, options = []) {
            if (!chatLog) return; // Safety check
            
            const li = document.createElement('li');
            li.className = `chat-message ${sender}`;
            
            // Sanitize text before adding
            const textNode = document.createElement('div');
            textNode.textContent = text;
            li.appendChild(textNode);
            
            // Add buttons if options exist
            if (options.length > 0) {
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'options';
                options.forEach(option => {
                    const button = document.createElement('button');
                    button.className = 'option-btn';
                    button.textContent = option;
                    button.onclick = () => handleOptionClick(option);
                    optionsDiv.appendChild(button);
                });
                li.appendChild(optionsDiv);
            }

            chatLog.appendChild(li);
            // Scroll to bottom
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        function handleOptionClick(option) {
            // Treat option click like user input
            addMessageToLog(option, 'user');
            setTimeout(() => {
                const botResponse = getBotResponse(option);
                addMessageToLog(botResponse.text, 'bot', botResponse.options);
            }, 1000);
        }

        function getBotResponse(input) {
            const text = input.toLowerCase();
            let response = { text: "I'm sorry, I don't understand that. Try 'login', 'events', or 'contact'." };
            let options = [];

            if (text.includes('hi') || text.includes('hello')) {
                response.text = "Hello! I'm the SVITS assistant. How can I help you today?";
            } 
            else if (text.includes('login') || text.includes('portal')) {
                response.text = "Which portal would you like to log into? This will take you to the login page.";
                options = ['Student', 'Faculty', 'Admin'];
            } 
            else if (text.includes('student')) {
                window.location.href = 'login.html';
                response.text = "Redirecting you to the login page for students...";
            } 
            else if (text.includes('faculty') && !text.includes('search')) {
                 window.location.href = 'login.html';
                response.text = "Redirecting you to the login page for faculty...";
            }
            else if (text.includes('admin')) {
                 window.location.href = 'login.html';
                response.text = "Redirecting you to the login page for admins...";
            }
            else if (text.includes('contact') || text.includes('phone') || text.includes('email')) {
                response.text = "You can find all our contact information on the contact page. Would you like to go there?";
                options = ['Yes, go to Contact', 'No, thanks'];
            }
            else if (text.includes('yes, go to contact')) {
                window.location.href = 'contact.html';
                response.text = "Redirecting you to the contact page...";
            }
            else if (text.includes('event') || text.includes('news')) {
                response.text = "We have many exciting events! Our biggest one is the 'Innovate 2025' Tech Fest. You can find more details on our events page.";
                options = ['Go to Events Page', 'Tell me more'];
            }
            else if (text.includes('go to events page')) {
                window.location.href = 'events.html';
                response.text = "Redirecting you to the events page...";
            }
            else if (text.includes('search') || text.includes('professor') || text.includes('faculty')) {
                response.text = "You can see a list of our esteemed faculty members on the faculty page.";
                options = ['Go to Faculty Page'];
            }
            else if (text.includes('go to faculty page')) {
                window.location.href = 'faculty.html';
                response.text = "Redirecting you to the faculty page...";
            }
            else if (text.includes('help')) {
                response.text = "I can help you with the following: \n• Guide you to the login portal \n• Find information on events \n• Provide contact details \n• Help you find faculty";
            }
            
            return { text: response.text, options: options };
        }
        
        // Add initial message on load
        if (chatLog && chatLog.children.length === 0) {
             addMessageToLog("Hi there! I'm the SVITS assistant. How can I help you today? (e.g., 'login', 'events', 'contact')", 'bot');
        }
    }
    
    // --- 5. Faculty "My Courses" Page Modal Logic ---
    const uploadButtons = document.querySelectorAll('.upload-btn');
    const uploadModal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.modal .close-btn');
    const modalCourseTitle = document.getElementById('modalCourseTitle');
    const uploadFileForm = document.getElementById('uploadFileForm');

    // Open the modal and set the course title
    if (uploadButtons.length > 0) {
        uploadButtons.forEach(button => {
            button.addEventListener('click', () => {
                const courseName = button.getAttribute('data-course');
                if (modalCourseTitle) {
                    modalCourseTitle.textContent = `Upload Materials for ${courseName}`;
                }
                if (uploadModal) {
                    uploadModal.style.display = 'block';
                }
            });
        });
    }

    // Close the modal when the 'X' is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'none';
        });
    }

    // Close the modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target == uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Handle the (simulated) file upload
    if (uploadFileForm) {
        uploadFileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('fileUpload');
            const fileType = document.getElementById('fileType');
            
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                alert(`Simulating upload...\nFile: ${fileName}\nType: ${fileType.value}\n\nThis will be connected to the backend later.`);
                uploadModal.style.display = 'none';
                uploadFileForm.reset();
            } else {
                alert('Please select a file to upload.');
            }
        });
    }
    
    // --- 6. Admin Portal Form Simulations ---
    const addUserForm = document.getElementById('addUserForm');
    const addCourseForm = document.getElementById('addCourseForm');

    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Simulating user creation... This will be connected to the backend later.');
            addUserForm.reset();
        });
    }

    if (addCourseForm) {
        addCourseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Simulating course creation... This will be connected to the backend later.');
            addCourseForm.reset();
        });
    }

});