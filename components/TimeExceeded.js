import React from 'react'
import {View, Text} from 'react-native'

export default function TimeExceeded(props) {

  return ( 
  <View>
    <Text>
      Sorry, you've spent { props.secondsOnPage } seconds on the page, but the maximum allowed time is { props.maxSecondsOnPage }
    </Text>
  </View>
  )
}