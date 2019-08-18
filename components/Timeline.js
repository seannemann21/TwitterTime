import { React, Component } from 'react'
import { getHomeTimeline} from '../lib/api/TweetTimelines'

class Timeline extends Component {

  constructor() {
    this.state = {timelineTweets: []}
  }

  componentDidMount() {
    getHomeTimeline().then(timeline => {
      this.setState({timelineTweets: timeline})
    })
  }

  render() {
    <View>
        <FlatList
          data={this.state.timelineTweets}
          renderItem={({tweet}) => <Tweet tweetData={tweet} />}
        />
      </View>
  }
}