const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// CORS configuration (DO NOT CHANGE)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const ORDERS_FILE = './cart/orders.json';
const MERCH_FILE = './merchandise/merchandise.json';
const DISCOUNT_FILE = './cart/discountCodes.json';

const GAMES_FILE = './games/games.json';
const GAME_PRICES_FILE = './games/gamePrices.json';

// --- ORDERS ENDPOINT ---
app.post('/api/save-order', (req, res) => {
    const { userId, gameData, orderId } = req.body;
    let db = { users: {} };

    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const fileData = fs.readFileSync(ORDERS_FILE, 'utf8');
            db = JSON.parse(fileData);
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }

    if (!db.users[userId]) {
        db.users[userId] = { orders: [] };
    }

    let targetOrder = null;
    if (orderId) {
        targetOrder = db.users[userId].orders.find(o => o.order_id === orderId);
    }

    if (targetOrder) {
        targetOrder.items.push(gameData);
    } else {
        const newOrderId = `ORD-${Date.now()}`;
        targetOrder = {
            order_id: newOrderId,
            items: [gameData],
            timestamp: new Date().toISOString()
        };
        db.users[userId].orders.push(targetOrder);
    }

    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(db, null, 2));
        res.status(200).json({ message: "Success!", orderId: targetOrder.order_id });
    } catch (err) {
        console.error("Write error:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// --- MERCHANDISE ENDPOINTS ---
app.get('/merchandise', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(MERCH_FILE));
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Read error" }); }
});

app.post('/merchandise', (req, res) => {
    const data = JSON.parse(fs.readFileSync(MERCH_FILE));
    data.push(req.body);
    fs.writeFileSync(MERCH_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Added" });
});

app.put('/merchandise/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(MERCH_FILE));
    data = data.map(item => {
        if (item.id == req.params.id) {
            return { ...item, ...req.body };
        }
        return item;
    });
    fs.writeFileSync(MERCH_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Updated" });
});

app.delete('/merchandise/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(MERCH_FILE));
    data = data.filter(item => item.id != req.params.id);
    fs.writeFileSync(MERCH_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Deleted" });
});


// --- discountCodes ENDPOINTS ---
app.get('/discountCodes', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DISCOUNT_FILE));
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Read error" }); }
});

app.post('/discountCodes', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DISCOUNT_FILE));
    data.push(req.body);
    fs.writeFileSync(DISCOUNT_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Added" });
});

app.put('/discountCodes/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(DISCOUNT_FILE));
    data = data.map(item => {
        if (item.id == req.params.id) {
            return { ...item, ...req.body };
        }
        return item;
    });
    fs.writeFileSync(DISCOUNT_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Updated" });
});

app.delete('/discountCodes/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(DISCOUNT_FILE));
    data = data.filter(item => item.id != req.params.id);
    fs.writeFileSync(DISCOUNT_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Deleted" });
});



// --- GAME ENDPOINTS ---
/*
app.get('/games', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(GAMES_FILE));
    res.json(data);
  } catch (err) { res.status(500).json({ error: "Read error" }); }
});*/

// --- GAME ENDPOINTS ---
app.get('/games', (req, res) => {

    try {

        const games = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf8'));

        const prices = JSON.parse(
            fs.readFileSync(GAME_PRICES_FILE, 'utf8')
        );

        const formattedGames = games.map(game => ({

            id: game.id,

            name: game.name,

            company:
                game.involved_companies?.[0]?.company?.name || "Unknown",

            rating:
                game.total_rating
                    ? Number(game.total_rating.toFixed(1))
                    : "N/A",

            imageurl:
                game.cover
                    ? `https:${game.cover.url}`
                    : "",

            price:
                prices[game.id] || 0

        }));

        res.json(formattedGames);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Read error"
        });

    }

});

app.post('/games', (req, res) => {
  const data = JSON.parse(fs.readFileSync(GAMES_FILE));
  data.push(req.body);
  fs.writeFileSync(GAMES_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Added" });
});

app.put('/games/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(GAMES_FILE));
  data = data.map(item => {
    if (item.id == req.params.id) {
      return { ...item, ...req.body };
    }
    return item;
  });
  fs.writeFileSync(GAMES_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Updated" });
});

app.delete('/games/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(GAMES_FILE));
  data = data.filter(item => item.id != req.params.id);
  fs.writeFileSync(GAMES_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));