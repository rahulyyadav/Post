"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth";
import { webSocketService } from "@/services/websocket";
import Image from "next/image";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  dateOfBirth: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string | null;
  isOnline?: boolean;
  unreadCount?: number;
}

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("All Chats");

  // Tabs for chat categories
  const tabs = ["All Chats", "Groups", "Contacts"];

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = AuthService.getUser();
        const accessToken = AuthService.getAccessToken();

        if (!userData || !accessToken) {
          router.replace("/login");
          return;
        }

        setUser(userData);
        await webSocketService.connect();
        setLoading(false);
      } catch (error) {
        console.error("Auth initialization failed:", error);
        router.replace("/login");
      }
    };

    initializeAuth();
    return () => webSocketService.disconnect();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5B45E0]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 bg-white border-r">
        {/* User Profile Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">{user.firstName}</h1>

          {/* Navigation Tabs */}
          <div className="flex mt-4 space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "text-[#5B45E0] border-b-2 border-[#5B45E0]"
                    : "text-gray-500"
                } pb-2 px-1`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <div className="relative">
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#5B45E0] text-white flex items-center justify-center text-xl font-bold">
                    {chat.name[0]}
                  </div>
                )}
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {chat.unreadCount && (
                <div className="ml-2 bg-[#5B45E0] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* New Chat Button */}
        <div className="absolute bottom-4 right-4">
          <button
            title="New Chat"
            aria-label="Create new chat"
            className="bg-[#5B45E0] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-[#4c39b5]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-xl">Select a chat to start messaging</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sample chat data
const chats: Chat[] = [
  {
    id: 1,
    name: "Larry MacNigh",
    lastMessage: "Hey! Are you available for a new project?",
    time: "09:30 AM",
    avatar: "/avatars/p-1.jpeg",
    isOnline: true,
  },
  {
    id: 2,
    name: "Natalie Hans",
    lastMessage: "Meeting is starting...",
    time: "09:15 AM",
    avatar: "/avatars/p-2.JPG",
    unreadCount: 3,
  },
  // Add more chats as needed
];
