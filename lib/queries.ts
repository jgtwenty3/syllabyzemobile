import { NewUser } from "@/types";

const dbURL = process.env.EXPO_PUBLIC_API_URL

export const signUp = async (userData: NewUser) => {
    try {
      const response = await fetch(`${dbURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result); // Check what you receive from the backend
      } else {
        const error = await response.json();
        console.log(error); // Log any error response
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
    }
  };
  