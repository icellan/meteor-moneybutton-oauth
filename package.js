Package.describe({
  name: "icellan:moneybutton-oauth",
  summary: "Money Button OAuth flow",
  git: "https://github.com/icellan/meteor-moneybutton-oauth.git",
  version: "2.0.0"
});

Package.onUse(function(api) {
  api.use('ecmascript');
  api.use('oauth@1.2.8', ['client', 'server']);
  api.use('oauth2@1.2.1', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);

  api.addFiles('moneybutton_common.js', ['server', 'client']);

  api.addFiles('moneybutton_client.js', 'client');
  api.addFiles('moneybutton_server.js', 'server');

  api.export('MoneyButton');
});
