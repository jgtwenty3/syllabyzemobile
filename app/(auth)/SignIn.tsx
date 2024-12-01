import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { signIn } from "@/lib/queries";
import { User } from "@/types"; // Import your types
import { router } from "expo-router";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    
    email: "",
    password: "",
  });

  const submit = async () => {
    const { email, password } = form;
  
    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    setSubmitting(true);
  
    try {
      await signIn(email, password); // Pass email and password as separate arguments
      router.push("/(tabs)/home"); // Navigate to home or dashboard on successful login
    } catch (error) {
      Alert.alert("Error", "There was an issue signing in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logonameblue.png")}
        style={styles.image}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Welcome Back!</Text>

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          placeholder="Enter your email"
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          value={form.password}
          secureTextEntry
          handleChangeText={(e) => setForm({ ...form, password: e })}
          placeholder="Enter your password"
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={submit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>{isSubmitting ? "Submitting..." : "Login"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => router.push('/SignUp')}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9F2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "80%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D2D2D",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0061F2",
    width: "100%",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#A0C4FF",
  },
});
