import { api } from "./api";

export const fetchFilterDataApi = async () => {
  try {
    const response = await api.get("/users-screen/filter-conditions"); // Using `api` instance
    return response.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching filter data:", error);
    throw error;
  }
};
