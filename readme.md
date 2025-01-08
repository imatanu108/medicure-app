This repository is a **Doctor-Patient Appointment Management System** built with **Express.js** and **MongoDB**. It allows patients to register, book appointments with doctors, reschedule, cancel, and track appointment statuses such as "Scheduled", "Missed", or "Cancelled". The system also includes automatic status updates for missed appointments using cron jobs. The backend is structured with RESTful APIs for easy integration with the front-end and uses JWT authentication for secure user management. 

Features include:
- User (Doctor/Patient) registration and authentication
- Appointment scheduling, rescheduling, and cancellation
- Automatic update of missed appointments via cron jobs
- Time validation for appointments (ensures no overlap and future bookings only)