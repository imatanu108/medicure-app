import cron from 'node-cron';
import { Appointment } from '../models/appointment.model.js';

// Schedule the job to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        const now = new Date();
        const updatedAppointments = await Appointment.updateMany(
            {
                appointmentDateTime: { $lt: now },
                status: { $ne: 'Missed' }
            },
            { status: 'Missed' }
        );

        console.log(`Missed appointments updated: ${updatedAppointments.modifiedCount}`);
    } catch (error) {
        console.error('Error updating missed appointments:', error.message);
    }
});

console.log('Appointment cron job scheduled!');
