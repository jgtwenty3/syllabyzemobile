import { Text, View, StyleSheet, Image } from "react-native";
import { StatusBar } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/Button";




export default function App() {

//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/images/logonameblue.png')}
        style={styles.image}
      />
      
      <StatusBar />
      <View style = {styles.buttonContainer}>
        <Button title = " Login "   onPress={()=>router.push("/SignIn")} />
        <Button title = "Sign Up"  onPress={()=>router.push("/SignUp")}/>
        
      </View>
  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#D9F2FF',
  },
  image: {
    width: 200,  
    height: 200, 
    resizeMode: 'contain', 
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '40%', 
  },
});

