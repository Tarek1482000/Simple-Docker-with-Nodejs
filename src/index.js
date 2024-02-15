const express = require("express");
const dotenv = require("dotenv"); // Import dotenv module
// const mongoose = require("mongoose");
const redis = require("redis");
const { Client } = require("pg");
const os = require("os");
// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// const mongoURL = process.env.MONGO_URL; // Get MongoDB connection URL from environment variables
// mongoose
//   .connect(mongoURL)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Failed to connect to MongoDB", err));

const PostgreSql_URL = process.env.POSTGRESQL_URL; // Get PostgreSQL connection URL from environment variables
const Postgresql_client = new Client({
  connectionString: PostgreSql_URL,
});

Postgresql_client.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Failed to connect to PostgreSQL", err));

const url = process.env.REDIS_URL;
const RedisClient = redis.createClient({ url });
RedisClient.on("connect", () => console.log("Connected to Redis"));
RedisClient.on("error", (err) => console.log("Redis client error", err));
RedisClient.connect();

app.get("/", (req, res) => {
  RedisClient.set("prod", "prod...");
  console.log(`Traffic from ${os.hostname}`);
  res.send("<h1> Hello Tarek </h1>");
});

app.get("/data", async (req, res) => {
  const product = await RedisClient.get("prod");
  res.send(`<h1> Hello Tarek </h1> <h2> ${product}</h2>`);
});

const PORT = process.env.PORT || 4000; // Set default port to 4000 if PORT environment variable is not provided
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
