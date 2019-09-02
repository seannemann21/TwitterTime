import React from 'react';
import TweetFocused from '../components/TweetFocused'

export default function TweetScreen(props) {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
   console.log('\n\nTweet Screen Hit\n\n')
  const passedProps = props.navigation.getParam('props', 'default')
  console.log(passedProps)
  return <TweetFocused {...passedProps}/>;
}

TweetScreen.navigationOptions = {
  title: 'Tweet',
};
