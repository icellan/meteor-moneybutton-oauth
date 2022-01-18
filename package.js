Package.describe({
  name: "icellan:moneybutton-oauth",
  summary: "Money Button OAuth flow",
  git: "https://github.com/icellan/meteor-moneybutton-oauth.git",
  version: "2.0.0"
});

Package.onUse(function(api) {
  api.use('ecmascript@0.16.1');
  api.use('oauth@2.1.0', ['client', 'server']);
  api.use('oauth2@1.3.1', ['client', 'server']);
  api.use('random@1.2.0', 'client');
  api.use('underscore@1.0.10', 'server');
  api.use('service-configuration@1.3.0', ['client', 'server']);

  api.addFiles('moneybutton_common.js', ['server', 'client']);

  api.addFiles('moneybutton_client.js', 'client');
  api.addFiles('moneybutton_server.js', 'server');

  api.export('MoneyButton');
});
