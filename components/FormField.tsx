import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FormFieldProps = {
  title: string;
  value: string;
  handleChangeText: (e: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "decimal-pad" | "visible-password";
  secureTextEntry?: boolean;
};

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A8A8A8"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#2D2D2D"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    color: "#2D2D2D",
    marginBottom: 8,
    fontWeight: "500", // Lighter font weight for better hierarchy
  },
  inputContainer: {
    height: 56, // Increased height for larger input fields
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C8C8C8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    color: "#2D2D2D",
    fontSize: 18, // Increased font size for better readability
    paddingVertical: 14, // Increased padding for more space inside the input
  },
  iconContainer: {
    padding: 8,
  },
});

