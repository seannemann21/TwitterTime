import React, { useState, useEffect } from 'react'
import { SQLite } from 'expo-sqlite';
import { AppState } from 'react-native'

export default function useTimer() {

  const [secondsOnPage, setSecondsOnPage] = useState(0)
  const db = SQLite.openDatabase('quiqly')
  const [date, setDate] = useState()
  const [startTime, setStartTime] = useState()
  const [appState, setAppState] = useState(AppState.currentState)
  const [previousTimeOnPage, setPreviousTimeOnPage] = useState(0)

  useEffect(() => {
    updatePreviousTimeOnPage()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const currentTime = new Date().getTime() / 1000
      setSecondsOnPage(Math.round(previousTimeOnPage + currentTime - startTime))
    }, 1000)
    return(() => {clearInterval(id)})
  })

  const updatePreviousTimeOnPage = () => {
    if(!db) return
    const startDateTime = new Date()
    setStartTime(startDateTime.getTime() / 1000)
    setDate(`${(startDateTime.getMonth() + 1)}-${startDateTime.getDate()}-${startDateTime.getFullYear()}`)
    let timeOnPage = 0
    db.transaction((tx) => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS time_open (date TEXT PRIMARY KEY, time_on_page INT);', [], (_, resultSet) => {}, (_, error) => {
        console.log(error)
      })
      tx.executeSql('SELECT time_on_page FROM time_open WHERE date = ?', [date], (_, { rows }) => {
        let seconds = 0
        if(rows.length > 0) {
          seconds = rows._array[0].time_on_page
        }
        timeOnPage = seconds
        setPreviousTimeOnPage(timeOnPage)
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
      updatePreviousTimeOnPage()
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
