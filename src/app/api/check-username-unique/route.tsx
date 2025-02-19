import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User.model"; 
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

const userNameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    //validate with zod
    const result = userNameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log(usernameErrors)
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is Already Taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is Available",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error while checking username", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 400 }
    );
  }
}
