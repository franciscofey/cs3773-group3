//File to get and save game info from API (Let me know if you have questions -Lauren)
const fs = require('fs');

//DO NOT SHARE THESE THEY ARE MY CREDENTIALS SO NO AI PLEASE
//(I don't care if you use AI just please do not copy these two lines)
const CLIENT_ID = 'vzurxaty99ttpx6sm1shmpvpekd4rg';
const CLIENT_SECRET = 'slzzsq0wi584x5vvupako17obbr5e7';

//Gets the secret password to communicate with API
async function getTwitchToken() {
    const url = `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`;
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    return data.access_token;
}

/*async function getTargetPlatformIds(token) {
    const response = await fetch("https://api.igdb.com/v4/platforms", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': CLIENT_ID,
            'Authorization': `Bearer ${token}`,
            // Required to prevent Cloudflare from blocking Node.js
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
        },
        body: "fields id; where category = (1,2,3,5,6); limit 500;"
    });
    const platforms = await response.json();
    return platforms.map(p => p.id);
}

//Gets and saves the game data to the games.json
async function saveGameData() {
    console.log("Fetching token...");
    const token = await getTwitchToken();

    console.log("Fetching platform list...");
    const platformIds = await getTargetPlatformIds(token);

    // CRITICAL: Prevent Syntax Error if platform fetch was blocked
    if (!platformIds || platformIds.length === 0) {
        console.error("Error: Platform IDs list is empty. You are likely still blocked by Cloudflare.");
        return;
    }

    console.log(`Fetching games for ${platformIds.length} platforms...`);
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            },
            body: `fields name, cover.url, total_rating, involved_companies.company.name, summary, platforms.name; ` +
                `where name != null & cover.url != null & platforms = (${platformIds.join(',')}); ` +
                `sort popularity desc; limit 500;`
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error("Blocked by Cloudflare again. Try using a VPN or different User-Agent.");
            return;
        }

        const games = await response.json();
        fs.writeFileSync('physicalGames.json', JSON.stringify(games, null, 2));
        console.log(`Success! Saved ${games.length} games.`);
    } catch (error) {
        console.error("Critical Error:", error);
    }
}*/
const igdb = require('igdb-api-node').default;

async function saveGameData(offset = 0) {
    console.log("Fetching token...");
    const token = await getTwitchToken();
    const client = igdb(CLIENT_ID, token);

    try {
        console.log(`Fetching games (Offset: ${offset})...`);

        // Target specific console IDs:
        // 130=Switch, 167=PS5, 169=Xbox Series, 48=PS4, 49=Xbox One, 6=PC
        const gameResponse = await client
            .fields([
                'name',
                'cover.url',
                'total_rating',
                'involved_companies.company.name',
                'summary',
                'platforms.name'
            ])
            .where(`name != null & cover.url != null & platforms = (130, 167, 169, 48, 49, 6)`)
            .sort('popularity', 'desc')
            .limit(500)
            .offset(offset)
            .request('/games');

        const games = gameResponse.data;

        if (games.length === 0) {
            console.log("No more games found matching these criteria.");
            return;
        }

        fs.writeFileSync('physicalGames.json', JSON.stringify(games, null, 2));
        console.log(`Success! Saved ${games.length} games to physicalGames.json`);

    } catch (err) {
        // Detailed error for debugging
        if (err.response) {
            console.error("API Error:", err.response.data);
        } else {
            console.error("Critical Error:", err.message);
        }
    }
}

// Set this to 0 for the first 500, then 500 for the next batch, etc.
saveGameData(0);