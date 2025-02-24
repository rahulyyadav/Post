import { NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getAwsConfig } from "@/lib/get-aws-config";

const { s3Client, dynamoDb } = getAwsConfig();
const DYNAMODB_TABLE = "WebChatingApp";

export async function POST(request: Request) {
  try {
    // Log AWS configuration
    console.log("AWS Config:", {
      region: process.env.AWS_REGION,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      tableName: DYNAMODB_TABLE,
      hasCredentials:
        !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY,
    });

    const formData = await request.formData();

    // Log the received data
    console.log("Received form data:", {
      email: formData.get("email"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth"),
      hasProfilePicture: !!formData.get("profilePicture"),
      useInitials: formData.get("useInitials"),
    });

    // Validate required fields
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "gender",
      "dateOfBirth",
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const gender = formData.get("gender") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const profilePicture = formData.get("profilePicture") as File | null;
    const useInitials = formData.get("useInitials") as string;

    let profilePictureUrl = "";

    // If there's a profile picture, upload to S3
    if (profilePicture) {
      try {
        console.log("Attempting to upload profile picture to S3");
        const fileBuffer = Buffer.from(await profilePicture.arrayBuffer());
        const key = `profile-pictures/${email}/${Date.now()}-${
          profilePicture.name
        }`;

        const s3Command = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: fileBuffer,
          ContentType: profilePicture.type,
        });

        console.log("S3 command:", {
          bucket: s3Command.input.Bucket,
          key: s3Command.input.Key,
          contentType: s3Command.input.ContentType,
        });

        await s3Client.send(s3Command);

        profilePictureUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log("Successfully uploaded to S3:", profilePictureUrl);
      } catch (error: unknown) {
        const s3Error = error as Error;
        console.error("S3 upload error:", s3Error);
        throw new Error(`S3 upload failed: ${s3Error.message}`);
      }
    }

    try {
      console.log("Attempting to save user data to DynamoDB");
      const item = {
        connectionId: email,
        email,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        profilePictureUrl: profilePictureUrl || null,
        useInitials: useInitials === "true",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("DynamoDB Item:", item);

      // Save user data to DynamoDB
      await dynamoDb.send(
        new PutCommand({
          TableName: DYNAMODB_TABLE,
          Item: item,
        })
      );
      console.log("Successfully saved to DynamoDB");
    } catch (error: unknown) {
      const dbError = error as Error;
      console.error("DynamoDB error:", dbError);
      throw new Error(`DynamoDB save failed: ${dbError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "Signup completed successfully",
    });
  } catch (error: any) {
    // Log the full error object
    console.error("Complete error object:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      ...error,
    });

    return NextResponse.json(
      {
        error: "Failed to complete signup",
        details: error.message,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
