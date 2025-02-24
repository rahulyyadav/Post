# Real-Time Chat Web App

This is a real-time chat application built with **Next.js**, **AWS Lambda**, **API Gateway**, **DynamoDB**, and **WebSockets**. The project enables users to sign up, log in, and exchange messages in real time.

## Features

- **User Authentication**: Signup/Login with email and password.
- **Profile Management**: Store user data including email, name, date of birth, and profile picture in AWS S3 and DynamoDB.
- **Real-Time Messaging**: Uses WebSockets via API Gateway to provide instant messaging.
- **Scalable Backend**: Serverless architecture powered by AWS Lambda and DynamoDB.
- **Custom Domain Integration**: Planned for seamless deployment with Cloudflare.

## Tech Stack

- **Frontend**: Next.js (React Framework)
- **Backend**: AWS Lambda, API Gateway, WebSockets
- **Database**: AWS DynamoDB
- **Storage**: AWS S3 (For profile pictures and assets)
- **Authentication**: Custom authentication system

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- AWS Account (for deployment)
- AWS CLI configured with appropriate permissions

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/rahulyyadav/chain.git
   cd chat-webapp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

This project is intended to be deployed on AWS. Follow these steps:

1. **Deploy Backend**:

   - Set up API Gateway for WebSockets and HTTP requests.
   - Deploy AWS Lambda functions for authentication and messaging.
   - Configure DynamoDB tables for storing user and chat data.
   - Store user profile images in an S3 bucket.

2. **Deploy Frontend**:

   - Host the Next.js frontend using Vercel or AWS Amplify.
   - Configure the domain via Cloudflare for better security and routing.

## Future Enhancements

- **Message Encryption**: Secure user messages with end-to-end encryption.
- **Group Chats**: Enable group messaging and media sharing.
- **User Presence Status**: Show online/offline status in real time.
- **Push Notifications**: Integrate Web Push or AWS SNS for real-time notifications.

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request with improvements or bug fixes.

## Author

Rahul Yadav

## License

This project is licensed under the MIT License - see the LICENSE file for details.
