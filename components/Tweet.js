import React from 'react'
import { Text } from 'react-native'
import { Card } from 'react-native-elements'
import autolinkText from '../lib/AutolinkText'

export default function Tweet(props) {

  return (
    <Card>
      <Text>{props.tweetData.user.name}</Text>
      <Text>{autolinkText(props.tweetData.text)}</Text>
    </Card>
  )
}
