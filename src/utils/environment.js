import {EnvironmentName} from '../constants/text';

var environments = {
  production: {BASE_URL: 'https://escrap-api.herokuapp.com', API_KEY: ''},
  staging: {BASE_URL: 'https://escrap-api.herokuapp.com', API_KEY: ''},
  development: {BASE_URL: 'https://escrap-api.herokuapp.com', API_KEY: ''},
};

function getEnvironment() {
  var platform = getPlatform();
  return environments[platform];
}

// change here for changing from development moved to production mode
function getPlatform() {
  return EnvironmentName.Development;
}

function isDevelopment() {
  return EnvironmentName.Development === getPlatform();
}

function enableLoggingToConsole() {
  // change here to disable logging
  const logToConsole = true;
  return EnvironmentName.Development === getPlatform() && logToConsole;
}


export default {getEnvironment, isDevelopment, enableLoggingToConsole};
