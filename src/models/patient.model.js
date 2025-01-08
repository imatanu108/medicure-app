import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const patientSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Patient's full name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    age: {
        type: Number,
        min: [0, "Age cannot be negative"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
}, { timestamps: true });

// encrypting password just before saving (using pre middleware) if password is getting modified
patientSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // if password hasn't changed , passing the task.

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
})

patientSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const Patient = mongoose.model("Patient", patientSchema);

export { Patient }