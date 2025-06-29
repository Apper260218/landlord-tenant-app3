
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

let users = [{ username: "admin", password: "admin", role: "landlord" }];
let complaints = [];
let repairs = [];
let messages = [];

app.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "User already exists" });
  }
  users.push({ username, password, role });
  res.json({ message: "User registered successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ username: user.username, role: user.role });
});

app.get("/landlords", (req, res) => {
  const landlords = users.filter(u => u.role === "landlord").map(u => u.username);
  res.json(landlords);
});

app.post("/complaints", (req, res) => {
  const { username, text } = req.body;
  complaints.push({ username, text, status: "pending", timestamp: new Date().toISOString() });
  res.json({ message: "Complaint submitted" });
});

app.get("/complaints", (req, res) => {
  const { username, role } = req.query;
  const result = role === "landlord" ? complaints : complaints.filter(c => c.username === username);
  res.json(result);
});

app.post("/repairs", (req, res) => {
  const { username, text } = req.body;
  repairs.push({ username, text, status: "pending", timestamp: new Date().toISOString() });
  res.json({ message: "Repair request submitted" });
});

app.get("/repairs", (req, res) => {
  const { username, role } = req.query;
  const result = role === "landlord" ? repairs : repairs.filter(r => r.username === username);
  res.json(result);
});

app.post("/messages", (req, res) => {
  const { from, to, text } = req.body;
  messages.push({ from, to, text, timestamp: new Date().toISOString() });
  res.json({ message: "Message sent" });
});

app.get("/messages", (req, res) => {
  const { user } = req.query;
  const result = messages.filter(m => m.from === user || m.to === user);
  res.json(result);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
