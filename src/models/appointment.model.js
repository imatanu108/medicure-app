import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: [true, "Patient reference is required"],
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Doctor reference is required"],
    },
    appointmentDateTime: {
        type: Date,
        required: [true, "Appointment date and time are required"],
    },
    status: {
        type: String,
        enum: ["Scheduled", "Missed", "Cancelled"],
        default: "Scheduled",
    },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export { Appointment };
