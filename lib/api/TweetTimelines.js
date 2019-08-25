import axios from 'axios';

export function getHomeTimeline(token, secret) {
  return axios.get(`https://quiqly.herokuapp.com/twitter/my_timeline?token=${token}&secret=${secret}`)
}