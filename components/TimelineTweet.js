import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Tweet from './Tweet'

export default function TimelineTweet(props) {

  console.log("XXXXXXX Timeline Tweet XXXXXXXX")
  console.log(props)
  return (
    <View>
    <TouchableOpacity onPress={()=> {
      props.navigation.push('Tweet', { props: props } );
      }
    }>
      <Tweet {...props} />
      </TouchableOpacity>
    </View>
  )
}
