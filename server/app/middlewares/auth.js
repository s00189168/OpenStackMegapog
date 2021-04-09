const tokenService = require("../services/tokenService");
const channelService = require("../services/channelService");
const tokenHelper = require("../helpers/tokenHelper");

const authCheck = (checkType = null) => {
    return async (req, res, next) => {
        let uuidToken = req.header("Authorization");
        const cleanToken = tokenHelper.cleanToken(uuidToken);

        if (cleanToken == null) {
            res.status(401).json({
                status: "Error",
                message: "Authorization bearer token not sent",
            });
            return;
        }

        const token = await tokenService.getTokenByUuid(cleanToken);
        if (!token) {
            console.log("Invalid auth token: " + cleanToken);
            res.status(401).json({
                status: "Error",
                message: "Invalid authorization token",
            });
            return;
        }

        if (Date.parse(token.expiresAt) < Date.now()) {
            console.log("Expired auth token: " + cleanToken);
            res.status(401).json({
                status: "Error",
                message: "Token has expired",
            });
            return;
        }

        if (checkType === "admin") {
            const channel = await channelService._getByName(token.name);
            if (channel == null) {
                res.status(401).json({
                    status: "Error",
                    message: "Admin channel not registered",
                });
                return;
            }
            if (!channel.isAdmin) {
                console.log(channel);
                res.status(403).json({
                    status: "Error",
                    message: "This endpoint is only accessible by admins",
                });
                return;
            }
        } else if (checkType === "channelOwner") {
            if (token.name != req.body.name) {
                res.status(403).json({
                    status: "Error",
                    message: "Invalid channel ownership",
                });
                return;
            }
        }

        next();
    };
};

module.exports = authCheck;
