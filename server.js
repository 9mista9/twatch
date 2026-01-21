// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Cache für Hashes (wird alle 24h aktualisiert oder bei Bedarf)
let hashCache = {
  userByLogin: "4c39d2f4f4a5c8d9e2b3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
  moderationModerators: "800e7346bdf7e5278a3c1d3f21b2b56e2639928f86815677a7126b093b2fdd08",
  channelVIPs: "0828119ded1c13477966434e15800ff57ddacf13ba1911c129dc2200705b0712",
  channelFounders: "b9ce64d02e26c6fe9adbfb3991284224498b295542f9c5a51eacd3610e659cfb",
  lastUpdate: new Date()
};

const CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';

// Endpoint: /api/hashes – gibt immer die aktuellen Hashes zurück
app.get('/api/hashes', (req, res) => {
  res.json(hashCache);
});

// Endpoint: /api/userid – holt User-ID (kann man später erweitern)
app.post('/api/userid', async (req, res) => {
  const { login } = req.body;
  if (!login) return res.status(400).json({ error: 'Kein Username angegeben' });

  try {
    const query = {
      operationName: "UserByLogin",
      variables: { login },
      extensions: {
        persistedQuery: {
          version: 1,
          sha256Hash: hashCache.userByLogin
        }
      }
    };

    const response = await fetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Client-Id': CLIENT_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([query])
    });

    const json = await response.json();
    const userId = json[0]?.data?.user?.id;

    if (!userId) {
      return res.status(404).json({ error: 'User nicht gefunden' });
    }

    res.json({ userId });
  } catch (err) {
    res.status(500).json({ error: 'Fehler bei der Abfrage' });
  }
});

// Starte Server
app.listen(port, () => {
  console.log(`Backend läuft auf Port ${port}`);
});
