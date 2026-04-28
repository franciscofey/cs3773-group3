const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(require('cors')());

const FILE = './merchandise.json';


// GET all merch
app.get('/merchandise', (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE));
    res.json(data);
});

// ADD merch
app.post('/merchandise', (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE));
    data.push(req.body);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Added" });
});

// UPDATE merch
/*
app.put('/merchandise/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(FILE));
    data = data.map(item =>
        item.id == req.params.id ? req.body : item
    );
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Updated" });
});*/
app.put('/merchandise/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(FILE));

    data = data.map(item => {
        if (item.id == req.params.id) {
            return {
                ...item,   // keep existing fields
                //...convertFields(req.body) // overwrite edited ones
                ...req.body
            };
        }
        return item;
    });

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Updated" });
});

// DELETE merch
app.delete('/merchandise/:id', (req, res) => {
    let data = JSON.parse(fs.readFileSync(FILE));
    data = data.filter(item => item.id != req.params.id);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    res.json({ message: "Deleted" });
});

app.listen(3000, () => console.log("Server running on port 3000"));