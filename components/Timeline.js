import React, { useState } from 'react'
import { getHomeTimeline } from '../lib/api/TweetTimelines'
import Tweet from './Tweet'
import TimelineTweet from './TimelineTweet'
import { StyleSheet, Text, View, FlatList } from 'react-native'
import withTimer from './withTimer'
import AuthenticationButton from './AuthenticationButton'
import useTimer from './useTimer'

function Timeline(props) {
  const [token, setToken] = useState();
  const [secret, setSecret] = useState();
  const [timelineTweets, setTimelineTweets] = useState();
  const { secondsOnPage } = useTimer()

  const updateTimeline = (token, secret) => {
    getHomeTimeline(token, secret).then(timeline => {
      setTimelineTweets(timeline.data)
    })
  }

  return (
    <View style={{flex: 1}}>
      <AuthenticationButton
          setToken={(token) => {setToken(token)}}
          setSecret={(secret) => {setSecret(secret)}}
          authorizationCompleteCallback={() => {updateTimeline(token, secret)}}
      />
      <Text>{secondsOnPage}</Text>
      <FlatList
        data={timelineTweets}
        renderItem={({item}) => <TimelineTweet tweetData={item} navigation={props.navigation} credentials={{token: token, secret: secret}}/>}
      />
    </View>
  )
}

export default Timeline
