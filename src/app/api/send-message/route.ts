import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User.model";
import { MessageModel } from "@/models/User.model";
import { NextRequest } from "next/server";

async function POST(request: NextRequest) {
  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 404 }
      );
    }

    // check if user is accepting messages or not

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages yet",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent SuccessFully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error)
    return Response.json(
      {
        success: false,
        message: `Error while sending message ${error.message}`
      },
      { status: 500 }
    );
  }
}
