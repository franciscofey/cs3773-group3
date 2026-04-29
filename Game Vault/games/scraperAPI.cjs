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

//Gets and saves the game data to the games.json
async function saveGameData() {
    console.log("Fetching token...");
    const token = await getTwitchToken();

    console.log("Fetching games from IGDB...");
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                // Mimic a real browser more closely
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Origin': 'https://api.igdb.com'
            },
            body: "fields name, cover.url, total_rating, involved_companies.company.name, summary; " +
                "where name != null & " +
                "cover.url != null & " +
                "involved_companies.company.name != null & " +
                "total_rating != null; " +
                "limit 500;"
        });

        //Checks the type of info being passed
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Expected JSON but got HTML. You might be blocked by Cloudflare.");
            console.log("Response snippet:", text.substring(0, 200));
            return;
        }

        //Writes data file
        const games = await response.json();
        fs.writeFileSync('games.json', JSON.stringify(games, null, 2));
        console.log(`Success! Saved ${games.length} games to games.json`);

    } catch (error) {
        console.error("Critical Error:", error);
    }
}

saveGameData();
