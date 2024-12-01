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

  export const getCurrentUser = async()=>{
    const [user, setUser] = useState(null);

    await fetch(`${dbURL}/check_session`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(error => console.log('Error fetching user session'));
    
  }
  