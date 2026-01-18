// grievance.js

// 1. Mock Data (History)
const grievances = [
    {
        id: "GR-2024",
        category: "Academic",
        subject: "Marks Discrepancy in SEM 5",
        date: "10 Jan 2026",
        status: "Resolved",
        priority: "High",
        desc: "I received 28 marks in DBMS but I was expecting above 40. Please recheck my answer sheet.",
        chat: [
            { sender: "student", text: "I have uploaded the revaluation form copy.", time: "10 Jan" },
            { sender: "admin", text: "Received. We are verifying with the exam cell.", time: "11 Jan" },
            { sender: "admin", text: "Correction made. Updated marks is 42.", time: "13 Jan" }
        ]
    },
    {
        id: "GR-2029",
        category: "Infrastructure",
        subject: "Water Cooler Repair",
        date: "14 Jan 2026",
        status: "Pending",
        priority: "Medium",
        desc: "The water cooler on the 2nd floor (C-Block) is leaking and not cooling water.",
        chat: []
    },
    {
        id: "GR-2033",
        category: "Hostel",
        subject: "Wi-Fi Connectivity Issue",
        date: "15 Jan 2026",
        status: "In Progress",
        priority: "Low",
        desc: "Wi-Fi signal is very weak in Room 304.",
        chat: [
            { sender: "admin", text: "Technician scheduled for tomorrow 10 AM.", time: "15 Jan" }
        ]
    }
];

// 2. Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderGrievanceTable(grievances);
});

// 3. Render Table
function renderGrievanceTable(data) {
    const tbody = document.getElementById('grievanceTableBody');
    tbody.innerHTML = '';

    data.forEach(item => {
        // Dynamic Status Coloring
        let statusClass = 'status ';
        if (item.status === 'Resolved') statusClass += 'active'; // Green
        else if (item.status === 'Pending') statusClass += 'inactive'; // Red/Yellow
        else statusClass += ''; 
        
        let statusStyle = item.status === 'In Progress' ? 'background: #e0f2fe; color: #0284c7;' : '';

        const row = `
            <tr>
                <td><strong>#${item.id}</strong></td>
                <td>
                    ${item.category}
                    <div style="margin-top:2px;"><span class="badge badge-${item.priority}">${item.priority}</span></div>
                </td>
                <td>${item.date}</td>
                <td><span class="${statusClass}" style="${statusStyle}">${item.status}</span></td>
                <td>
                    <button class="btn" style="padding: 6px 12px; font-size: 0.8rem;" onclick="openTicket('${item.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// 4. Form Submit
document.getElementById('grievanceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const category = document.getElementById('grievanceType').value;
    const priority = document.getElementById('priority').value;
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const isAnon = document.getElementById('isAnonymous').checked;

    alert(`Grievance Submitted Successfully!\nTicket ID Generated.\nAnonymous: ${isAnon ? "Yes" : "No"}`);
    
    // Add to table (Simulation)
    const newGrievance = {
        id: `GR-${Math.floor(Math.random()*9000)+1000}`,
        category: category,
        subject: subject,
        date: "Just Now",
        status: "Pending",
        priority: priority,
        desc: description,
        chat: []
    };
    
    grievances.unshift(newGrievance);
    renderGrievanceTable(grievances);
    this.reset();
});

// 5. Open Modal
function openTicket(id) {
    const ticket = grievances.find(g => g.id === id);
    if(!ticket) return;

    // Fill Details
    document.getElementById('modalTitle').innerText = `Ticket #${ticket.id}`;
    document.getElementById('modalSubject').innerText = ticket.subject;
    document.getElementById('modalCategory').innerText = ticket.category;
    document.getElementById('modalPriority').innerText = ticket.priority;
    document.getElementById('modalDesc').innerText = ticket.desc;

    // Timeline Visuals
    updateTimeline(ticket.status);

    // Fill Chat
    const chatBox = document.getElementById('modalChat');
    chatBox.innerHTML = '';
    if(ticket.chat.length === 0) {
        chatBox.innerHTML = '<p style="text-align:center; opacity:0.5; margin-top:20px;">No discussion yet.</p>';
    } else {
        ticket.chat.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-msg ${msg.sender}`;
            msgDiv.innerHTML = `${msg.text} <span class="chat-meta">${msg.time}</span>`;
            chatBox.appendChild(msgDiv);
        });
    }

    document.getElementById('ticketModal').style.display = 'block';
}

// 6. Update Timeline Logic
function updateTimeline(status) {
    const steps = document.querySelectorAll('.step');
    steps.forEach(s => s.classList.remove('active', 'completed'));

    let progressIndex = 0; // Default Pending
    if (status === 'In Progress') progressIndex = 1;
    if (status === 'Resolved') progressIndex = 3;

    for(let i=0; i<=3; i++) {
        if (i < progressIndex) steps[i].classList.add('completed');
        else if (i === progressIndex) steps[i].classList.add('active');
        
        // Special case: if resolved, all previous are completed
        if(status === 'Resolved') steps[i].classList.add('completed');
    }
}

// 7. Send Chat Reply
function sendReply() {
    const input = document.getElementById('chatReplyInput');
    const text = input.value;
    if(!text) return;

    const chatBox = document.getElementById('modalChat');
    if(chatBox.querySelector('p')) chatBox.innerHTML = ''; // Remove 'empty' msg

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg student`;
    msgDiv.innerHTML = `${text} <span class="chat-meta">Just Now</span>`;
    chatBox.appendChild(msgDiv);
    
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';
}

// 8. Close Modal
function closeModal() {
    document.getElementById('ticketModal').style.display = 'none';
}
window.onclick = function(event) {
    const modal = document.getElementById('ticketModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 9. Filter Logic
function filterGrievances() {
    const status = document.getElementById('statusFilter').value;
    if(status === 'All') {
        renderGrievanceTable(grievances);
    } else {
        const filtered = grievances.filter(g => g.status === status);
        renderGrievanceTable(filtered);
    }
}