import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { RecentProductService } from "./recentPro.service";

const getByUserId = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await RecentProductService.getByUserId(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Recent view products fetch successfully",
    data: result || [],
  });
});

export const RecentProductController = {
  getByUserId,
};
