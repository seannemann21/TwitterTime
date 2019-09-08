import React from 'react';
import Timeline from '../components/Timeline'
import TimeLimitter from '../components/TimeLimitter'

export default function TimelineScreen(props) {
  /**
   * Go ahead and delete ExpoConfigView and replace it with your content;
   * we just wanted to give you a quick view of your config.
   */
  return (
    <TimeLimitter maxSecondsOnPage={100}>
       <Timeline navigation={props.navigation} />
    </TimeLimitter>
  )
}

TimelineScreen.navigationOptions = {
  title: 'Timeline',
};
