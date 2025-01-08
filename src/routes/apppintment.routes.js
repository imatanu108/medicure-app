import { Router } from "express";
import {
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    updateMissedAppointments
} from "../controllers/appointment.controller.js"

const router = Router()
router.use(updateMissedAppointments)
router.route("/new").post(bookAppointment)
router.route("/reschedule/:appointmentId").post(rescheduleAppointment)
router.route("/cancel/:appointmentId").post(cancelAppointment)

export default router