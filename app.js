/**
 * Hospital Management System - Frontend Logic
 * Simulated Data and UI Handling
 */

// --- Simulated Data ---
const state = {
    currentSection: 'dashboard',
    hospitalStats: {
        bedOccupancy: '82%',
        emergencyAlerts: 0,
        activeSurgeries: 4,
        pharmacyStock: 'Good'
    },
    patients: [
        { id: 'PT-1001', name: 'John Doe', age: 45, gender: 'Male', bloodGroup: 'O+', lastVisit: '2024-03-10', condition: 'Stable' },
        { id: 'PT-1002', name: 'Jane Smith', age: 32, gender: 'Female', bloodGroup: 'A-', lastVisit: '2024-03-12', condition: 'Recovering' },
        { id: 'PT-1003', name: 'Robert Johnson', age: 58, gender: 'Male', bloodGroup: 'B+', lastVisit: '2024-03-14', condition: 'Critical' },
        { id: 'PT-1004', name: 'Emily Davis', age: 27, gender: 'Female', bloodGroup: 'AB+', lastVisit: '2024-03-15', condition: 'Stable' },
    ],
    doctors: [
        { id: 'DOC-201', name: 'Dr. Sarah Connor', specialty: 'Cardiology', availability: 'Mon, Wed, Fri', rating: 4.9 },
        { id: 'DOC-202', name: 'Dr. James Wilson', specialty: 'Neurology', availability: 'Tue, Thu, Sat', rating: 4.8 },
        { id: 'DOC-203', name: 'Dr. Lisa Ray', specialty: 'Pediatrics', availability: 'Mon, Tue, Wed', rating: 5.0 },
    ],
    appointments: [
        { id: 'APT-5001', patient: 'John Doe', doctor: 'Dr. Sarah Connor', date: '2024-04-16', time: '10:00 AM', status: 'active' },
        { id: 'APT-5002', patient: 'Jane Smith', doctor: 'Dr. James Wilson', date: '2024-04-16', time: '02:30 PM', status: 'pending' },
        { id: 'APT-5003', patient: 'Emily Davis', doctor: 'Dr. Lisa Ray', date: '2024-04-17', time: '09:15 AM', status: 'cancelled' },
    ]
};

// --- DOM Elements ---
let contentArea, navLinks, modalOverlay, modalTitle, modalBody, closeModalBtn, quickAppointmentBtn;

function initDOMElements() {
    contentArea = document.getElementById('content-area');
    navLinks = document.querySelectorAll('.nav-link');
    modalOverlay = document.getElementById('modal-container');
    modalTitle = document.getElementById('modal-title');
    modalBody = document.getElementById('modal-body-content');
    closeModalBtn = document.querySelector('.btn-close-modal');
    quickAppointmentBtn = document.getElementById('btn-quick-appointment');
}

// --- Core Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    try {
        initDOMElements();
        initNavigation();
        renderSection('dashboard');
        setupModalListeners();
        setupQuickActions();
        
        // Final icon pass after initial load
        if (window.lucide) {
            lucide.createIcons();
        }
    } catch (err) {
        console.error("Initialization failed:", err);
    }
});

// --- Navigation Logic ---
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            renderSection(section);
        });
    });
}

// --- Rendering Logic ---
function renderSection(section) {
    state.currentSection = section;
    
    // Show "loading" skeleton effect
    contentArea.innerHTML = `
        <div class="skeleton-loader">
            <div class="skeleton-header"></div>
            <div class="skeleton-grid">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        </div>
    `;

    // Simulate small network delay for "human" feel
    setTimeout(() => {
        contentArea.innerHTML = '';
        contentArea.classList.remove('content-fade-in');
        void contentArea.offsetWidth;
        contentArea.classList.add('content-fade-in');

        switch(section) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'patients':
                renderPatients();
                break;
            case 'doctors':
                renderDoctors();
                break;
            case 'appointments':
                renderAppointments();
                break;
        }
        
        if (window.lucide) {
            lucide.createIcons();
        }
    }, 300);
}

function renderDashboard() {
    const lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const html = `
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div>
                <h2>Clinical Operations Dashboard</h2>
                <p>East Point Hospital Administration | Real-time Performance Metrics</p>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); padding-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                <span class="status-badge status-active" style="padding: 2px 8px; font-size: 0.7rem;">SYSTEMS ONLINE</span>
                <span>Synced: ${lastSyncTime}</span>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="stat-card">
                <div class="stat-icon blue"><i data-lucide="users"></i></div>
                <div class="stat-info">
                    <h3>Active Patients</h3>
                    <div class="stat-value">${state.patients.length}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon teal"><i data-lucide="bed"></i></div>
                <div class="stat-info">
                    <h3>Bed Occupancy</h3>
                    <div class="stat-value">${state.hospitalStats.bedOccupancy}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange"><i data-lucide="activity"></i></div>
                <div class="stat-info">
                    <h3>Active Surgeries</h3>
                    <div class="stat-value">${state.hospitalStats.activeSurgeries}</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: #F1F5F9; color: var(--text-muted);"><i data-lucide="package"></i></div>
                <div class="stat-info">
                    <h3>Pharmacy Stock</h3>
                    <div class="stat-value" style="font-size: 1.1rem; color: var(--success);">${state.hospitalStats.pharmacyStock}</div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px; margin-top: 40px;">
            <div>
                <div class="section-header">
                    <h3>High Priority Admissions</h3>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Clinical Status</th>
                                <th>Assigned Unit</th>
                                <th>Entry Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.patients.map(p => `
                                <tr>
                                    <td style="font-weight: 600;">${p.name}</td>
                                    <td><span class="status-badge status-${p.condition.toLowerCase() === 'critical' ? 'cancelled' : (p.condition.toLowerCase() === 'recovering' ? 'pending' : 'active')}">${p.condition}</span></td>
                                    <td>General Medicine</td>
                                    <td>${p.lastVisit}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <div class="section-header">
                    <h3>System Announcements</h3>
                </div>
                <div style="background: white; border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                        <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 5px;">Staff Meeting</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">All department heads meet in Conference Room B at 4:00 PM.</p>
                    </div>
                    <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
                        <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 5px;">IT Maintenance</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">EMR system will undergo brief maintenance at midnight.</p>
                    </div>
                    <button class="btn-primary" style="width: 100%; justify-content: center; font-size: 0.85rem;">
                        <i data-lucide="plus-circle"></i> New Announcement
                    </button>
                </div>
            </div>
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderPatients() {
    const html = `
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>Patient Management</h2>
                <p>Manage and view all patient medical records.</p>
            </div>
            <button class="btn-primary" onclick="showAddPatientModal()">
                <i data-lucide="plus"></i> Add Patient
            </button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Age/Gender</th>
                        <th>Blood Group</th>
                        <th>Last Visit</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.patients.map(p => `
                        <tr>
                            <td style="font-family: monospace; font-weight: 600;">${p.id}</td>
                            <td style="font-weight: 500;">${p.name}</td>
                            <td>${p.age} / ${p.gender}</td>
                            <td>${p.bloodGroup}</td>
                            <td>${p.lastVisit}</td>
                            <td>
                                <button class="btn-icon" title="Edit"><i data-lucide="edit-2"></i></button>
                                <button class="btn-icon" title="Delete" style="color: var(--error);" onclick="deletePatient('${p.id}')"><i data-lucide="trash-2"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderDoctors() {
    const html = `
        <div class="section-header">
            <h2>Medical Staff</h2>
            <p>View and manage hospital medical practitioners.</p>
        </div>
        <div class="dashboard-grid">
            ${state.doctors.map(doc => `
                <div class="stat-card" style="flex-direction: column; align-items: flex-start;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; width: 100%;">
                        <div class="stat-icon blue"><i data-lucide="user"></i></div>
                        <div>
                            <h4 style="font-family: Outfit; font-size: 1.1rem; color: var(--primary);">${doc.name}</h4>
                            <span style="font-size: 0.85rem; color: var(--text-muted);">${doc.specialty}</span>
                        </div>
                    </div>
                    <div style="font-size: 0.9rem; color: var(--text-main);">
                        <p style="margin-bottom: 5px;"><strong>Availability:</strong></p>
                        <p style="color: var(--text-muted);">${doc.availability}</p>
                    </div>
                    <div style="margin-top: 15px; width: 100%; border-top: 1px solid var(--border); padding-top: 15px; display: flex; justify-content: flex-end;">
                        <button class="btn-icon"><i data-lucide="calendar"></i></button>
                        <button class="btn-icon"><i data-lucide="mail"></i></button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    contentArea.innerHTML = html;
}

function renderAppointments() {
    const html = `
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <h2>Appointment Booking</h2>
                <p>Schedule and monitor patient visits.</p>
            </div>
            <button class="btn-primary" onclick="showAddAppointmentModal()">
                <i data-lucide="calendar-plus"></i> Book Appointment
            </button>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${state.appointments.map(apt => `
                        <tr>
                            <td style="font-family: monospace;">${apt.id}</td>
                            <td style="font-weight: 500;">${apt.patient}</td>
                            <td>${apt.doctor}</td>
                            <td>${apt.date}</td>
                            <td>${apt.time}</td>
                            <td><span class="status-badge status-${apt.status}">${apt.status}</span></td>
                            <td>
                                <button class="btn-icon" title="Cancel" style="color: var(--error);"><i data-lucide="x-circle"></i></button>
                                <button class="btn-icon" title="Reschedule"><i data-lucide="clock"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    contentArea.innerHTML = html;
}

// --- Modal & Form Actions ---
function setupModalListeners() {
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    });
}

function setupQuickActions() {
    quickAppointmentBtn.addEventListener('click', () => {
        showAddAppointmentModal();
    });
}

window.showAddPatientModal = function() {
    modalTitle.textContent = 'Add New Patient';
    modalBody.innerHTML = `
        <form id="add-patient-form">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" class="form-control" name="name" required placeholder="e.g. Alice Cooper">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Age</label>
                    <input type="number" class="form-control" name="age" required>
                </div>
                <div class="form-group">
                    <label>Gender</label>
                    <select class="form-control" name="gender">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Blood Group</label>
                <select class="form-control" name="bloodGroup">
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option>
                    <option>AB+</option><option>AB-</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-icon" onclick="modalOverlay.classList.add('hidden')">Cancel</button>
                <button type="submit" class="btn-primary">Save Patient</button>
            </div>
        </form>
    `;
    modalOverlay.classList.remove('hidden');

    document.getElementById('add-patient-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPatient = {
            id: 'PT-' + (1000 + state.patients.length + 1),
            name: formData.get('name'),
            age: formData.get('age'),
            gender: formData.get('gender'),
            bloodGroup: formData.get('bloodGroup'),
            lastVisit: new Date().toISOString().split('T')[0]
        };
        state.patients.push(newPatient);
        modalOverlay.classList.add('hidden');
        renderSection('patients');
    });
};

window.showAddAppointmentModal = function() {
    modalTitle.textContent = 'Schedule Appointment';
    modalBody.innerHTML = `
        <form id="add-appointment-form">
            <div class="form-group">
                <label>Patient</label>
                <select class="form-control" name="patient" required>
                    ${state.patients.map(p => `<option>${p.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Doctor</label>
                <select class="form-control" name="doctor" required>
                    ${state.doctors.map(d => `<option>${d.name}</option>`).join('')}
                </select>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" class="form-control" name="date" required>
                </div>
                <div class="form-group">
                    <label>Time</label>
                    <input type="time" class="form-control" name="time" required>
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-icon" onclick="modalOverlay.classList.add('hidden')">Cancel</button>
                <button type="submit" class="btn-primary">Book Appointment</button>
            </div>
        </form>
    `;
    modalOverlay.classList.remove('hidden');

    document.getElementById('add-appointment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newApt = {
            id: 'APT-' + (5000 + state.appointments.length + 1),
            patient: formData.get('patient'),
            doctor: formData.get('doctor'),
            date: formData.get('date'),
            time: formData.get('time'),
            status: 'pending'
        };
        state.appointments.push(newApt);
        modalOverlay.classList.add('hidden');
        renderSection('appointments');
    });
};

window.deletePatient = function(id) {
    if (confirm('Are you sure you want to remove this patient record?')) {
        state.patients = state.patients.filter(p => p.id !== id);
        renderSection('patients');
    }
};
