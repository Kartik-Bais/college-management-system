// ================= NAVBAR & STICKY HEADER =================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle Mobile Menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon class
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Sticky Navbar Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.8rem 5%';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.padding = '1rem 5%';
        navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    }
});

// ================= STATS COUNTER ANIMATION =================
const counters = document.querySelectorAll('.counter');
let hasAnimated = false; // Run animation only once

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 100; // Speed control
        
        const updateCount = () => {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
                // Add '%' symbol if needed based on context (hardcoded for now)
                if(target === 95) counter.innerText += '%';
            }
        };
        updateCount();
    });
};

// Trigger animation when stats section is in view
const statsSection = document.getElementById('statsSection');
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasAnimated) {
        animateCounters();
        hasAnimated = true;
    }
}, { threshold: 0.5 });

if(statsSection) {
    observer.observe(statsSection);
}

// ================= CHATBOT LOGIC =================
const chatbotToggler = document.querySelector('.chatbot-toggler');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatClose = document.querySelector('.chatbot-close');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatLog = document.getElementById('chatLog');

// Toggle Chat
chatbotToggler.addEventListener('click', () => chatbotWindow.classList.add('active'));
chatClose.addEventListener('click', () => chatbotWindow.classList.remove('active'));

// Pre-defined responses (Simple AI Simulation)
const responses = {
    "fees": "The annual tuition fee for B.Tech is ₹85,000. Hostel fees are separate.",
    "admissions": "Admissions for 2026 are open. You can apply via the 'Admissions' tab in the menu.",
    "placements": "Top recruiters include TCS, Infosys, and Wipro. Avg package: 4.5 LPA.",
    "hostel": "We have separate hostels for boys and girls with WiFi and Mess facilities.",
    "default": "I'm not sure about that. Please contact admin at +91 9406661558."
};

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('chat-message', sender);
    div.innerHTML = `<p>${text}</p>`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto scroll to bottom
}

function handleChat() {
    const userText = chatInput.value.trim();
    if (!userText) return;

    // Add User Message
    addMessage(userText, 'user');
    chatInput.value = '';

    // Simulate Bot Delay
    setTimeout(() => {
        const lowerText = userText.toLowerCase();
        let botResponse = responses["default"];

        // Simple keyword matching
        for (const key in responses) {
            if (lowerText.includes(key)) {
                botResponse = responses[key];
                break;
            }
        }
        addMessage(botResponse, 'bot');
    }, 600);
}

// Event Listeners for Chat
chatSend.addEventListener('click', handleChat);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});

// Function for Option Buttons (called from HTML)
window.sendQuery = function(query) {
    chatInput.value = query;
    handleChat();
}







// ================= TIMELINE ANIMATION =================
const timelineItems = document.querySelectorAll('.timeline-item');

const animateTimeline = () => {
    const triggerBottom = window.innerHeight / 5 * 4;
    
    timelineItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if(itemTop < triggerBottom) {
            item.classList.add('show');
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        } else {
            item.style.opacity = '0'; // Initial state control via CSS
        }
    });
};

window.addEventListener('scroll', animateTimeline);




// ================= FORM SUBMISSION SIMULATION =================
const admissionForms = document.querySelectorAll('form');

admissionForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalText = btn.innerText;
        
        // Loading State
        btn.innerText = 'Submitting...';
        btn.style.opacity = '0.7';
        
        // Simulate Server Delay
        setTimeout(() => {
            alert("Thank you! Your inquiry has been received. Our admission counselor will contact you shortly.");
            this.reset();
            btn.innerText = originalText;
            btn.style.opacity = '1';
        }, 1500);
    });
});






document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CLUB FILTERING LOGIC ---
    const filterBtns = document.querySelectorAll('.club-filter');
    const clubCards = document.querySelectorAll('.club-card-wrapper');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            clubCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                    // Optional: Re-trigger animation
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = 'fadeInUp 0.6s forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 2. JOIN CLUB INTERACTION ---
    // (This function is called inline in your HTML: onclick="joinClub(...)")
    window.joinClub = function(btn, clubName) {
        // Simulating a backend call
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Joined';
            btn.style.background = '#28a745';
            btn.style.color = 'white';
            btn.style.borderColor = '#28a745';
            alert(`🎉 Congratulations! You have successfully sent a request to join ${clubName}.`);
        }, 1000);
    };

    // --- 3. RSVP BUTTONS ---
    const rsvpBtns = document.querySelectorAll('.card-advanced button');
    rsvpBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if(this.innerText === "RSVP") {
                this.innerText = "Registered";
                this.style.background = "#28a745"; // Green
                this.style.borderColor = "#28a745";
            }
        });
    });

    // --- 4. SCROLL ANIMATION (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.animate-up').forEach((el) => observer.observe(el));
});






document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. ROOM ALLOCATION LOGIC =================
    const beds = document.querySelectorAll('.bed-unit');

    beds.forEach(bed => {
        bed.addEventListener('click', function() {
            const roomNo = this.getAttribute('data-room');

            // Case 1: Room is Occupied
            if (this.classList.contains('occupied')) {
                alert(`Room ${roomNo} is already occupied by another student.`);
                return;
            }

            // Case 2: Room is Available (Booking Logic)
            if (this.classList.contains('available')) {
                const confirmBooking = confirm(`Do you want to request a change to Room ${roomNo}?`);
                
                if (confirmBooking) {
                    // Simulate Booking API Call
                    this.classList.remove('available');
                    this.classList.add('occupied');
                    
                    // Update UI text
                    this.querySelector('.bed-status').innerText = "Requested";
                    this.querySelector('.bed-icon').style.color = "#ffc107"; // Yellow for pending
                    this.style.backgroundColor = "#fffbeb";
                    this.style.borderColor = "#fcd34d";

                    alert(`Request sent to Warden for Room ${roomNo}.`);
                }
            }
        });
    });


    // ================= 2. GATE PASS FORM SUBMISSION =================
    const gateForm = document.getElementById('gatePassForm');
    
    if(gateForm) {
        gateForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Get Values
            const date = this.querySelector('input[type="datetime-local"]').value;
            const reason = this.querySelector('input[type="text"]').value;

            if(!date || !reason) return;

            // 2. Format Date (Simple format)
            const dateObj = new Date(date);
            const dateString = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

            // 3. Create New Ticket HTML
            const historyContainer = document.getElementById('passHistory');
            
            const newTicket = document.createElement('div');
            newTicket.className = 'pass-ticket pending animate-up'; // Add pending class
            newTicket.innerHTML = `
                <div>
                    <h5 style="margin:0; font-size:0.9rem;">${reason}</h5>
                    <p style="margin:0; font-size:0.8rem; color:#666;">${dateString} (Pending)</p>
                </div>
                <span style="font-size:0.8rem; font-weight:600; color:#d97706;">Processing</span>
            `;

            // 4. Prepend to list (Add to top)
            historyContainer.insertBefore(newTicket, historyContainer.firstChild);

            // 5. Reset Form & Alert
            this.reset();
            alert("Gate pass application submitted successfully!");
        });
    }

    // ================= 3. EMERGENCY BUTTON =================
    const sosBtns = document.querySelectorAll('.btn-primary');
    sosBtns.forEach(btn => {
        if(btn.innerText.includes('Emergency Call')) {
            btn.addEventListener('click', () => {
                alert("Initiating call to Warden (Mr. Sharma)...");
                window.location.href = "tel:+919876500000";
            });
        }
    });

});







document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. DOCUMENT FILTERING LOGIC =================
    const filterBtns = document.querySelectorAll('.doc-filter');
    const docCards = document.querySelectorAll('.doc-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            docCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if(filterValue === 'all' || filterValue === category) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    card.classList.remove('animate-up');
                    void card.offsetWidth; // Trigger reflow
                    card.classList.add('animate-up');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ================= 2. DELETE DOCUMENT LOGIC =================
    // Function attached to onclick in HTML
    window.deleteDoc = function(icon) {
        if(confirm("Are you sure you want to delete this document?")) {
            const card = icon.closest('.doc-card');
            card.style.transform = 'scale(0.9)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                // Update storage visual (Optional simulation)
                alert("Document deleted and storage freed up.");
            }, 300);
        }
    };

    // ================= 3. DRAG & DROP UPLOAD LOGIC =================
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    if(dropZone && fileInput) {
        // Trigger file input on click
        dropZone.addEventListener('click', () => fileInput.click());

        // Drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        // Handle File Drop
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });

        // Handle File Select
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            if(files.length > 0) {
                const file = files[0];
                
                // Simulate Upload
                const btn = document.querySelector('.modal-box .btn-primary');
                const originalText = btn.innerText;
                
                btn.innerText = "Uploading...";
                
                setTimeout(() => {
                    // Close Modal
                    document.querySelector('.modal-overlay').classList.remove('open');
                    
                    // Add new card to grid (Visual Simulation)
                    addNewCard(file.name);
                    
                    // Reset Button
                    btn.innerText = originalText;
                    alert("Document Uploaded Successfully!");
                }, 1500);
            }
        }
    }

    // Helper to add new card dynamically
    function addNewCard(fileName) {
        const grid = document.querySelector('.doc-grid');
        const newCard = document.createElement('div');
        newCard.className = 'doc-card animate-up';
        newCard.setAttribute('data-category', 'others');
        
        const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        newCard.innerHTML = `
            <div class="doc-badge badge-pending"><i class="fas fa-clock"></i> Verifying</div>
            <div class="doc-icon-preview">
                <i class="fas fa-file-alt" style="color: #6b7280;"></i>
            </div>
            <div class="doc-meta">
                <h4>${fileName}</h4>
                <p>Uploaded: ${date} • 0.5 MB</p>
            </div>
            <div class="doc-actions">
                <i class="fas fa-eye action-icon"></i>
                <i class="fas fa-download action-icon"></i>
                <i class="fas fa-trash action-icon delete" onclick="deleteDoc(this)"></i>
            </div>
        `;
        
        // Add as first item
        grid.insertBefore(newCard, grid.firstChild);
    }
});












