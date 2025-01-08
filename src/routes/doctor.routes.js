import { Router } from "express";
import { registerDoctor } from "../controllers/doctor.controller.js";

const router = Router()

router.route("/register").post(registerDoctor)

export default router