import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update accept Message status",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("failed to update accept Message status", error);
    return Response.json(
      {
        success: false,
        message: "failed to update accept Message status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User is not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  try {
    const currentUser = await UserModel.findById(userId);

    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: currentUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error)
    return Response.json(
      {
        success: false,
        message: "Error in getting messageacceptance status",
      },
      { status: 500 }
    );
  }
}
