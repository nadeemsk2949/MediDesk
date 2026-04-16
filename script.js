const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.panel-section');

const patientRows = document.getElementById('patientRows');
const doctorRows = document.getElementById('doctorRows');
const appointmentRows = document.getElementById('appointmentRows');
const dashboardAppointmentRows = document.getElementById('dashboardAppointmentRows');

const totalPatients = document.getElementById('totalPatients');
const totalDoctors = document.getElementById('totalDoctors');
const totalAppointments = document.getElementById('totalAppointments');
const statusDate = document.getElementById('statusDate');

const patientForm = document.getElementById('patientForm');
const doctorForm = document.getElementById('doctorForm');
const appointmentForm = document.getElementById('appointmentForm');

const patientSubmitButton = document.getElementById('patientSubmit');
const doctorSubmitButton = document.getElementById('doctorSubmit');

const appointmentPatient = document.getElementById('appointmentPatient');
const appointmentDoctor = document.getElementById('appointmentDoctor');

let editingPatientId = null;
let editingDoctorId = null;

let patients = [
  { id: 1, name: 'Amina Yusuf', age: 31, gender: 'Female', condition: 'Hypertension' },
  { id: 2, name: 'Ibrahim Salim', age: 47, gender: 'Male', condition: 'Routine Checkup' },
  { id: 3, name: 'Grace Lawson', age: 25, gender: 'Female', condition: 'Migraine' }
];

let doctors = [
  { id: 1, name: 'Dr. Emily Ade', specialty: 'Cardiology', contact: '+234 806 100 2121' },
  { id: 2, name: 'Dr. Tunde Bako', specialty: 'General Medicine', contact: '+234 814 950 0033' }
];

let appointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    date: '2026-04-17',
    time: '09:00',
    type: 'Follow-up'
  },
  {
    id: 2,
    patientId: 3,
    doctorId: 2,
    date: '2026-04-18',
    time: '12:30',
    type: 'Consultation'
  }
];

function activateSection(sectionId) {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });

  sections.forEach((section) => {
    section.classList.toggle('active', section.id === sectionId);
  });
}

function fillAppointmentOptions() {
  appointmentPatient.innerHTML = '<option value="" disabled selected>Select patient</option>';
  appointmentDoctor.innerHTML = '<option value="" disabled selected>Select doctor</option>';

  patients.forEach((patient) => {
    const option = document.createElement('option');
    option.value = String(patient.id);
    option.textContent = patient.name;
    appointmentPatient.appendChild(option);
  });

  doctors.forEach((doctor) => {
    const option = document.createElement('option');
    option.value = String(doctor.id);
    option.textContent = `${doctor.name} (${doctor.specialty})`;
    appointmentDoctor.appendChild(option);
  });
}

function buildEmptyRow(message, colSpan) {
  return `<tr><td class="empty-state" colspan="${colSpan}">${message}</td></tr>`;
}

function renderPatients() {
  if (!patients.length) {
    patientRows.innerHTML = buildEmptyRow('No patients added yet.', 5);
    return;
  }

  patientRows.innerHTML = patients
    .map(
      (patient) => `
      <tr>
        <td>${patient.name}</td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>${patient.condition}</td>
        <td>
          <div class="action-wrap">
            <button class="action-btn edit" data-id="${patient.id}" data-action="edit-patient" type="button">Edit</button>
            <button class="action-btn delete" data-id="${patient.id}" data-action="delete-patient" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');
}

function renderDoctors() {
  if (!doctors.length) {
    doctorRows.innerHTML = buildEmptyRow('No doctors added yet.', 4);
    return;
  }

  doctorRows.innerHTML = doctors
    .map(
      (doctor) => `
      <tr>
        <td>${doctor.name}</td>
        <td>${doctor.specialty}</td>
        <td>${doctor.contact}</td>
        <td>
          <div class="action-wrap">
            <button class="action-btn edit" data-id="${doctor.id}" data-action="edit-doctor" type="button">Edit</button>
            <button class="action-btn delete" data-id="${doctor.id}" data-action="delete-doctor" type="button">Delete</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');
}

function renderAppointments() {
  if (!appointments.length) {
    appointmentRows.innerHTML = buildEmptyRow('No appointments booked yet.', 6);
    dashboardAppointmentRows.innerHTML = buildEmptyRow('No appointments to show.', 4);
    return;
  }

  const rows = appointments
    .map((appointment) => {
      const patient = patients.find((item) => item.id === appointment.patientId);
      const doctor = doctors.find((item) => item.id === appointment.doctorId);

      return `
      <tr>
        <td>${patient?.name ?? 'Unknown patient'}</td>
        <td>${doctor?.name ?? 'Unknown doctor'}</td>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td>${appointment.type}</td>
        <td>
          <button class="action-btn delete" data-id="${appointment.id}" data-action="delete-appointment" type="button">Delete</button>
        </td>
      </tr>
      `;
    })
    .join('');

  appointmentRows.innerHTML = rows;
  dashboardAppointmentRows.innerHTML = appointments
    .slice(0, 5)
    .map((appointment) => {
      const patient = patients.find((item) => item.id === appointment.patientId);
      const doctor = doctors.find((item) => item.id === appointment.doctorId);

      return `
      <tr>
        <td>${patient?.name ?? 'Unknown patient'}</td>
        <td>${doctor?.name ?? 'Unknown doctor'}</td>
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
      </tr>
      `;
    })
    .join('');
}

function renderDashboardCounters() {
  totalPatients.textContent = String(patients.length);
  totalDoctors.textContent = String(doctors.length);
  totalAppointments.textContent = String(appointments.length);
}

function refreshUi() {
  fillAppointmentOptions();
  renderPatients();
  renderDoctors();
  renderAppointments();
  renderDashboardCounters();
}

function getNextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

patientForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const patientData = {
    name: document.getElementById('patientName').value.trim(),
    age: Number(document.getElementById('patientAge').value),
    gender: document.getElementById('patientGender').value,
    condition: document.getElementById('patientCondition').value.trim()
  };

  if (editingPatientId) {
    patients = patients.map((patient) =>
      patient.id === editingPatientId ? { id: editingPatientId, ...patientData } : patient
    );
    editingPatientId = null;
    patientSubmitButton.textContent = 'Add Patient';
  } else {
    patients.push({ id: getNextId(patients), ...patientData });
  }

  patientForm.reset();
  refreshUi();
});

doctorForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const doctorData = {
    name: document.getElementById('doctorName').value.trim(),
    specialty: document.getElementById('doctorSpecialty').value.trim(),
    contact: document.getElementById('doctorContact').value.trim()
  };

  if (editingDoctorId) {
    doctors = doctors.map((doctor) =>
      doctor.id === editingDoctorId ? { id: editingDoctorId, ...doctorData } : doctor
    );
    editingDoctorId = null;
    doctorSubmitButton.textContent = 'Add Doctor';
  } else {
    doctors.push({ id: getNextId(doctors), ...doctorData });
  }

  doctorForm.reset();
  refreshUi();
});

appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  appointments.push({
    id: getNextId(appointments),
    patientId: Number(appointmentPatient.value),
    doctorId: Number(appointmentDoctor.value),
    date: document.getElementById('appointmentDate').value,
    time: document.getElementById('appointmentTime').value,
    type: document.getElementById('appointmentType').value.trim()
  });

  appointmentForm.reset();
  fillAppointmentOptions();
  refreshUi();
});

document.body.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = Number(target.dataset.id);

  if (action === 'edit-patient') {
    const patient = patients.find((item) => item.id === id);
    if (!patient) {
      return;
    }

    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientAge').value = String(patient.age);
    document.getElementById('patientGender').value = patient.gender;
    document.getElementById('patientCondition').value = patient.condition;
    editingPatientId = patient.id;
    patientSubmitButton.textContent = 'Update Patient';
    activateSection('patients');
  }

  if (action === 'delete-patient') {
    patients = patients.filter((item) => item.id !== id);
    appointments = appointments.filter((item) => item.patientId !== id);
    refreshUi();
  }

  if (action === 'edit-doctor') {
    const doctor = doctors.find((item) => item.id === id);
    if (!doctor) {
      return;
    }

    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorSpecialty').value = doctor.specialty;
    document.getElementById('doctorContact').value = doctor.contact;
    editingDoctorId = doctor.id;
    doctorSubmitButton.textContent = 'Update Doctor';
    activateSection('doctors');
  }

  if (action === 'delete-doctor') {
    doctors = doctors.filter((item) => item.id !== id);
    appointments = appointments.filter((item) => item.doctorId !== id);
    refreshUi();
  }

  if (action === 'delete-appointment') {
    appointments = appointments.filter((item) => item.id !== id);
    refreshUi();
  }
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    activateSection(link.dataset.section);
  });
});

statusDate.textContent = `Updated ${new Date().toLocaleDateString()}`;
refreshUi();
