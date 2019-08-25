import axios from 'axios'
import uuidv4 from 'uuid/v4'
import jsSHA from 'jssha'

export function requestToken() {
  const authorization = getAuthorization('GET', 'https://api.twitter.com/oauth/request_token', {})
  axios.get('https://api.twitter.com/oauth/request_token', {
    headers: {
      'Authorization': authorization,
      'Access-Control-Allow-Origin': '*'
    }
  })
}

export function requestTokens() {
  const authorization = getAuthorization('GET', 'https://api.twitter.com/1.1/statuses/home_timeline.json', {})
  axios.get('https://api.twitter.com/1.1/statuses/home_timeline.json', {
    headers: {
      'Authorization': authorization,
      'Access-Control-Allow-Origin': '*'
    }
  })
}
/*
function requestToken() {
  uuid = uuidv4()
  console.log(uuid)
  axios.post('https://api.twitter.com/oauth/request_token', {
    headers: {
      'oauth_nonc':uuid.replace(/-/g, ''),
      'oauth_callback':encodeURI('https://quiqly.herokuapp.com/api/callback'),
      'oauth_signature_method': 'HMAC-SHA1', 
      'oauth_timestamp': Date.now(),
      'oauth_consumer_key': ''
    }
    OAuth oauth_nonce: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
}
*/

// all below code from https://imagineer.in/blog/authorizing-twitter-api-calls-in-javascript/

function getInitialAuthorization(httpMethod, baseUrl, reqParams) {
  // Get acces keys
  const consumerKey       = 'wBNkP61kNAUANd80t5raZv95V',
      consumerSecret      = 'ttruIGqsiA849B2Z9KNwv3pk76SlUGqXMciEFdYRCB2X4YMouK',
      accessToken         = '598867564-Q6i183l8bpqibpV5Mttj2vKiSoKnD5J6uKYVLWEe',
      accessTokenSecret   = 'sz7k9ZlBo115m3SuexQmf86zhCXLzD9GmSy8d31Y87yD8';
  // timestamp as unix epoch
  let timestamp  = Math.round(Date.now() / 1000);
  // nonce as base64 encoded unique random string
  let nonce      = btoa(consumerKey + ':' + timestamp);
  // generate signature from base string & signing key
  let baseString = oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
  let signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret);
  let signature  = oAuthSignature(baseString, signingKey);
  // return interpolated string
  return 'OAuth '                                         +
      'oauth_consumer_key="'  + consumerKey       + '", ' +
      'oauth_nonce="'         + nonce             + '", ' +
      'oauth_signature="'     + signature         + '", ' +
      'oauth_signature_method="HMAC-SHA1", '              +
      'oauth_timestamp="'     + timestamp         + '", ' +
      'oauth_token="'         + accessToken       + '", ' +
      'oauth_version="1.0"'                               ;
}

function getAuthorization(httpMethod, baseUrl, reqParams) {
  // Get acces keys
  const consumerKey       = 'wBNkP61kNAUANd80t5raZv95V',
      consumerSecret      = 'ttruIGqsiA849B2Z9KNwv3pk76SlUGqXMciEFdYRCB2X4YMouK',
      accessToken         = '598867564-Q6i183l8bpqibpV5Mttj2vKiSoKnD5J6uKYVLWEe',
      accessTokenSecret   = 'sz7k9ZlBo115m3SuexQmf86zhCXLzD9GmSy8d31Y87yD8';
  // timestamp as unix epoch
  let timestamp  = Math.round(Date.now() / 1000);
  // nonce as base64 encoded unique random string
  let nonce      = btoa(consumerKey + ':' + timestamp);
  // generate signature from base string & signing key
  let baseString = oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce);
  let signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret);
  let signature  = oAuthSignature(baseString, signingKey);
  // return interpolated string
  return 'OAuth '                                         +
      'oauth_consumer_key="'  + consumerKey       + '", ' +
      'oauth_nonce="'         + nonce             + '", ' +
      'oauth_signature="'     + signature         + '", ' +
      'oauth_signature_method="HMAC-SHA1", '              +
      'oauth_timestamp="'     + timestamp         + '", ' +
      'oauth_token="'         + accessToken       + '", ' +
      'oauth_version="1.0"'                               ;
}

function oAuthBaseString(method, url, params, key, token, timestamp, nonce) {
  return method
          + '&' + percentEncode(url)
          + '&' + percentEncode(genSortedParamStr(params, key, token, timestamp, nonce));
};

function oAuthSigningKey(consumer_secret, token_secret) {
  return consumer_secret + '&' + token_secret;
};

function oAuthSignature(base_string, signing_key) {
  var signature = hmac_sha1(base_string, signing_key);
  return percentEncode(signature);
};

// Percent encoding
function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!*()']/g, (character) => {
    return '%' + character.charCodeAt(0).toString(16);
  });
};
// HMAC-SHA1 Encoding, uses jsSHA lib

function hmac_sha1(string, secret) {
    let shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(secret, "TEXT");
    shaObj.update(string);
    let hmac = shaObj.getHMAC("B64");
    return hmac;
};
// Merge two objects
function mergeObjs(obj1, obj2) {
    for (var attr in obj2) {
        obj1[attr] = obj2[attr];
    }
    return obj1;
};
// Generate Sorted Parameter String for base string params
function genSortedParamStr(params, key, token, timestamp, nonce)  {
    // Merge oauth params & request params to single object
    let paramObj = mergeObjs(
        {
            oauth_consumer_key : key,
            oauth_nonce : nonce,
            oauth_signature_method : 'HMAC-SHA1',
            oauth_timestamp : timestamp,
            oauth_token : token,
            oauth_version : '1.0'
        },
        params
    );
    // Sort alphabetically
    let paramObjKeys = Object.keys(paramObj);
    let len = paramObjKeys.length;
    paramObjKeys.sort();
    // Interpolate to string with format as key1=val1&key2=val2&...
    let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]];
    for (var i = 1; i < len; i++) {
        paramStr += '&' + paramObjKeys[i] + '=' + percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]));
    }
    return paramStr;
};