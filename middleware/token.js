const jwt = require('jsonwebtoken');

// Define your secret keys
const accessTokenSecret = 'your_access_token_secret_key';
const refreshTokenSecret = 'your_refresh_token_secret_key';


// Function to create an access token
exports.createAccessToken = (userId) => 
{
    return jwt.sign({ id: userId }, accessTokenSecret, { expiresIn: '15m' });
};


// Function to create a refresh token
exports.createRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, refreshTokenSecret, { expiresIn: '30d' });
};
