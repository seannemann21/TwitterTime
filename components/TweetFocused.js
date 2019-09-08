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
    getFullTweet(this.props.credentials.token, this.props.credentials.secret, this.props.tweetData.id_str).then(data => {
      this.setState({displayText: data.data.full_text,
                     firstImageUrl: data.data.entities.media && data.data.entities.media.length > 0 ? data.data.entities.media[0].media_url_https : null
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
