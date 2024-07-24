const jwt = require("jsonwebtoken");
const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

module.exports.getMockToken = (data) => jwt.sign({
    id: "1",
    name: "Lorem",
    email: "lorem@gmail.com",
    role: "admin",
    ...(data || {})
}, process.env.JWT_SECRET, {expiresIn: '1h'});

module.exports.startMockServer = async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
}

module.exports.stopMockServer = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}