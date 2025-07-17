// db.js
// Koneksi ke MySQL untuk aplikasi N0Rules

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '#AdeEEE03#', // ganti jika ada password
  database: 'Norules_db',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Koneksi gagal:', err);
    return;
  }
  console.log('Koneksi ke MySQL berhasil!');
});

module.exports = connection;
