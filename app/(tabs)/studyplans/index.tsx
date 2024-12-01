import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const StudyPlansPage = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <Text>StudyPlansPage</Text>
    </SafeAreaView>
  )
}

export default StudyPlansPage

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#D9F2FF",
    flex:1
  }
})