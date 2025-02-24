import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  profilePicture?: File;
  useInitials: boolean;
}

export const signupUser = async (userData: SignupData) => {
  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return axios.post(`${API_BASE_URL}/signup`, formData);
};

export const loginUser = async (email: string) => {
  return axios.post(`${API_BASE_URL}/login`, { email });
};
