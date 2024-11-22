"use client";

import { addUser, fetchUsers } from "@/controllers/users";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";

interface User {
  _id: string;
  name: string;
  secret: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  const [name, setName] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = async () => {
    const allUsers: User[] = await fetchUsers();
    setUsers(allUsers);
  };

  const handleAddUser = async () => {
    try {
      const user = {
        name,
        secret,
      };
      await addUser(user);
      setName("");
      setSecret("");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // const handleEdit = async (id: string) => {
  //   try {
  //     const updatedUser = { name, secret };
  //     const response = await editUser(id, updatedUser);
  //     alert(response.message || "User updated successfully");
  //   } catch (error) {
  //     console.error("Error editing user:", error);
  //   }
  // };

  // const handleDelete = async (id: string) => {
  //   try {
  //     const response = await deleteUser(id);
  //     alert(response.message || "User deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   }
  // };

  // const handleLogout = () => {
  //   Cookies.remove("isAuthenticated");
  //   toast.success("Logged out successfully.");
  //   router.push("/login");
  // };

  return (
    <div className="p-8 w-full flex flex-col px-20">
      <LogoutButton className="self-end px-5 py-3 rounded-md bg-red-500 text-white font-semibold" />
      <h1 className="text-2xl font-bold text-center">Users List</h1>
      <div className=" w-full flex justify-center mt-10">
        <form
          className="w-full lg:w-[500px] px-2 sm:px-10 border border-black rounded-md flex flex-col py-5 gap-2 items-center justify-center"
          autoComplete="off"
        >
          <div className="w-full">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-black rounded-md py-2 px-2"
            />
          </div>
          <div className="w-full">
            <label htmlFor="secret">Secret</label>
            <input
              type="text"
              id="secret"
              onChange={(e) => setSecret(e.target.value)}
              className="w-full border border-black rounded-md py-2 px-2"
            />
          </div>
          <button
            onClick={handleAddUser}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded self-end"
          >
            Add User
          </button>
        </form>
      </div>

      <div className="w-full mt-10  flex items-center justify-center">
        <div className="w-[500px] border border-black rounded-md py-5 px-2">
          <table className="w-full">
            <tr className="w-full">
              <th>Name</th>
              <th>Secret</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>

            {users &&
              users.length > 0 &&
              users.map((user) => (
                <tr key={user._id} className="w-full">
                  <td className="text-center">{user.name}</td>
                  <td className="text-center">{user.secret}</td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
          </table>
        </div>
      </div>
    </div>
  );
}
