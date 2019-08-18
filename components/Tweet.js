import React from 'react'

function Tweet(tweet) {
  return (
    <View>
      <Text>{tweet.user.name}</Text>
      <Text>{tweet.text}</Text>
    </View>
  )
}