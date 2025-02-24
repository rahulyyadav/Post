import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const logout = () => {
  Cookies.remove("user");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
