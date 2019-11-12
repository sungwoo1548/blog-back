module.exports = {
    jwtSecret: process.env.TOKEN_KEY || "devKey",
    jwtSession: {
        session: false,
    },
};