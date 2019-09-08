import React from 'react'
import useTimer from './useTimer'
import TimeExceeded from './TimeExceeded'

export default function TimeLimitter(props) {
  const { secondsOnPage } = useTimer()

  return secondsOnPage < props.maxSecondsOnPage ? props.children : <TimeExceeded secondsOnPage={secondsOnPage} {...props} />
}