import React, { Component } from 'react'
import { getHomeTimeline} from '../lib/api/TweetTimelines'
import Tweet from './Tweet'
import TimelineTweet from './TimelineTweet'
import { requestToken } from '../lib/api/Authentication'
import { Linking} from 'expo'
import * as WebBrowser from 'expo-web-browser'
import { Button, StyleSheet, Text, View, FlatList } from 'react-native'
import { updateExpression } from '@babel/types';

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {timelineTweets: []}
  }


  componentDidMount() {
    /*console.log(this.props.navigation)
    console.log(Linking.makeUrl())

    Linking.addEventListener('url', this.handleRedirect)
    
    getHomeTimeline().then(timeline => {
      this.setState({timelineTweets: timeline.tweets})
    })
    */


  }


  _handleRedirect = event => {
    console.log("Hello World")
    //WebBrowser.dismissBrowser();

    console.log(event.url)
    let data = Linking.parse(event.url)

    console.log(data.queryParams)
    this.token = data.queryParams.token
    this.secret = data.queryParams.secret
    this.updateTimeline()
  };

  updateTimeline() {
    getHomeTimeline(this.token, this.secret).then(timeline => {
      this.setState({timelineTweets: timeline.data})
    })
  }

  _openWebBrowserAsync = async () => {
    try {
      this._addLinkingListener();
      let result = await WebBrowser.openBrowserAsync(
        // We add `?` at the end of the URL since the test backend that is used
        // just appends `authToken=<token>` to the URL provided.
        `https://quiqly.herokuapp.com/auth/twitter?callback=${Linking.makeUrl()}`
      );
      console.log("Returned from browser")
      this.setState({ result });
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  _addLinkingListener = () => {
    Linking.addEventListener('url', this._handleRedirect);
  };

  _removeLinkingListener = () => {
    Linking.removeEventListener('url', this._handleRedirect);
  };

  render() {
    return (
      
      <View style={{flex: 1}}>
        <Button
          title="Open URL with Expo.WebBrowser"
          onPress={() => {this._openWebBrowserAsync()}
          }
        />
        <Text>{Linking.makeUrl()}</Text>
        <FlatList
          data={this.state.timelineTweets}
          renderItem={({item}) => <TimelineTweet tweetData={item} navigation={this.props.navigation} />}
        />
      </View>
    )
  }
}