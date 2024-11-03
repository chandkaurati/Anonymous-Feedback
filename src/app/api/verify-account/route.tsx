import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodeUsername || username,
    });

    if (!user) {
      return Response.json(
        { success: false, message: "user Not Found" },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { success: true, message: "Account verified Successfully" },
        { status: 201 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "verification Code is Expired" },
        { status: 401 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "incorrect verification code" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.log("error while verifying User", error);

    return Response.json(
      { success: false, message: "Error verifying User" },
      { status: 400 }
    );
  }
}
