import mockTweet from '../../mocks/MockTweet';

export function getHomeTimeline() {
  return new Promise((resolve, reject) => {
    resolve(mockTweet(6))
  })
}