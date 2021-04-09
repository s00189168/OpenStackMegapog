const tokenService = require("../services/tokenService");

function cleanToken(token) {
    if (typeof token === "undefined" || token == null) {
        return null;
    }

    // Clean up
    return token.replace("Bearer ", "").replace("bearer ", "");
}

module.exports = {
    cleanToken,
};
