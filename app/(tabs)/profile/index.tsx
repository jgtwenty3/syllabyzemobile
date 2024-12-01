import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkSession, logout } from '@/lib/queries';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

const Profile = () => {
  const {user, setUser} = useAuth();
  console.log(user)
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    const success = await logout();
    if (success) {
      setUser(null); // Clear user state in AuthContext
      router.push('/SignIn'); // Redirect to login screen
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <View>
          <Text style={styles.heading}>Profile</Text>
          <Text style={styles.info}>Name: {user.firstName}{user.lasName}</Text>
          <Text style={styles.info}>Email: {user.email}</Text>
          
        </View>
        
      ) : (
        <Text style={styles.error}>No user found. Please log in.</Text>
      )}
      <View style = {styles.buttonContainer}>
        <Button title = "Log out" onPress={handleLogout}/>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9F2FF",
    flex: 1,

    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    fontSize: 18,
    color: "red",
  },
  buttonContainer:{
    
  }
});
