import React, { Component } from 'react'
import { getHomeTimeline, getMockedHomeTimeline} from '../lib/api/TweetTimelines'
import Tweet from './Tweet'
import TimelineTweet from './TimelineTweet'
import { requestToken } from '../lib/api/Authentication'
import { Linking} from 'expo'
import * as WebBrowser from 'expo-web-browser'
import { AppState, Button, StyleSheet, Text, View, FlatList } from 'react-native'
import { updateExpression } from '@babel/types';
import { SQLite } from 'expo-sqlite';

export default class Timeline extends Component {

  constructor(props) {
    super(props)
    this.state = {timelineTweets: [], secondsOnPage: 0, appState: AppState.currentState,}
    this.startDateTime = new Date()
    this.startTime = this.startDateTime.getTime() / 1000
    this.db = SQLite.openDatabase('quiqly')
    this.date = `${(this.startDateTime.getMonth() + 1)}-${this.startDateTime.getDate()}-${this.startDateTime.getFullYear()}`
    this.startUpTimer()
  }


  componentDidMount() {
    /*console.log(this.props.navigation)
    console.log(Linking.makeUrl())

    Linking.addEventListener('url', this.handleRedirect)

    getMockedHomeTimeline().then(timeline => {
      const tweetsObj = JSON.parse(timeline)
      this.setState({timelineTweets: tweetsObj.tweets})
    })
    */

    AppState.addEventListener('change', this._handleAppStateChange);



  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      this.startUpTimer()
    } else {
      clearInterval(this._interval)
      this.db.transaction((tx) => {
        tx.executeSql('INSERT OR REPLACE INTO time_open (date, time_on_page) values(?, ?);', [this.date, this.state.secondsOnPage])
      })
    }
    this.setState({appState: nextAppState});
  };

  startUpTimer() {
    this.db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS time_open (date TEXT PRIMARY KEY, time_on_page INT);', [], (_, resultSet) => {}, (_, error) => {
        console.log(error)
      })
      console.log("Test")
      tx.executeSql('SELECT time_on_page FROM time_open WHERE date = ?', [this.date], (_, { rows }) => {
        console.log("Test")
        let seconds = 0
        console.log(rows)
        if(rows.length > 0) {
          console.log(rows)
          seconds = rows._array[0].time_on_page
        }
        this.timeOnPage = seconds
        console.log(this.timeOnPage)
      }, (tx2, error) => {
        console.log(error)
      })
    })

    this.startTime = new Date().getTime() / 1000

    this._interval = setInterval(() => {
      const currentTime = new Date().getTime() / 1000
      this.setState({
        secondsOnPage: Math.round(this.timeOnPage + currentTime - this.startTime)
      })
    }, 1000);
  }


  _handleRedirect = event => {
    let data = Linking.parse(event.url)

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
        <Text>{this.state.secondsOnPage}</Text>
        <FlatList
          data={this.state.timelineTweets}
          renderItem={({item}) => <TimelineTweet tweetData={item} navigation={this.props.navigation} credentials={{token: this.token, secret: this.secret}}/>}
        />
      </View>
    )
  }
}
