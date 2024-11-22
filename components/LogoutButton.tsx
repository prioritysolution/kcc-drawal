"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function LogoutButton({ className }: { className: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
      });

      const data = await res.json();

      if (data.success) {
        Cookies.remove("isAuthenticated"); // Remove the cookie
        toast.success(data.message);
        router.push("/login"); // Redirect to login page
      } else {
        toast.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout.");
    }
  };

  return (
    <button className={className} onClick={handleLogout}>
      Logout
    </button>
  );
}
