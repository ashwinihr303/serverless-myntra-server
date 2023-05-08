"use strict";
var express = require("express");
var router = express.Router();
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
  sendAccessToken,
} = require("../utils/tokens");
const { fakeDB } = require("../utils/fakeDB");
const { isAuth } = require("../utils/isAuth");
const { getSecrets } = require("../utils/loadSecrets");
const AWS = require("aws-sdk");
const USERS_TABLE = process.env.users_table;

AWS.config.update({
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
}); // The config should before dynamodb instance creation
const { DynamoDBClient, 
  GetItemCommand , PutItemCommand
} = require("@aws-sdk/client-dynamodb");
const dbclient = new DynamoDBClient({ region: process.env.region});

// 1. Register a user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if the user exist
    const user = fakeDB.find((user) => user.email === email);
    if (user) throw new Error("User already exist");
    // 2. If not user exist already, hash the password
    const hashedPassword = await hash(password, 10);
    // 3. Insert the user in "database"
    fakeDB.push({
      id: fakeDB.length,
      email,
      password: hashedPassword,
    });
    res.send({ message: "User Created" });
    console.log(fakeDB);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 2. Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in array. If not exist send error
    const user = fakeDB.find((user) => user.email === email);
    if (!user) throw new Error("User does not exist");
    // 2. Compare crypted password and see if it checks out. Send error if not
    const valid = await compare(password, user.password);
    if (!valid) throw new Error("Password not correct");
    // 3. Create Refresh- and Accesstoken
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);
    // 4. Store Refreshtoken with user in "db"
    // Could also use different version numbers instead.
    // Then just increase the version number on the revoke endpoint
    user.refreshtoken = refreshtoken;
    // 5. Send token. Refreshtoken as a cookie and accesstoken as a regular response
    sendRefreshToken(res, refreshtoken);
    sendAccessToken(res, req, accesstoken);
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 3. Logout a user
router.post("/logout", (_req, res) => {
  res.clearCookie("refreshtoken", { path: "/refresh_token" });
  // Logic here for also remove refreshtoken from db
  return res.send({
    message: "Logged out",
  });
});

// 4. Protected route
router.post("/protected", async (req, res) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      res.send({
        data: "This is protected data.",
      });
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
});

// 5. Get a new access token with a refresh token
router.post("/refresh_token", (req, res) => {
  const token = req.cookies.refreshtoken;
  // If we don't have a token in our request
  if (!token) return res.send({ accesstoken: "" });
  // We have a token, let's verify it!
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.send({ accesstoken: "" });
  }
  // token is valid, check if user exist
  const user = fakeDB.find((user) => user.id === payload.userId);
  if (!user) return res.send({ accesstoken: "" });
  // user exist, check if refreshtoken exist on user
  if (user.refreshtoken !== token) return res.send({ accesstoken: "" });
  // token exist, create new Refresh- and accesstoken
  const accesstoken = createAccessToken(user.id);
  const refreshtoken = createRefreshToken(user.id);
  // update refreshtoken on user in db
  // Could have different versions instead!
  user.refreshtoken = refreshtoken;
  // All good to go, send new refreshtoken and accesstoken
  sendRefreshToken(res, refreshtoken);
  return res.send({ accesstoken });
});

// test
router.get("/test", async (req, res) => {
  const secret = await getSecrets("secrets_access_key");
  return res.send({ msg: `Secrete value ${secret}` });
});

router.get("/users/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: {S:req.params.userId},
    },
  };

  try {
    const { Item } = await dbclient.send(new GetItemCommand(params));
    if (Item) {
      res.send(Item );
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

router.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: {S:userId},
      name: {S:name},
    },
  };

  try {
    const  Item  = await dbclient.send(new PutItemCommand(params));
    res.send(Item)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

module.exports = router;
