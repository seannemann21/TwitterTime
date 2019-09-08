import React from 'react'
import { View, Text } from 'react-native'
import { Card } from 'react-native-elements'
import { Linking } from 'expo';
import autolinkText from '../lib/AutolinkText'

export default function Tweet(props) {

  return (
    <Card>
      <Text>{props.tweetData.user.name}</Text>
      <Text>{autolinkText(props.tweetData.text)}</Text>
    </Card>
  )
}
