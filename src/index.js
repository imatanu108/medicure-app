import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
});

const port = process.env.PORT || 5000;

connectDB()
    .then(() => {
        // Handling application-level errors
        app.on("error", (error) => {
            console.error("Application Error:", error);
            throw error; // Optionally re-throw the error if needed
        });

        // Starting the server
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        });
    })
    .catch((err) => {
        // Handling errors during database connection
        console.error("MongoDB connection failed:", err);
    });