MoneyButton.requestCredential = (options, credentialRequestCompleteCallback) => {
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }

  const config = ServiceConfiguration.configurations.findOne({service: 'moneybutton'});
  if (!config) {
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(
        new ServiceConfiguration.ConfigError());
    return;
  }

  const credentialToken = Random.secret();
  let scope = "auth.user_identity:read";
  if (options && options.requestPermissions)
    scope = options.requestPermissions.join(' '); // space separated

  const loginStyle = OAuth._loginStyle('moneybutton', config, options);

  let loginUrl = `https://www.moneybutton.com/oauth/v1/authorize` +
        `?response_type=code` +
        `&client_id=${config.oAuthIdentifier}` +
        `&redirect_uri=${OAuth._redirectUri('moneybutton', config)}` +
        `&scope=${scope}` +
        `&state=${OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl)}`;
  if (MoneyButton.debug) console.log('loginUrl', loginUrl);

  // Handle authentication type (e.g. for force login you need auth_type: "reauthenticate")
  if (options && options.auth_type) {
    loginUrl += `&auth_type=${encodeURIComponent(options.auth_type)}`;
  }

  OAuth.launchLogin({
    loginService: "moneybutton",
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken,
  });
};
