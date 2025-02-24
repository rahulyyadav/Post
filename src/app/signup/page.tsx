"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  profilePicture?: File | null;
  useInitials?: boolean;
}

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: "",
    profilePicture: null,
    useInitials: false,
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState<string>("");
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleSubmitBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingMessage("Sending OTP...");

    try {
      const otp = generateOTP();
      setGeneratedOTP(otp);

      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setStep(2);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Verify OTP
    if (otp === generatedOTP) {
      setStep(3);
    } else {
      alert("Invalid OTP. Please try again.");
    }

    setLoading(false);
  };

  const getInitials = () => {
    const firstInitial = formData.firstName.charAt(0);
    const lastInitial = formData.lastName.charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file, useInitials: false });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkipPhoto = () => {
    setFormData({ ...formData, profilePicture: null, useInitials: true });
    setImagePreview("");
  };

  const handleCompleteSignup = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("useInitials", (!imagePreview).toString());

      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await fetch("/api/complete-signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete signup");
      }

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error completing signup:", error);
      alert("Failed to complete signup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            {step === 1
              ? "Fill in your details"
              : step === 2
              ? "Verify your email"
              : "Almost there!"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmitBasicInfo} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent"
                  placeholder="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value as "male" | "female" | "other",
                  })
                }
                className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#5B45E0] text-white py-3 rounded-xl font-medium
                ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#4c39b3]"
                }
                transition-colors duration-200`}
            >
              {loading ? "Processing..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-xl text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5B45E0] focus:border-transparent text-center text-2xl tracking-wider"
                placeholder="0000"
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                We've sent a 4-digit code to {formData.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 4}
              className={`w-full bg-[#5B45E0] text-white py-3 rounded-xl font-medium
                ${
                  loading || otp.length !== 4
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-[#4c39b3]"
                }
                transition-colors duration-200`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-6">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#5B45E0]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto bg-[#5B45E0] text-white flex items-center justify-center text-3xl font-bold">
                    {getInitials()}
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                aria-label="Upload profile picture"
              />

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-white border-2 border-[#5B45E0] text-[#5B45E0] py-3 rounded-xl font-medium hover:bg-[#5B45E0] hover:text-white transition-colors duration-200"
                >
                  Upload Profile Picture
                </button>

                <button
                  type="button"
                  onClick={handleCompleteSignup}
                  disabled={loading}
                  className={`w-full bg-[#5B45E0] text-white py-3 rounded-xl font-medium
                    ${
                      loading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-[#4c39b3]"
                    }
                    transition-colors duration-200`}
                >
                  {loading
                    ? "Completing Signup..."
                    : imagePreview
                    ? "Complete Signup"
                    : "Skip & Complete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#5B45E0] hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
