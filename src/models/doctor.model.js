import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"

const doctorSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Doctor's full name is required"],
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
        specialization: {
            type: String,
            required: [true, "Specialization is required"],
        },
        experience: {
            type: Number,
            min: [0, "Experience cannot be negative"],
            required: [true, "Experience is required"],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
    }, { timestamps: true });

doctorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // if password hasn't changed , passing the task.

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
})

doctorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const Doctor = mongoose.model("Doctor", doctorSchema);

export { Doctor }
