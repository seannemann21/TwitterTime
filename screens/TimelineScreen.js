import React from 'react';
import Timeline from '../components/Timeline'

export default function TimelineScreen(props) {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return <Timeline navigation={props.navigation} />;
}

TimelineScreen.navigationOptions = {
  title: 'Timeline',
};
