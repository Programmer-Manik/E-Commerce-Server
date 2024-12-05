import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { FollowerService } from "./follow.service";

const createFollow = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;
  const result = await FollowerService.createFollow(user as any, id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Following successfully",
    data: result,
  });
});

const createUnfollow = catchAsync(async (req, res) => {
  const user = (req as any).user;
  const { id } = req.params;
  const result = await FollowerService.createUnfollow(
    user as any,
    id as string
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Unfollowed successfully",
    data: result,
  });
});

const shopFollowCount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FollowerService.shopFollowCount(id as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "follow count fetch successfully",
    data: {
      follower: result || 0,
    },
  });
});

export const FollowerController = {
  createFollow,
  createUnfollow,
  shopFollowCount,
};
