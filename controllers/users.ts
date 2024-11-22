import axios from "axios";

const API_URL = "/api/users"; // Base URL for user APIs

interface User {
  name: string;
  secret: string;
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get("/api/users");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const addUser = async (user: User) => {
  try {
    if (user.name && user.secret) {
      await axios.post("/api/users", user);
      fetchUsers(); // Refresh the user list
    } else {
      alert("Add data correctly");
    }
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

// Function to edit user details
export const editUser = async (
  userId: string,
  userData: Record<string, any>
) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to edit user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Function to delete a user
export const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to delete user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
