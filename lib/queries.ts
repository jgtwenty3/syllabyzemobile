import { NewUser, User } from "@/types";
import { useState } from "react";

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

  export const signIn = async (email:string, password:string) => {
    try {
      const userData = { email, password };
  
      const response = await fetch(`${dbURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      .then(res =>res.json())
  

    } catch (error) {
      console.error("Error during sign-in:", error);
      throw error;
    }
  };

  export const checkSession = async () => {
    try {
      const response = await fetch(`${dbURL}/check_session`, {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const user = await response.json();
        return user; 
      } else if (response.status === 401) {
        console.error("Unauthorized: Session not found or expired.");
        return null;
      } else {
        console.error("Error fetching session:", await response.json());
        return null;
      }
    } catch (error) {
      console.error("Error in checkSession:", error);
      return null;
    }
  };

  export const logout = async () => {
    try {
      const response = await fetch(`${dbURL}/logout`, {
        method: "DELETE",
        credentials: "include",
      });
  
      if (response.status === 204) {
        console.log("Logout successful");
        return true;
      } else {
        console.error("Error during logout:", await response.json());
        return false;
      }
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  };
  