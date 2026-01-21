const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Aktuelle Hashes (Stand 21.01.2026)
let hashCache = {
  followersHash: "3316194bb52051e2f9184012f6171b9aed4d457994568f1b4ed4a11e37a18b5c",
  userByLogin: "4c39d2f4f4a5c8d9e2b3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
  moderationModerators: "800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08",
  channelVIPs: "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712",
  channelFounders: "b9ce64d02e26c6fe9adbfb3991284224498b295542f9c5a51eacd3610e659cfb",
  lastUpdate: new Date().toISOString()
};

const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

// Hashes zurückgeben
app.get('/api/hashes', (req, res) => {
  res.json(hashCache);
});

// User-ID holen
app.post('/api/userid', async (req, res) => {
  const { login } = req.body;
  if (!login) return res.status(400).json({ error: 'Kein Username angegeben' });

  try {
