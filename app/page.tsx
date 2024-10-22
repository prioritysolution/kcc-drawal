"use client";

import { useState, FormEvent, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useUser } from "@/components/context/UserContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Home = () => {
  const [username, setUsername] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated either via context or cookie
    const isAuthenticated = Cookies.get("isAuthenticated") || user;

    if (isAuthenticated) {
      // If user is authenticated, redirect to another page (e.g., dashboard)
      router.push("/generateForm"); // Change this to your desired route
    } else {
      setIsCheckingAuth(false); // Allow rendering if user is not authenticated
    }
  }, [router, user]);

  if (isCheckingAuth) {
    // Optionally show a loading indicator while checking authentication
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, secret }),
      });

      const data = await res.json();

      if (data.success) {
        setUser({ username }); // Save authenticated user to context
        Cookies.set("isAuthenticated", "true"); // Save authentication status in a cookie
        toast.success(data.message);
        router.push("/generateForm"); // Redirect to a different page after authentication
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during authentication.");
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
          <label htmlFor="secret" className="font-semibold">
            Secret Code
          </label>
          <input
            type="text"
            name="secret"
            id="secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-2 py-3 border border-black rounded-md"
          />
        </div>

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

export default Home;
