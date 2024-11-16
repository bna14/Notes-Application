const express = require("express");
const sqlite3 = require("sqlite3").verbose();
// const path = require("path");

const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Could not connect to the database:", err);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// // Middleware to parse JSON bodies
app.use(express.json());

// Create the User table if it doesn't exist (for demonstration)
db.run(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT
    )
    `);
// Create the Note table if it doesn't exist
db.run(`
      CREATE TABLE IF NOT EXISTS Note (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT NOT NULL,
        body TEXT,
        last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES User(id)
        )
        `);

var bodyParser = require("body-parser");

// configure the app to use bodyParser()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// Endpoint to create a new note

// // Endpoint to retrieve all notes
// app.get("/api/notes", (req, res) => {
//   db.all("SELECT * FROM Note", (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(rows);
//   });
// });

// // Endpoint to update a note
app.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  db.run(
    "UPDATE Note SET title = ?, body = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?",
    [title, body, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id, title, body });
    }
  );
});

// // Endpoint to delete a note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM Note WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: `Note ${id} deleted successfully` });
  });
});

// // Start the server
app.post("/api/notes", (req, res) => {
  // const userId = localStorage.getItem("user_id");
  const { user_id, title, body } = req.body;
  db.run(
    "INSERT INTO Note (user_id, title, body) VALUES (?, ?, ?)",
    [user_id, title, body],
    function (err) {
      if (err) {
        console.log("Error");
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, user_id, title, body });
    }
  );
});

// app.get("/api/notes", (req, res) => {
//   const userId = req.query.user_id;
//   db.all("SELECT * FROM Note WHERE user_id = ?", [userId], (err, rows) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(rows);
//   });
// });

app.get("/api/notes", (req, res) => {
  const userId = req.query.user_id;
  console.log(userId);
  db.all("SELECT * FROM Note WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post("/api/users", (req, res) => {
  const { username, password, email } = req.body;

  // Check if the username or email already exists
  db.get(
    "SELECT id FROM User WHERE username = ? OR email = ?",
    [username, email],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        // Username or email already exists
        return res
          .status(409)
          .json({ message: "Username or email already exists" });
      }

      // Insert new user if username and email are unique
      db.run(
        "INSERT INTO User (username, password, email) VALUES (?, ?, ?)",
        [username, password, email],
        function (err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ id: this.lastID, username, email });
        }
      );
    }
  );
});

// Endpoint to log in a user
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT id FROM User WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        // Login successful, return the user_id
        // localStorage.setItem("user_id", row.id);
        // console.log(row.id);
        // const test = localStorage.getItem("user_id");
        // console.log(test);
        res.status(200).json({ message: "Login successful", userId: row.id });
      } else {
        console.log("FAilerrrrrrrrrrrrrrrrrrrrrrrrrrr");
        // Invalid login
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
});

// Endpoint to delete a user
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM User WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: `User ${id} not found` });
    }
    res.status(200).json({ message: `User ${id} deleted successfully` });
  });
});
// Endpoint to delete the User table
app.delete("/api/notes/table", (req, res) => {
  db.serialize(() => {
    db.run("DROP TABLE Note", (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: "Notes table deleted successfully" });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
