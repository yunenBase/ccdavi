const sql = require("mssql");
const dbConfig = require("./dbConfig");

// Fungsi untuk mengecek koneksi database
async function checkDatabaseConnection() {
  try {
    console.log("🔄 Mencoba koneksi ke database...");
    const pool = await sql.connect(dbConfig);
    console.log("✅ Koneksi ke database berhasil!");
    pool.close();
  } catch (err) {
    console.error("❌ Gagal koneksi ke database:", err.message);
  }
}

// Fungsi untuk mengambil data artikel dari database
async function getArtikel() {
  try {
    console.log("🔄 Mengambil data dari database...");
    const pool = await sql.connect(dbConfig);
    console.log("✅ Koneksi berhasil. Menjalankan query...");
    const result = await pool.request().query("SELECT * FROM dbo.cards");
    console.log("✅ Data berhasil diambil:", result.recordset);
    pool.close();
    return result.recordset;
  } catch (err) {
    console.error("❌ Error mengambil data:", err.message);
    throw new Error("Error mengambil data dari database: " + err.message);
  }
}

module.exports = {
  checkDatabaseConnection,
  getArtikel,
};
