import express from "express";
import dotenv from "dotenv";
import Replicate from "replicate";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Konfigurasi dasar
dotenv.config();
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Akses ke folder public
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// Inisialisasi Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Endpoint untuk menerima prompt
app.post("/check", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt tidak boleh kosong." });
  }

  try {
    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct",
      {
        input: {
          prompt: prompt,
        },
      }
    );

    const result = Array.isArray(output) ? output.join("") : output;
    res.json({ result });
  } catch (err) {
    console.error("Replicate error:", err);
    res.status(500).json({ error: "Gagal menghasilkan prediksi." });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
