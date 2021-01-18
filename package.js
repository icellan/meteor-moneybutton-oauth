Package.describe({
  name: "icellan:moneybutton-oauth",
  summary: "Money Button OAuth flow",
  git: "https://github.com/icellan/meteor-moneybutton-oauth.git",
  version: "1.0.1"
});

Package.onUse(function(api) {
  api.use('ecmascript@0.12.7');
  api.use('oauth@1.2.8', ['client', 'server']);
  api.use('oauth2@1.2.1', ['client', 'server']);
  api.use('random@1.1.0', 'client');
  api.use('underscore@1.0.10', 'server');
  api.use('service-configuration@1.0.11', ['client', 'server']);

  api.addFiles('moneybutton_common.js', ['server', 'client']);

  api.addFiles('moneybutton_client.js', 'client');
  api.addFiles('moneybutton_server.js', 'server');

  api.export('MoneyButton');
});
