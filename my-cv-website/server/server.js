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
import nodemailer from "nodemailer";

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
app.use(express.json({ limit: '10mb' }));

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

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from CV website contact form</em></p>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    console.log(`Contact form submission from ${email}: ${subject}`);
    res.json({ success: true, message: "Email sent successfully" });
    
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const httpsOpts = {
  key: fs.readFileSync(path.join(__dirname, "certs/privkey.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs/fullchain.pem"))
};

const HTTPS_PORT = process.env.PORT || 3000;

const server = https.createServer(httpsOpts, app);

server.listen(HTTPS_PORT, err => {
  if (err) {
    console.error("HTTPS Server failed:", err);
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
    console.log(`HTTP redirector running at http://localhost:${HTTP_PORT} → https://localhost:${HTTPS_PORT}`);
  });