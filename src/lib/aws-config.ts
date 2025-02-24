import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// For production (using IAM Role)
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
});

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export const dynamoDb = DynamoDBDocumentClient.from(ddbClient);
