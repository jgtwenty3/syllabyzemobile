import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const CoursesPage = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <Text>CoursesPage</Text>
    </SafeAreaView>
  )
}

export default CoursesPage

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#D9F2FF",
    flex:1
  }
})