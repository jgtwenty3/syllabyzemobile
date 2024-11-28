import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'

type ButtonProps = {
    title:string;
    onPress: ()=> void;
    buttonStyle?:ViewStyle;
    
}

const Button: React.FC<ButtonProps> = ({ title, onPress, buttonStyle }) => {
    return (
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
        <Text style={[styles.buttonText]}>{title}</Text>
      </TouchableOpacity>
    );
  };

export default Button

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#1836E3', // Customize button background color
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      borderWidth:1,
      borderColor:'gray',
    
      marginBottom:10
      
      
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      justifyContent:'center'
    },
  });