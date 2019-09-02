import axios from 'axios';
import mockTweet from '../../mocks/MockTweet';

export function getHomeTimeline(token, secret) {
  return axios.get(`https://quiqly.herokuapp.com/twitter/my_timeline?token=${token}&secret=${secret}`)
}

export function getMockedHomeTimeline() {
  return new Promise((resolve, reject) => {
    resolve(mockTweet(6))
  })
}
