import React from 'react';
import TweetFocused from '../components/TweetFocused'

export default function TweetScreen(props) {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  const passedProps = props.navigation.getParam('props', 'default')
  return <TweetFocused {...passedProps}/>;
}

TweetScreen.navigationOptions = {
  title: 'Tweet',
};
