import React from 'react'
import { View, Text } from 'react-native'
import { Card } from 'react-native-elements'
import Autolinker from 'autolinker';
import { Linking } from 'expo';

export default function Tweet(props) {

  return (
    <Card>
      <Text>{props.tweetData.user.name}</Text>
      <Text>{autoLink(props.tweetData.text)}</Text>
    </Card>
  )
}

function autoLink(input) {
  const matches = Autolinker.parse(input, {
    urls: true
  })

  let words = input.split(' ')

  let autoLinked = []

  for(let i = 0; i < words.length; i++) {
    let match = matches.find(x => x.matchedText === words[i])
    if(match) {
      autoLinked.push(<Text style={{color: 'blue'}} onPress={() => Linking.openURL(match.url)}>{match.matchedText}</Text>)
    } else {
      autoLinked.push(<Text>{words[i]}</Text>)
    }
  }

  return autoLinked
}