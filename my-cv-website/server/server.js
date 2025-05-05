import express from "express";
import cors    from "cors";
import admin   from "firebase-admin";
import path    from "path";
import { fileURLToPath } from "url";
import dotenv  from "dotenv";

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

console.log(
  "PEM ok?",
  serviceAccount.private_key.startsWith("-----BEGIN PRIVATE KEY-----"),
  serviceAccount.private_key.endsWith("-----END PRIVATE KEY-----")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId:  serviceAccount.project_id,
});
const db = admin.firestore();

const app = express();
// Allow CORS for all origins
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
// rootDir === my-cv-website/
const rootDir = path.join(__dirname, "..");

// Serve all static files from the rootDir
app.use(express.static(rootDir));

// Define a route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

// ——— Translations API ———
app.get("/api/translations/:lang", async (req, res) => {
  try {
    const snap = await db.collection("translations").doc(req.params.lang).get();
    if (!snap.exists) return res.status(404).json({ error: "Not found" });
    res.json(snap.data());
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ——— Start Server ———
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Let's go on http://localhost:${PORT}`);
});