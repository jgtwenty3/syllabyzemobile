// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { checkSession } from '@/lib/queries';

// // Define types for AuthContext
// type AuthContextType = {
//   user: any | null;
//   loading: boolean;
//   setUser: React.Dispatch<React.SetStateAction<any | null>>;
// };

// // Create the AuthContext
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Custom hook for easy access to the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// // AuthProvider Component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const validateSession = async () => {
//       try {
//         const userData = await checkSession();
//         console.log(userData)
//         if (userData) {
//           setUser(userData);
//         }
//       } catch (error) {
//         console.error('Session validation failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     validateSession();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
