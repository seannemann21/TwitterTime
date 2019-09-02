import axios from 'axios';

export function getFullTweet(token, secret, tweetId) {
  return axios.get(`https://quiqly.herokuapp.com/twitter/full_text?token=${token}&secret=${secret}&tweet_id=${tweetId}`)
}
