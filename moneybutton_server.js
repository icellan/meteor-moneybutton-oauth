MoneyButton.handleAuthFromAccessToken = (accessToken, expiresAt) => {
    const identity = getIdentity(accessToken, MoneyButton.whitelistedFields);
    const serviceData = {
        accessToken,
        expiresAt,
        ...identity,
    };

    return {
        serviceData,
        options: {
            profile: {
                name: identity.name
            }
        },
    };
};

OAuth.registerService('moneybutton', 2, null, query => {
    const response = getTokenResponse(query);
    const { accessToken } = response;
    const { expiresIn } = response;

    return MoneyButton.handleAuthFromAccessToken(accessToken, (+new Date) + (1000 * expiresIn));
});

const getTokenResponse = query => {
    const config = ServiceConfiguration.configurations.findOne({ service: 'moneybutton' });
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    let responseContent;
    try {
        // Request an access token
        responseContent = HTTP.post(
            'https://www.moneybutton.com/oauth/v1/token', {
                params: {
                    grant_type: 'authorization_code',
                    code: query.code,
                    redirect_uri: OAuth._redirectUri('moneybutton', config),
                    client_id: config.oAuthIdentifier,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).data;
    } catch (err) {
        throw Object.assign(
            new Error(`Failed to complete OAuth handshake with MoneyButton. ${err.message}`),
            { response: err.response },
        );
    }

    const accessToken = responseContent.access_token;
    const expires = responseContent.expires_in;

    if (!accessToken) {
        throw new Error('Failed to complete OAuth handshake with Money Button ' +
            `-- can't find access token in HTTP response. ${responseContent}`);
    }

    return {
        accessToken: accessToken,
        expiresIn: expires,
    };
};

const getIdentity = (accessToken, fields) => {
    const config = ServiceConfiguration.configurations.findOne({ service: 'moneybutton' });
    if (!config)
        throw new ServiceConfiguration.ConfigError();

    try {
        const identity = HTTP.get("https://www.moneybutton.com/api/v1/auth/user_identity", {
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                Authorization: `Bearer ${accessToken}`
            }
        });
        const identityContent = JSON.parse(identity.content);

        return identityContent.data.attributes;
    } catch (err) {
        throw Object.assign(
            new Error(`Failed to fetch identity from Money Button. ${err.message}`),
            { response: err.response },
        );
    }
};

MoneyButton.retrieveCredential = function(credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
