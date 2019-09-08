import React, { useState, useEffect } from 'react'
import { SQLite } from 'expo-sqlite';
import { AppState } from 'react-native'
import useInterval from './useInterval'

export default function useTimer() {

  const [secondsOnPage, setSecondsOnPage] = useState(0)
  const db = SQLite.openDatabase('quiqly')
  const [date, setDate] = useState()
  const [startTime, setStartTime] = useState()
  const [appState, setAppState] = useState(AppState.currentState)
  const [previousTimeOnPage, setPreviousTimeOnPage] = useState(0)

  useEffect(() => {
    startUpTimer()
  }, [])

  useInterval(() => {
    const currentTime = new Date().getTime() / 1000
    setSecondsOnPage(Math.round(previousTimeOnPage + currentTime - startTime))
  }, 1000)

  const startUpTimer = () => {
    if(!db) return
    const startDateTime = new Date()
    setStartTime(startDateTime.getTime() / 1000)
    setDate(`${(startDateTime.getMonth() + 1)}-${startDateTime.getDate()}-${startDateTime.getFullYear()}`)
    let timeOnPage = 0
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS time_open (date TEXT PRIMARY KEY, time_on_page INT);', [], (_, resultSet) => {}, (_, error) => {
        console.log(error)
      })
      console.log("Test")
      tx.executeSql('SELECT time_on_page FROM time_open WHERE date = ?', [date], (_, { rows }) => {
        console.log("Test")
        let seconds = 0
        if(rows.length > 0) {
          seconds = rows._array[0].time_on_page
        }
        timeOnPage = seconds
        setPreviousTimeOnPage(timeOnPage)
        console.log(timeOnPage)
        console.log(timeOnPage)
      }, (tx2, error) => {
        console.log(error)
      })
    })

  }

  _handleAppStateChange = (nextAppState) => {
    if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      startUpTimer()
    } else {
      db.transaction((tx) => {
        tx.executeSql('INSERT OR REPLACE INTO time_open (date, time_on_page) values(?, ?);', [date, secondsOnPage])
      })
    }
    setAppState(nextAppState)
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return function cleanup() {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  })



    return { secondsOnPage }
}
