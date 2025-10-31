import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';

const router = express.Router();

/**
 * 📦 Cadastro de novo usuário (criança + responsável)
 */
router.post('/register', async (req, res) => {
  const {
    nome_crianca,
    idade,
    data_nascimento,
    genero,
    municipio,
    estado,
    email_responsavel,
    senha
  } = req.body;

  try {
    // Verifica se já existe um responsável com esse e-mail
    const [existing] = await db.execute(
      'SELECT * FROM usuarios WHERE email_responsavel = ?',
      [email_responsavel]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado!' });
    }

    // Criptografa a senha
    const hashed = await bcrypt.hash(senha, 10);

    // Insere no banco
    await db.execute(
      `INSERT INTO usuarios
      (nome_crianca, idade, data_nascimento, genero, municipio, estado, email_responsavel, senha)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome_crianca, idade, data_nascimento, genero, municipio, estado, email_responsavel, hashed]
    );

    res.json({
      message: 'Cadastro realizado com sucesso!',
      usuario: {
        nome_crianca: nome_crianca,
        idade: idade,
        municipio: municipio,
        estado: estado,
        pontuacao: 0
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

/**
 * 🔐 Login do responsável
 */
router.post('/login', async (req, res) => {
  const { email_responsavel, senha } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email_responsavel = ?',
      [email_responsavel]
    );

    if (rows.length === 0)
      return res.status(400).json({ error: 'Usuário não encontrado.' });

    const user = rows[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta)
      return res.status(401).json({ error: 'Senha incorreta.' });

    res.json({
      message: 'Login bem-sucedido!',
      usuario: {
        id: user.id,
        nome_crianca: user.nome_crianca,
        idade: user.idade,
        municipio: user.municipio,
        estado: user.estado,
        pontuacao: user.pontuacao
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor ao efetuar login.' });
  }
});

export default router;
