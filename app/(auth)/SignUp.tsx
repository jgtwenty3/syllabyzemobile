import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/FormField";
import { signUp } from "@/lib/queries";
import { NewUser } from "@/types"; // Import your types
import { router } from "expo-router";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<NewUser>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.firstName === "" || form.lastName === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await signUp(form);
    } catch (error) {
      Alert.alert("Error", "There was an issue signing up. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logonameblue.png")}
        style={styles.image}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Create Your Account</Text>

        <FormField
          title="First Name"
          value={form.firstName}
          handleChangeText={(e) => setForm({ ...form, firstName: e })}
          placeholder="Enter your first name"
        />

        <FormField
          title="Last Name"
          value={form.lastName}
          handleChangeText={(e) => setForm({ ...form, lastName: e })}
          placeholder="Enter your last name"
        />

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
          <Text style={styles.buttonText}>{isSubmitting ? "Submitting..." : "Sign Up"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={() => router.push('/SignIn')}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;

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
