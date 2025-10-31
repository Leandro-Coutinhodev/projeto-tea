import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',        // seu usuário MySQL
  password: 'root', // troque aqui
  database: 'projeto'
});

console.log('✅ Conectado ao MySQL!');
