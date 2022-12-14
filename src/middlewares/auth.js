const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
    
    if(!user){
        throw new Error();
    }

    req.user = user;
    req.token = token;

    } catch(err){
        return res.status(400).send("Invalid authentication...");
    }
    next();
}

module.exports = auth;