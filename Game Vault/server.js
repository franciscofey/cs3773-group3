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

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/homePage/index.html');
});

const ORDERS_FILE = './cart/orders.json';
const MERCH_FILE = './merchandise/merchandise.json';
const DISCOUNT_FILE = './cart/discountCodes.json';
const USERS_FILE = './user.json';

const GAMES_FILE = './games/games.json';
const PHYSICAL_GAMES_FILE = './physical/physicalGames.json';
const GAME_PRICES_FILE = './games/gamePrices.json';
const GAME_QUANTITY_FILE = './games/gameQuantity.json';

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

app.get('/api/orders/:userId/:orderId', (req, res) => {
    const { userId, orderId } = req.params;

    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            return res.json({ order_id: orderId, items: [] });
        }

        const db = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
        const userOrders = db.users?.[userId]?.orders || [];
        const order = userOrders.find(o => o.order_id === orderId);

        if (!order) {
            return res.json({ order_id: orderId, items: [] });
        }

        res.json(order);
    } catch (err) {
        console.error("Error loading order:", err);
        res.status(500).json({ error: "Failed to load order" });
    }
});

// --- users ENDPOINTS ---
app.get('/users', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(USERS_FILE));
        res.json(data);
    } catch (err) { res.status(500).json({ error: "Read error" }); }
});

app.post('/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(USERS_FILE));
    data.push(req.body);
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Added" });
});

app.put('/users/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(USERS_FILE));
    data = data.map(item => {
        if (item.id == req.params.id) {
            return { ...item, ...req.body };
        }
        return item;
    });
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Updated" });
});

app.delete('/users/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(USERS_FILE));
    data = data.filter(item => item.id != req.params.id);
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Deleted" });
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
// 1. GET: All 4 data files
app.get('/games', (req, res) => {
    try {
        const digitalGames = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf8'));
        const physicalGames = JSON.parse(fs.readFileSync(PHYSICAL_GAMES_FILE, 'utf8'));
        const prices = JSON.parse(fs.readFileSync(GAME_PRICES_FILE, 'utf8'));
        const quantities = JSON.parse(fs.readFileSync(GAME_QUANTITY_FILE, 'utf8'));

        const physicalIds = new Set(physicalGames.map(g => g.id.toString()));
        const digitalIds = new Set(digitalGames.map(g => g.id.toString()));
        const allIds = Array.from(new Set([...digitalIds, ...physicalIds]));

        const formattedGames = allIds.map(id => {
            const gameData = digitalGames.find(g => g.id == id) || physicalGames.find(g => g.id == id);

            const isDigital = digitalIds.has(id.toString());
            const isPhysical = physicalIds.has(id.toString());

            let source = "";
            let isDigitalOnly = false;

            if (isDigital && isPhysical) {
                source = "Both";
            } else if (isDigital) {
                source = "Digital";
                isDigitalOnly = true;
            } else if (isPhysical) {
                source = "Physical";
            }
            let rawUrl = gameData?.cover?.url || "";
            if (rawUrl.startsWith('//')) {
                rawUrl = 'https:' + rawUrl;
            }

            return {
                id: id,
                name: gameData?.name || "Unknown",
                company: gameData?.involved_companies?.[0]?.company?.name || "Unknown",
                rating: gameData?.total_rating ? Number(gameData.total_rating.toFixed(1)) : "N/A",
                price: prices[id] || 0,
                stock: isDigitalOnly ? "--" : (quantities[id] || 0),
                source: source,
                isDigitalOnly: isDigitalOnly,
                summary: gameData?.summary || "",
                imageurl: rawUrl
            };
        });

        res.json(formattedGames);
    } catch (err) {
        console.error("Read Error:", err);
        res.status(500).json({ error: "Failed to load game data" });
    }
});

// 2. POST: Add new game
app.post('/games', (req, res) => {
    try {
        const { id, name, company, price, stock, rating, source, summary, imageurl } = req.body;
        const gId = id.toString();

        if (source === 'Digital' || source === 'Both') {
            const digital = JSON.parse(fs.readFileSync(GAMES_FILE));
            digital.push({
                id: Number(gId),
                name: name,
                summary: summary,
                cover: { url: imageurl },
                total_rating: Number(rating),
                involved_companies: [{ company: { name: company } }]
            });
            fs.writeFileSync(GAMES_FILE, JSON.stringify(digital, null, 2));
        }

        if (source === 'Physical' || source === 'Both') {
            const physical = JSON.parse(fs.readFileSync(PHYSICAL_GAMES_FILE));
            physical.push({ id: Number(gId), name: name });
            fs.writeFileSync(PHYSICAL_GAMES_FILE, JSON.stringify(physical, null, 2));
        }

        let prices = JSON.parse(fs.readFileSync(GAME_PRICES_FILE));
        let quantities = JSON.parse(fs.readFileSync(GAME_QUANTITY_FILE));
        prices[gId] = Number(price);
        quantities[gId] = (source === 'Digital') ? 0 : Number(stock);
        fs.writeFileSync(GAME_PRICES_FILE, JSON.stringify(prices, null, 2));
        fs.writeFileSync(GAME_QUANTITY_FILE, JSON.stringify(quantities, null, 2));

        res.json({ message: "Added Successfully" });
    } catch (err) { res.status(500).json({ error: "Post failed" }); }
});

// 3. PUT: Updates data files, prices, and quantity across all files
app.put('/games/:id', (req, res) => {
    try {
        const id = req.params.id;
        const { name, company, rating, price, stock, source, summary, imageurl } = req.body;

        let digitalGames = JSON.parse(fs.readFileSync(GAMES_FILE, 'utf8'));
        let physicalGames = JSON.parse(fs.readFileSync(PHYSICAL_GAMES_FILE, 'utf8'));

        const dIdx = digitalGames.findIndex(g => g.id == id);
        const pIdx = physicalGames.findIndex(g => g.id == id);

        // 1. Build the FULL complex object once
        const fullEntry = {
            id: Number(id),
            name: name,
            summary: summary || "",
            cover: { url: imageurl || "" },
            total_rating: Number(rating) || 0,
            involved_companies: [
                { company: { name: company || "Unknown" } }
            ]
        };

        // 2. DIGITAL FILE (games.json)
        if (source === 'Digital' || source === 'Both') {
            if (dIdx !== -1) digitalGames[dIdx] = fullEntry;
            else digitalGames.push(fullEntry);
        } else if (dIdx !== -1) {
            digitalGames.splice(dIdx, 1); // Remove if moving to Physical-only
        }

        // 3. PHYSICAL FILE (physicalGames.json)
        if (source === 'Physical' || source === 'Both') {
            if (pIdx !== -1) physicalGames[pIdx] = fullEntry;
            else physicalGames.push(fullEntry);
        } else if (pIdx !== -1) {
            physicalGames.splice(pIdx, 1); // Remove if moving to Digital-only
        }

        // Write files
        fs.writeFileSync(GAMES_FILE, JSON.stringify(digitalGames, null, 2));
        fs.writeFileSync(PHYSICAL_GAMES_FILE, JSON.stringify(physicalGames, null, 2));

        // 4. Update Prices & Quantities
        let prices = JSON.parse(fs.readFileSync(GAME_PRICES_FILE, 'utf8'));
        let quantities = JSON.parse(fs.readFileSync(GAME_QUANTITY_FILE, 'utf8'));

        prices[id] = Number(price);
        quantities[id] = (source === 'Digital') ? 0 : (Number(stock) || 0);

        fs.writeFileSync(GAME_PRICES_FILE, JSON.stringify(prices, null, 2));
        fs.writeFileSync(GAME_QUANTITY_FILE, JSON.stringify(quantities, null, 2));

        res.json({ message: "Updated and Migrated with full metadata" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Migration failed" });
    }
});

// 4. DELETE: Removes data from all files
app.delete('/games/:id', (req, res) => {
    try {
        const id = req.params.id;

        // Filter out from game files
        const dData = JSON.parse(fs.readFileSync(GAMES_FILE)).filter(g => g.id != id);
        const pData = JSON.parse(fs.readFileSync(PHYSICAL_GAMES_FILE)).filter(g => g.id != id);

        fs.writeFileSync(GAMES_FILE, JSON.stringify(dData, null, 2));
        fs.writeFileSync(PHYSICAL_GAMES_FILE, JSON.stringify(pData, null, 2));

        // Cleanup price and quantity keys
        let prices = JSON.parse(fs.readFileSync(GAME_PRICES_FILE));
        let quantities = JSON.parse(fs.readFileSync(GAME_QUANTITY_FILE));
        delete prices[id];
        delete quantities[id];

        fs.writeFileSync(GAME_PRICES_FILE, JSON.stringify(prices, null, 2));
        fs.writeFileSync(GAME_QUANTITY_FILE, JSON.stringify(quantities, null, 2));

        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));