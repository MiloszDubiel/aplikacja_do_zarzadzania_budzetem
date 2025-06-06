const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "financeapp",
});
const port = 3001;
connection.connect();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

//Dostep do body requesta, pasuje na json
app.use(express.json());

const salt = new Uint8Array(16);
crypto.getRandomValues(salt);

const secretKey = "tajny_klucz_jwt";

//Endpointy
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) res.json({ info: err });
    else if ([...result].length > 0)
      res.json({ info: "Konto istnieje na podany email" });
    else {
      let sql = "INSERT INTO users(email, password) VALUES (?,?)";
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      connection.query(sql, [email, hash], (err, result) => {
        if (err) res.json({ info: err });
        else res.json({ info: "Pomyślnie zarejstrowano" });
      });
    }
  });
});

app.post("/set-amount", (req, res) => {
  const { amount, email } = req.body;
  let sql = "UPDATE users SET balance = balance + ? WHERE  email = ?";
  connection.query(sql, [amount, email], (err, result) => {
    if (err) res.json({ info: err });
    else {
      res.json({ info: "Dodano kwote" });
    }
  });
});

app.post("/dashboard-data", (req, res) => {
  const { email } = req.body;
  let sql = "SELECT * FROM users WHERE email = ?";
  connection.query(sql, [email], (err, result) => {
    if (err) res.json({ info: err });
    else {
      res.json({ data: result });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password, rememberMe } = req.body;
  let sql =
    "SELECT users.id, users.email, users.password, transactions.user_id FROM users LEFT JOIN transactions ON users.id = transactions.user_id WHERE email = ?";

  connection.query(sql, [email], (err, result) => {
    if ([...result].length == 0) {
      res.json({ info: "Konto nie istnieje" });
      return;
    }
    let hash = result[0].password;
    bcrypt.compare(password, hash).then((resp) => {
      if (resp) {
        const user = result[0];

        const token = jwt.sign(
          { id: user.id, email: user.email, transactionID: user.user_id },
          secretKey,
          {
            expiresIn: rememberMe ? "30d" : "2h",
          }
        );
        res.json({ info: "Zalogowano", data: result, token });
      } else res.json({ info: "Niepoprawne hasło" });
    });
  });
});

app.get("/user-profile", authenticateToken, (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT email, balance, id FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err || results.length === 0)
        return res.status(404).json({ message: "Nie znaleziono użytkownika" });

      res.json(results[0]);
    }
  );
});

app.post("/history", (req, res) => {
  const { userID } = req.body;
  let sql =
    "SELECT transactions.*, categories.name FROM transactions INNER JOIN categories ON transactions.category_id = categories.id WHERE transactions.user_id = ? ";
  connection.query(sql, [userID], (err, result) => {
    if ([...result].length == 0) {
      res.json({ info: ["Brak transakcji"] });
      return;
    }
    res.json(result);
  });
});

app.post("/delete-record", (req, res) => {
  const { userID, transactionID } = req.body;
  let sql = "DELETE FROM transactions WHERE id = ? AND user_id = ? ";
  connection.query(sql, [transactionID, userID], (err, result) => {
    res.json(result);
  });
});

app.post("/insert-record", (req, res) => {
  const { userID, category, date, type, description, cost } = req.body;
  let sql =
    "INSERT INTO `transactions` (`user_id`, `category_id`, `amount`, `transaction_date`, `description`, `type` ) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [userID, category, cost, date, description, type],
    (err, result) => {
      res.json(result);
    }
  );
});

//Nadłsuchiwanie portu 3001
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
