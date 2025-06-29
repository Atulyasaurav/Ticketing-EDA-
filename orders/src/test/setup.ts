import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Declare global signin function
declare global {
    var signin: () => string[];
}

jest.mock("../nats-wrapper")


let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {

    jest.clearAllMocks();
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // Create a JWT payload { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    // Sign the payload to create a JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build a session object { jwt: token }
    const session = { jwt: token };

    // Convert session object to JSON string
    const sessionJSON = JSON.stringify(session);

    // Encode JSON to base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return it in cookie format
    return [`session=${base64}`];
};
