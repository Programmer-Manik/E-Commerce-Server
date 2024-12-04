import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";


const createUser = catchAsync(async (req, res) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "user create successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "admin create successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users fetch successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const {id} = req.params;
  const user = (req as any).user;
  const result = await UserService.getSingleUser(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "user fetch successfully",
    data: result,
  });
});


export const UserController = {
    createUser,
    createAdmin,
    getAllUsers,
    getSingleUser,
}
