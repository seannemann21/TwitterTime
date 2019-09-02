import React, { Component } from 'react'
import { Image, View, Text } from 'react-native'
import { Card } from 'react-native-elements'
import autolinkText from '../lib/AutolinkText'
import Tweet from './Tweet'
import {getFullTweet} from '../lib/api/TweetApi'

export default class TweetFocused extends Component{

  constructor(props) {
    super(props)

    this.state = {
      displayText: props.text
    }
  }

  componentDidMount() {
    console.log("xxxxxx Tweet Focused xxxxxx")
    console.log(this.props)
    console.log(this.props.credentials)
    getFullTweet(this.props.credentials.token, this.props.credentials.secret, this.props.tweetData.id_str).then(data => {
      console.log('XXXXXX        Focused Tweet       XXXXXXXXX')
      console.log(data.data.full_text)
      console.log(data.data.entities)
      console.log(data.data.entities.media)
      console.log(data.data.entities.media[0].media_url_https)
      this.setState({displayText: data.data.full_text,
                     firstImageUrl: data.data.entities.media.length > 0 ? data.data.entities.media[0].media_url_https : null
                    })

    })
  }

  render() {
    return (
      <Card>
        <Text>{this.props.tweetData.user.name}</Text>
        <Text>{this.state.displayText}</Text>
        { this.state.firstImageUrl ? <Image
          style={{width: 66, height: 58}} source={{uri: this.state.firstImageUrl}}/> : null}
      </Card>
    )
  }
}
