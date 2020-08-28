require('dotenv').config();

config = {
    PORT: process.env.PORT,
    URL_DB: process.env.URL_DB,
    TOKEN_EXPIRATION: eval(process.env.TOKEN_EXPIRATION),
    JWT_SEED: process.env.JWT_SEED,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
};

module.exports = config;