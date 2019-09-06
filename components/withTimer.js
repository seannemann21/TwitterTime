import React, {Component} from 'react'
import { SQLite } from 'expo-sqlite';
import { AppState } from 'react-native'

export default function withTimer(WrappedComponent) {
  return class extends Component{
    constructor(props) {
      super(props)
      this.db = SQLite.openDatabase('quiqly')
      this.startUpTimer()
      this.state = {secondsOnPage: 0, appState: AppState.currentState,}
    }

    componentDidMount() {
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
      this.startDateTime = new Date()
      this.startTime = this.startDateTime.getTime() / 1000
      this.date = `${(this.startDateTime.getMonth() + 1)}-${this.startDateTime.getDate()}-${this.startDateTime.getFullYear()}`

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

      this._interval = setInterval(() => {
        const currentTime = new Date().getTime() / 1000
        this.setState({
          secondsOnPage: Math.round(this.timeOnPage + currentTime - this.startTime)
        })
      }, 1000);
    }

    render(){
      return <WrappedComponent secondsOnPage={this.state.secondsOnPage} {...this.props} />;
    }
  }
}
