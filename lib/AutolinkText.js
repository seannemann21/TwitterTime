import Autolinker from 'autolinker';
import React from 'react';
import { Text } from 'react-native'
import { Linking } from 'expo';


export default function autolinkText(text) {
  const matches = Autolinker.parse(text, {
    urls: true
  })

  let words = text.split(' ')

  let autoLinked = []

  for(let i = 0; i < words.length; i++) {
    let match = matches.find(x => x.matchedText === words[i])
    if(match) {
      autoLinked.push(<Text style={{color: 'blue'}} onPress={() => Linking.openURL(match.url)}>{match.matchedText}</Text>)
    } else {
      autoLinked.push(<>{words[i] + ' '}</>)
    }
    //autoLinked.push({i !== (words.length - 1) ? <>' '</> : null})
  }

  return autoLinked
}
