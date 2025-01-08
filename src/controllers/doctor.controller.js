import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import { Doctor } from "../models/doctor.model.js";

const registerDoctor = asyncHandler(async (req, res) => {
    const { fullName, email, phone, password, specialization, experience, gender } = req.body;

    // Check if all required fields are provided
    if (
        [fullName, email, phone, password, specialization, gender].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required!");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ApiError(400, "Invalid email address format.");
    }

    // Validate experience
    if (isNaN(experience) || experience < 0) {
        throw new ApiError(400, "Invalid experience: must be a non-negative number.");
    }

    // Validate gender
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
        throw new ApiError(400, "Invalid gender value.");
    }

    // Check if a doctor with the same email already exists
    const existDoctorWithEmail = await Doctor.findOne({ email });
    if (existDoctorWithEmail) {
        throw new ApiError(409, "Doctor with email already exists.");
    }

    // Create doctor record
    const doctor = await Doctor.create({
        fullName,
        email,
        phone,
        password,
        specialization,
        experience,
        gender,
    });

    // Fetch the newly created doctor (excluding password)
    const createdDoctor = await Doctor.findById(doctor._id).select("-password");

    if (!createdDoctor) {
        throw new ApiError(500, "Something went wrong while registering the doctor!");
    }

    // Send success response
    return res.status(201).json(
        new ApiResponse(200, createdDoctor, "Doctor registered successfully!")
    );
});

export {
    registerDoctor,
};
