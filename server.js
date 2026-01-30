const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./gameportfolio.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initDatabase();
  }
});

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Games table
    db.run(`CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT,
      completion INTEGER DEFAULT 0,
      play_time INTEGER DEFAULT 0,
      technologies TEXT,
      image_url TEXT,
      github_url TEXT,
      demo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create default user (username: admin, password: admin123)
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, 
      ['admin', defaultPassword]);

    // Add sample games
    const sampleGames = [
      {
        title: 'RPG Adventure',
        description: 'Um jogo de RPG com sistema de combate turn-based e exploração de mundo aberto',
        status: 'Em Desenvolvimento',
        completion: 65,
        play_time: 120,
        technologies: 'Unity, C#, Blender',
        image_url: 'https://via.placeholder.com/400x300/4a5568/ffffff?text=RPG+Adventure',
        github_url: 'https://github.com/user/rpg-adventure',
        demo_url: ''
      },
      {
        title: 'Puzzle Mania',
        description: 'Jogo de quebra-cabeças com mecânicas inovadoras e mais de 100 níveis',
        status: 'Concluído',
        completion: 100,
        play_time: 80,
        technologies: 'JavaScript, HTML5, Canvas',
        image_url: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Puzzle+Mania',
        github_url: 'https://github.com/user/puzzle-mania',
        demo_url: 'https://demo.puzzle-mania.com'
      },
      {
        title: 'Space Shooter',
        description: 'Shoot em up espacial com power-ups e chefes épicos',
        status: 'Em Desenvolvimento',
        completion: 40,
        play_time: 45,
        technologies: 'Godot, GDScript',
        image_url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Space+Shooter',
        github_url: 'https://github.com/user/space-shooter',
        demo_url: ''
      },
      {
        title: 'Tower Defense Pro',
        description: 'Estratégia de defesa de torre com múltiplos mapas e torres customizáveis',
        status: 'Pausado',
        completion: 30,
        play_time: 60,
        technologies: 'React, Three.js',
        image_url: 'https://via.placeholder.com/400x300/ef4444/ffffff?text=Tower+Defense',
        github_url: 'https://github.com/user/tower-defense',
        demo_url: ''
      },
      {
        title: 'Card Battle Arena',
        description: 'Jogo de cartas estratégico com multiplayer online',
        status: 'Planejamento',
        completion: 15,
        play_time: 20,
        technologies: 'Node.js, Socket.io, Vue.js',
        image_url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Card+Battle',
        github_url: 'https://github.com/user/card-battle',
        demo_url: ''
      },
      {
        title: 'Platformer Master',
        description: 'Plataforma 2D com física avançada e level design criativo',
        status: 'Concluído',
        completion: 100,
        play_time: 150,
        technologies: 'Phaser, TypeScript',
        image_url: 'https://via.placeholder.com/400x300/06b6d4/ffffff?text=Platformer',
        github_url: 'https://github.com/user/platformer',
        demo_url: 'https://platformer.demo.com'
      }
    ];

    const insertStmt = db.prepare(`INSERT OR IGNORE INTO games 
      (title, description, status, completion, play_time, technologies, image_url, github_url, demo_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    sampleGames.forEach(game => {
      insertStmt.run(
        game.title, game.description, game.status, game.completion, 
        game.play_time, game.technologies, game.image_url, game.github_url, game.demo_url
      );
    });
    
    insertStmt.finalize();
  });
}

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: user.username });
  });
});

// Get all games
app.get('/api/games', authenticateToken, (req, res) => {
  db.all('SELECT * FROM games ORDER BY created_at DESC', [], (err, games) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(games);
  });
});

// Get single game
app.get('/api/games/:id', authenticateToken, (req, res) => {
  db.get('SELECT * FROM games WHERE id = ?', [req.params.id], (err, game) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  });
});

// Create new game
app.post('/api/games', authenticateToken, (req, res) => {
  const { title, description, status, completion, play_time, technologies, image_url, github_url, demo_url } = req.body;

  db.run(
    `INSERT INTO games (title, description, status, completion, play_time, technologies, image_url, github_url, demo_url) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, status, completion, play_time, technologies, image_url, github_url, demo_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Game created successfully' });
    }
  );
});

// Update game
app.put('/api/games/:id', authenticateToken, (req, res) => {
  const { title, description, status, completion, play_time, technologies, image_url, github_url, demo_url } = req.body;

  db.run(
    `UPDATE games SET title = ?, description = ?, status = ?, completion = ?, play_time = ?, 
     technologies = ?, image_url = ?, github_url = ?, demo_url = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [title, description, status, completion, play_time, technologies, image_url, github_url, demo_url, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Game not found' });
      }
      res.json({ message: 'Game updated successfully' });
    }
  );
});

// Delete game
app.delete('/api/games/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM games WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Default login - Username: admin, Password: admin123');
});

// ROTA ADMINISTRATIVA (USE COM CUIDADO)
app.post('/admin/add-game', authenticateToken, (req, res) => {
  const {
    title,
    description,
    status,
    completion,
    play_time,
    technologies,
    image_url,
    github_url,
    demo_url
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO games
    (title, description, status, completion, play_time, technologies, image_url, github_url, demo_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    title,
    description,
    status,
    completion,
    play_time,
    technologies,
    image_url,
    github_url,
    demo_url,
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});
