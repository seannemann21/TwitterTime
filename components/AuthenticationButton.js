import React, { Component } from 'react'
import { Linking} from 'expo'
import * as WebBrowser from 'expo-web-browser'
import { Button } from 'react-native'

export default class AuthenticationButton extends Component {

  _handleRedirect = event => {
    let data = Linking.parse(event.url)

    this.props.setToken(data.queryParams.token)
    this.props.setSecret(data.queryParams.secret)
    this.props.authorizationCompleteCallback()
  };

  _openWebBrowserAsync = async () => {
    try {
      this._addLinkingListener();
      let result = await WebBrowser.openBrowserAsync(
        `https://quiqly.herokuapp.com/auth/twitter?callback=${Linking.makeUrl()}`
      );
    } catch (error) {
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
        <Button
          title="Open URL with Expo.WebBrowser"
          onPress={() => {this._openWebBrowserAsync()}
          }
        />
    )
  }
}
