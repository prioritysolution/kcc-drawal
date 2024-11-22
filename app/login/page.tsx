"use client";

import { useState, FormEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  // useEffect(() => {
  //   // Check if the user is authenticated either via context or cookie
  //   const isAuthenticated = Cookies.get("isAuthenticated");

  //   if (isAuthenticated && isAuthenticated === "admin") {
  //     // If user is authenticated, redirect to another page (e.g., dashboard)
  //     router.push("/users"); // Change this to your desired route
  //   } else {
  //     setIsCheckingAuth(false); // Allow rendering if user is not authenticated
  //   }
  // }, [router]);

  // if (isCheckingAuth) {
  //   // Optionally show a loading indicator while checking authentication
  //   return <div>Loading...</div>;
  // }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("isAuthenticated", "admin", { expires: 7 }); // Save authentication status in a cookie
        router.push("/users");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during login.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        className="p-10 w-[600px] border-2 border-black rounded-md flex flex-col gap-5"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <div className="w-full h-full flex flex-col gap-2">
          <label htmlFor="username" className="font-semibold">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-2 py-3 border border-black rounded-md"
          />
        </div>
        <div className="w-full h-full flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <input
            type="text"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-2 py-3 border border-black rounded-md"
          />
        </div>

        <a className="text-blue-500 self-end" href="/">
          login as client
        </a>

        <a className="text-blue-500 self-end" href="/register">
          Register with us
        </a>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md"
        >
          Submit
        </button>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
};
export default LoginPage;
