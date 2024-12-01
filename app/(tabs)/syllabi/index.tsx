import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const SyllabiPage = () => {
  return (
    <SafeAreaView style = {styles.container}>
      <Text>SyllabiPage</Text>
    </SafeAreaView>
  )
}

export default SyllabiPage

const styles = StyleSheet.create({
  container:{
    backgroundColor:"#D9F2FF",
    flex:1
  }
})