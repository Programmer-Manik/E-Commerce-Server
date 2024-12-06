import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const confirmationService = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;
  const result = await PaymentService.confirmationService(
    transactionId as string,
    status as string
  );

  res.send(result);
});

export const PaymentController = {
  confirmationService,
};
