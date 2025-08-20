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


// Top Patient Concerns - last month (July 2025)
const lastMonth = '2025-07-';
const lastMonthAppointments = appointments.filter(
  apt => !apt.no_show && apt.date.startsWith(lastMonth)
);

if (lastMonthAppointments.length === 0) {
  console.log('No completed appointments found for any patient in July 2025.');
  process.exit(0);
}

const concernCounts = {};
lastMonthAppointments.forEach(apt => {
  apt.concerns.forEach(concern => {
    concernCounts[concern] = (concernCounts[concern] || 0) + 1;
  });
});

const topConcerns = Object.entries(concernCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

console.log('Top Patient Concerns - July 2025:');
console.log('Time period: July 2025');
topConcerns.forEach(([concern, count], idx) => {
  console.log(`${idx + 1}. ${concern}: ${count}`);
});
