const fs = require('fs');

const appointmentsFile = 'appointments_cleaned.json';
let appointments = [];
try {
  const raw = fs.readFileSync(appointmentsFile, 'utf8');
  appointments = JSON.parse(raw);
} catch (err) {
  console.error(`Error reading ${appointmentsFile}:`, err);
  process.exit(1);
}

console.log('Checking for null/missing fields in appointments (excluding no_show=true)...');

appointments.forEach(apt => {
  if (apt.no_show) return; // Skip no-show appointments

  // List fields that are null or missing
  const nullFields = [];
  Object.keys(apt).forEach(field => {
    if (apt[field] === null || apt[field] === undefined) {
      nullFields.push(field);
    }
  });

  // Also check for expected fields that might be missing
  const expectedFields = [
    'appointment_id', 'patient_id', 'type', 'date', 'clinic', 'duration', 'vitals', 'satisfaction', 'notes'
  ];
  expectedFields.forEach(field => {
    if (!(field in apt)) {
      nullFields.push(field);
    }
  });

  if (nullFields.length > 0) {
    console.log(`Appointment ${apt.appointment_id || '[no id]'}: null/missing fields -> ${nullFields.join(', ')}`);
  }
});