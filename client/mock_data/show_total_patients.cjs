// Script to show vital trends for a single patient from full_appointments_database.json
const fs = require('fs');

const appointmentsFile = 'full_appointments_database.json';
// No patientId needed, show stats for all patients
let appointments = [];
try {
  const raw = fs.readFileSync(appointmentsFile, 'utf8');
  appointments = JSON.parse(raw);
} catch (err) {
  console.error(`Error reading ${appointmentsFile}:`, err);
  process.exit(1);
}


// Number of patients in online and clinic appointments, and number of appointments this week
const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(today.getDate() - 7);

function isWithinThisWeek(dateStr) {
  const d = new Date(dateStr);
  return d >= weekAgo && d <= today;
}

const thisWeekAppointments = appointments.filter(
  apt => !apt.no_show && isWithinThisWeek(apt.date)
);

if (thisWeekAppointments.length === 0) {
  console.log('No completed appointments found for any patient this week.');
  process.exit(0);
}

const onlinePatients = new Set();
const clinicPatients = new Set();
thisWeekAppointments.forEach(apt => {
  if (apt.type === 'online') {
    onlinePatients.add(apt.patient_id);
  } else if (apt.type === 'clinic') {
    clinicPatients.add(apt.patient_id);
  }
});

console.log('Appointment Statistics - This Week:');
console.log(`Time period: ${weekAgo.toISOString().slice(0,10)} to ${today.toISOString().slice(0,10)}`);
// List day names for this week
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const weekDays = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(weekAgo);
  d.setDate(weekAgo.getDate() + i);
  if (d > today) break;
  weekDays.push(`${daysOfWeek[d.getDay()]} (${d.toISOString().slice(0,10)})`);
}
console.log('Days this week:');
weekDays.forEach(day => console.log(day));
// Show number of appointments for each day of the current month
const currentYear = today.getFullYear();
const currentMonthNum = today.getMonth(); // 0-indexed
const firstDayOfMonth = new Date(currentYear, currentMonthNum, 1);
const lastDayOfMonth = new Date(currentYear, currentMonthNum + 1, 0);

const monthDays = [];
const appointmentsByMonthDay = {};
for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
  const dateStr = d.toISOString().slice(0,10);
  monthDays.push(`${daysOfWeek[d.getDay()]} (${dateStr})`);
  appointmentsByMonthDay[dateStr] = 0;
}
const thisMonthAppointments = appointments.filter(
  apt => !apt.no_show && apt.date.startsWith(`${currentYear}-${(currentMonthNum+1).toString().padStart(2,'0')}-`)
);
thisMonthAppointments.forEach(apt => {
  if (appointmentsByMonthDay[apt.date] !== undefined) {
    appointmentsByMonthDay[apt.date]++;
  }
});
console.log('Appointments per day (this month):');
monthDays.forEach(day => {
  const dateStr = day.match(/\((\d{4}-\d{2}-\d{2})\)/)[1];
  console.log(`${day}: ${appointmentsByMonthDay[dateStr]}`);
});
console.log(`Total appointments: ${thisWeekAppointments.length}`);
console.log(`Unique patients (online): ${onlinePatients.size}`);
console.log(`Unique patients (clinic): ${clinicPatients.size}`);
