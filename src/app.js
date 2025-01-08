import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js"
import './cron/appointment.cron.js';

const app = express()
const data = {
    "app": "medicure",
    "status": 200,
    "Message": "Server is running."
}

app.get('/health', (req, res) => {
    res.status(200).json(data)
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routes declaration
import patientRouter from "../src/routes/patient.routes.js"
import doctorRouter from "../src/routes/doctor.routes.js"
import appointmentRouter from "../src/routes/apppintment.routes.js"

app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/appointment", appointmentRouter)

// middleware to send proper error response
app.use((err, req, res, next) => {
    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorResponse = { status: statusCode, message };

    if (err instanceof ApiError) {
        errorResponse.error = err.error || [];
    }

    // Send the JSON response for API requests
    return res.status(statusCode).json(errorResponse);
});

export { app }