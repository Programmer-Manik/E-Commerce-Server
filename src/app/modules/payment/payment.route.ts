import express from "express";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post("/confirmation", PaymentController.confirmationService);

export const PaymentRoutes = router;
