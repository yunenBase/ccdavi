const express = require("express");
const routes = require("./routes");
const { checkDatabaseConnection } = require("./dbService");
const path = require("path"); // Untuk mengatur folder views

const app = express();
const PORT = 3306;

app.use(express.static("public"));

// Set view engine sebagai EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Tentukan folder "views" untuk template

// Middleware untuk parsing data form
app.use(express.urlencoded({ extended: true }));

// Middleware untuk routing
app.use("/", routes);

// Jalankan server
app.listen(PORT, async () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  await checkDatabaseConnection(); // Cek koneksi database saat server start
});
