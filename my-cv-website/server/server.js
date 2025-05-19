// server.js
import fs from "fs";
import path from "path";
import http from "http";
import https from "https"; 
import express from "express";
import cors from "cors";
import compression from "compression";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type:                        process.env.FIREBASE_TYPE,
  project_id:                  process.env.FIREBASE_PROJECT_ID,
  private_key:                 process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email:                process.env.FIREBASE_CLIENT_EMAIL,
  client_id:                   process.env.FIREBASE_CLIENT_ID,
  auth_uri:                    process.env.FIREBASE_AUTH_URI,
  token_uri:                   process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url:        process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:  serviceAccount.project_id,
});
const db = admin.firestore();

const app = express();
app.use(cors());

app.use(compression({
  level: 6,
  threshold: 0,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const rootDir = path.join(__dirname, "..");
app.use(express.static(rootDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

// Translations API
app.get("/api/translations/:lang", async (req, res) => {
  try {
    const snap = await db.collection("translations").doc(req.params.lang).get();
    if (!snap.exists) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(snap.data());
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const httpsOpts = {
  key: fs.readFileSync(path.join(__dirname, "certs/privkey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs/fullchain.pem"))
};

const HTTPS_PORT = process.env.PORT || 3000;

// Use a regular HTTPS server instead of HTTP/2
const server = https.createServer(httpsOpts, app);

server.listen(HTTPS_PORT, err => {
  if (err) {
    console.error("❌ HTTPS Server failed:", err);
    process.exit(1);
  }
  console.log(`🚀 HTTPS server running at https://localhost:${HTTPS_PORT}`);
});

const HTTP_PORT = 8080;
http
  .createServer((req, res) => {
    const host = req.headers.host?.split(":")[0] || "localhost";
    const location = `https://${host}:${HTTPS_PORT}${req.url}`;
    res.writeHead(301, { Location: location });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`🔀 HTTP redirector running at http://localhost:${HTTP_PORT} → https://localhost:${HTTPS_PORT}`);
  });