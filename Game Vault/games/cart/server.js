// This is used to communicate with the website for data retrival (API)
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// CORS configuration DO NOT CHANGE
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

const FILE_PATH = './orders.json';

app.post('/api/save-order', (req, res) => {
    const { userId, gameData, orderId } = req.body;

    // 1. Read existing file or create the basic structure
    let db = { users: {} };
    try {
        if (fs.existsSync(FILE_PATH)) {
            const fileData = fs.readFileSync(FILE_PATH, 'utf8');
            db = JSON.parse(fileData);
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }

    // Checks if user exists
    if (!db.users[userId]) {
        db.users[userId] = { orders: [] };
    }

    let targetOrder = null;

    // 2. Finds/creates the order
    if (orderId) {
        // Look for the order by id
        targetOrder = db.users[userId].orders.find(o => o.order_id === orderId);
    }

    if (targetOrder) {
        // if the order exists add the game to list
        targetOrder.items.push(gameData);
    } else {
        // if not create new order
        const newOrderId = `ORD-${Date.now()}`;
        targetOrder = {
            order_id: newOrderId,
            items: [gameData],
            timestamp: new Date().toISOString()
        };
        db.users[userId].orders.push(targetOrder);
    }

    // 3. Saves the updated database and returns the Order ID
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(db, null, 2));

        res.status(200).json({
            message: "Success!",
            orderId: targetOrder.order_id
        });
    } catch (err) {
        console.error("Write error:", err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));