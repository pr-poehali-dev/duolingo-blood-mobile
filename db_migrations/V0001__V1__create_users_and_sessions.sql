CREATE TABLE IF NOT EXISTS t_p19054905_duolingo_blood_mobil.users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_emoji VARCHAR(10) DEFAULT '🧑‍🎓',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p19054905_duolingo_blood_mobil.sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p19054905_duolingo_blood_mobil.users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);
