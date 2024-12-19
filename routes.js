const express = require("express");
const sql = require("mssql");
const router = express.Router();
const path = require("path");
const app = express();
const { getArtikel } = require("./dbService");

// Import konfigurasi database
const dbConfig = require("./dbConfig");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Folder tempat menyimpan file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nama file unik
  },
});
// Konfigurasi upload gambar
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT c.id, c.title, c.description, c.image_url, c.created_at, cat.name AS category, c.author
      FROM dbo.cards c
      JOIN dbo.categories cat ON c.category_id = cat.id;
    `);
    res.render("index", { cards: result.recordset }); // Kirim data ke template EJS
  } catch (err) {
    console.error("❌ Error retrieving data from database:", err.message);
    res.status(500).send("Error retrieving data from database");
  }
});

router.get("/add-news", (req, res) => {
  res.render("add-news"); // Render file EJS untuk form tambah berita
});

router.post("/add-news", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, author } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`; // Path file yang di-upload

    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("title", sql.VarChar, title)
      .input("description", sql.Text, description)
      .input("category_id", sql.Int, category)
      .input("author", sql.VarChar, author)
      .input("image_url", sql.VarChar, imageUrl).query(`
        INSERT INTO dbo.cards (title, description, category_id, author, image_url, created_at)
        VALUES (@title, @description, @category_id, @author, @image_url, GETDATE())
      `);

    res.redirect("/"); // Redirect ke halaman utama setelah berita ditambahkan
  } catch (err) {
    console.error("❌ Error menambahkan berita:", err.message);
    res.status(500).send("Error menambahkan berita");
  }
});

router.post("/delete-news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.cards WHERE id = @id");

    res.redirect("/"); // Kembali ke halaman utama setelah menghapus berita
  } catch (err) {
    console.error("❌ Error menghapus berita:", err.message);
    res.status(500).send("Error menghapus berita");
  }
});

module.exports = router;
