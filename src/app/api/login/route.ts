import { NextResponse } from "next/server";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb } from "@/lib/aws-config";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const { Item } = await dynamoDb.send(
      new GetCommand({
        TableName: "Users",
        Key: { email },
      })
    );

    if (!Item) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: Item,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
