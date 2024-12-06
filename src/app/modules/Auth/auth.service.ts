import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import configs from "../../../configs";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    configs.jwt.jwt_secret as Secret,
    configs.jwt.expires_in as string
  );

  const data = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    contactNumber: userData.contactNumber,
    address: userData.address,
    role: userData.role,
    status: userData.status,
    profilePhoto: userData.profilePhoto,
  };

  return {
    data,
    accessToken,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      configs.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.active,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role },
    configs.jwt.jwt_secret as Secret,
    configs.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.active,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassord = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.active,
    },
  });

  const resetPasswordToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      id: userData.id,
    },
    configs.jwt.reset_pass_secret as Secret,
    configs.jwt.reset_pass_secret_expires_in as string
  );

  const resetPassLink =
    configs.reset_pass_link + `/${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
    <div>
  <p>Dear User,</p>
  <p>
    Your password reset link 
    <a href=${resetPassLink} style={{ textDecoration: "none" }}>
      <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Reset Password
      </button>
    </a>
  </p>
</div>

    `
  );
};

const resetPassword = async (token: string, payload: { password: string }) => {

  if (!token) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  }
  const isValidToken = jwtHelpers.verifyToken(
    token,
    configs.jwt.reset_pass_secret as Secret
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: isValidToken.id,
      status: UserStatus.active,
    },
  });

  if (!isValidToken || isValidToken.email !== userData.email) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden");
  }

  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassord,
  resetPassword,
};
