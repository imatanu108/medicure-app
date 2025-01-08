import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js"
import { Patient } from "../models/patient.model.js"

const registerPatient = asyncHandler(async (req, res) => {
    const { fullName, email, phone, password, age, gender } = req.body

    if (
        [fullName, email, phone, password, gender].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        throw new ApiError(400, "Invalid email address format.");
    }

    if (isNaN(age) || age <= 0) {
        throw new ApiError(400, "Invalid age: must be a positive number.");
    }
    
    const validGenders = ["Male", "Female", "Other"];
    if (!validGenders.includes(gender)) {
        throw new ApiError(400, "Invalid gender value.");
    }
    
    const existPatientWithEmail = await Patient.findOne({email})
    if (existPatientWithEmail) {
        throw new ApiError(409, "Patient with email already exists.")
    }

    const patient = await Patient.create({
        fullName, email, phone, password, age, gender
    })

    const createdPatient = await Patient.findById(patient._id).select("-password")

    if (!createdPatient) {
        throw new ApiError(500, "Something went wrong while registering the patient!")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createdPatient, "Patient registered successfully!")
    )

})

export {
    registerPatient
}