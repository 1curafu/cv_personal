// server.js
import fs   from "fs";
import path from "path";
import http from "http";
import spdy from "spdy";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();  // loads FIREBASE_* vars

// —– Firebase Service Account Setup —–
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

// —– Express App Setup —–
const app = express();
app.use(cors());

// compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// serve static files from project root
const rootDir = path.join(__dirname, "..");
app.use(express.static(rootDir));

// Index route
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

// —– HTTPS / HTTP2 via SPDY —–
const httpsOpts = {
  key:  fs.readFileSync(path.join(__dirname, "certs/privkey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs/fullchain.pem")),
  // spdy will fallback to HTTP/1.1 automatically
};

const HTTPS_PORT = process.env.PORT || 3000;
spdy
  .createServer(httpsOpts, app)
  .listen(HTTPS_PORT, err => {
    if (err) {
      console.error("❌ SPDY/HTTP2 Server failed:", err);
      process.exit(1);
    }
    console.log(`🚀 HTTP/2 + HTTPS server running at https://localhost:${HTTPS_PORT}`);
  });

// —– Plain HTTP → HTTPS Redirect —–
const HTTP_PORT = 8080;
http
  .createServer((req, res) => {
    // preserve path + query, redirect to HTTPS
    const host = req.headers.host?.split(":")[0] || "localhost";
    const location = `https://${host}:${HTTPS_PORT}${req.url}`;
    res.writeHead(301, { Location: location });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`🔀 HTTP redirector running at http://localhost:${HTTP_PORT} → https://localhost:${HTTPS_PORT}`);
  });