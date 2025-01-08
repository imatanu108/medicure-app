import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js"
import mongoose from "mongoose";

const bookAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, appointmentDateTime } = req.body;

    // Validate required fields
    if ([patientId, doctorId, appointmentDateTime].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required!");
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ApiError(404, "Patient not found.");
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        throw new ApiError(404, "Doctor not found.");
    }

    const newDate = new Date(appointmentDateTime);

    // Validation: Ensure the new date-time is not in the past
    if (newDate < Date.now()) {
        throw new ApiError(400, "Cannot reschedule to a past time.");
    }

    // Check if the doctor is already booked for this slot
    const existingAppointment = await Appointment.findOne({
        doctor: new mongoose.Types.ObjectId(String(doctorId)),
        appointmentDateTime,
        status: "Scheduled"
    });

    if (existingAppointment) {
        throw new ApiError(409, "This time slot is already booked.");
    }

    // Create the new appointment
    const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        appointmentDateTime,
        status: "Scheduled"
    });

    if (!appointment) {
        throw new ApiError(500, "Something went wrong while creating the appointment.");
    }

    // Return the response with the created appointment
    return res.status(201).json(
        new ApiResponse(200, appointment, "Appointment created successfully!")
    );
});

const cancelAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params

    if (!appointmentId.trim()) throw new ApiError(400, "Appointment id is required.")

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) throw new ApiError(404, "No appointment found.");

    // Check if the appointment is already cancelled
    if (appointment.status === "Cancelled") {
        throw new ApiError(400, "This appointment is already cancelled.");
    }

    appointment.status = "Cancelled"
    await appointment.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointment,
                "Appointment cancelled successfully."
            )
        )
})

const rescheduleAppointment = asyncHandler(async (req, res) => {
    const { appointmentId } = req.params
    const { newDateTime } = req.body

    if ([appointmentId, newDateTime,].some(field => !field?.trim())) {
        throw new ApiError(400, "All fields are required!");
    }

    const appointment = await Appointment.findById(appointmentId)
    if (!appointment) throw new ApiError(404, "No appointment found.");

    if (new Date(newDateTime).getTime() === new Date(appointment.appointmentDateTime).getTime()) {
        throw new ApiError(400, "Please select a different time slot for rescheduling.");
    }

    const newDate = new Date(newDateTime);

    // Validation: Ensure the new date-time is not in the past
    if (newDate < Date.now()) {
        throw new ApiError(400, "Cannot reschedule to a past time.");
    }

    const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        appointmentDateTime: newDateTime,
        status: "Scheduled"
    });

    if (existingAppointment) {
        throw new ApiError(409, "This time slot is already booked.");
    }

    appointment.appointmentDateTime = newDateTime
    await appointment.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                appointment,
                "Appointment rescheduled successfully."
            )
        )
})

const updateMissedAppointments  = asyncHandler(async (req, res, next) => {
    const now = new Date();
    await Appointment.updateMany(
        {
            appointmentDateTime: { $lt: now },
            status: { $ne: 'Missed' }
        },
        { status: 'Missed' }
    );
    next()
})

export {
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    updateMissedAppointments
}