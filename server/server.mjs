import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fakeData from "./fakeData/index.js";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";
import { access } from "fs";
import { error } from "console";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// connect to DB
const URI =
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}` +
  `@cluster0.ekrcnbc.mongodb.net/noteapp?retryWrites=true&w=majority&appName=Cluster0`;

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

const authorizationJWT = async (req, res, next) => {
  console.log({ authorization: req.headers.authorization });
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const accessToken = authorizationHeader.split(" ")[1];

    getAuth()
      .verifyIdToken(accessToken)
      .then((decodedToken) => {
        console.log({ decodedToken });
        res.locals.uid = decodedToken.uid
        next();
      })
      .catch((err) => {
        console.log({ err });
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
    return res.status(401).json({ message: "Unauthorized" }); 
  }
};

// ✅ Public route để test truy cập trình duyệt
app.get("/", (req, res) => {
  res.send("📝 Note App GraphQL API – Go to /graphql with a token.");
});

// ✅ Áp dụng xác thực **chỉ cho POST /graphql**
app.post("/graphql", authorizationJWT);

app.use(
  cors(),
  // authorizationJWT,
  bodyParser.json(),
  expressMiddleware(server, {
    context: async({req, res}) => {
      return { uid: res.locals.uid }
    }
  }) // bắt buộc để tránh lỗi context null
);

mongoose
  .connect(URI) // ⬅️  KHÔNG cần useNewUrlParser / useUnifiedTopology
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // dừng server nếu kết nối thất bại
  });
/* ─────────────────────────────────────────────── */
