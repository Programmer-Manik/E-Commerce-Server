"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_codes_1 = require("http-status-codes");
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const configs_1 = __importDefault(require("../../../configs"));
const emailSender_1 = __importDefault(require("./emailSender"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.active,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, configs_1.default.jwt.jwt_secret, configs_1.default.jwt.expires_in);
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
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelpers_1.jwtHelpers.verifyToken(token, configs_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: client_1.UserStatus.active,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, configs_1.default.jwt.jwt_secret, configs_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: client_1.UserStatus.active,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
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
});
const forgotPassord = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.active,
        },
    });
    const resetPasswordToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role,
        id: userData.id,
    }, configs_1.default.jwt.reset_pass_secret, configs_1.default.jwt.reset_pass_secret_expires_in);
    const resetPassLink = configs_1.default.reset_pass_link + `/${resetPasswordToken}`;
    yield (0, emailSender_1.default)(userData.email, `
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

    `);
});
const resetPassword = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    }
    const isValidToken = jwtHelpers_1.jwtHelpers.verifyToken(token, configs_1.default.jwt.reset_pass_secret);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: isValidToken.id,
            status: client_1.UserStatus.active,
        },
    });
    if (!isValidToken || isValidToken.email !== userData.email) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Forbidden");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    yield prisma_1.default.user.update({
        where: {
            id: userData.id,
        },
        data: {
            password: hashedPassword,
        },
    });
});
exports.AuthService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassord,
    resetPassword,
};
