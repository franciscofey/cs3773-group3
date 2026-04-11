import { writeFileSync } from 'fs';
import { readFileSync } from 'fs';
const clientID = 'vzurxaty99ttpx6sm1shmpvpekd4rg';
const clientSecret = 'slzzsq0wi584x5vvupako17obbr5e7';
const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;
const accessToken = await getTwitchToken();

loadGameData();
getGameData();

// 1. Category Translation
const categoryMap = {
    0: "Main Game",
    1: "DLC / Add-on",
    2: "Expansion",
    3: "Bundle",
    4: "Standalone Expansion",
    5: "Mod",
    6: "Episode",
    7: "Season",
    8: "Remake",
    9: "Remaster",
    10: "Expanded Game",
    11: "Port",
    12: "Fork",
    13: "Pack",
    14: "Update"
};

// 2. Status Translation
const statusMap = {
    0: "Released",
    2: "Alpha",
    3: "Beta",
    4: "Early Access",
    5: "Offline",
    6: "Cancelled"
};

//Twitch token to access website
async function getTwitchToken() {
    try {
        const response = await fetch(url, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Access Token:', data.access_token);
        console.log('Expires In:', data.expires_in);
        global.accessToken = data;
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

//Gets Data from API
async function loadGameData() {
    console.log("1. Starting fetch...");
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': 'MyGameProject/1.0'
            },
            body: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover.url,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,game_status,game_type,genres,hypes,involved_companies.company.name,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites; limit 500;"
                //"fields name, genres.name, platforms.name, themes.name, involved_companies.company.name, game_modes.name, player_perspectives.name, release_dates.human, category, status, summary, total_rating, artworks; limit 500;"
        });

        console.log("2. Response received. Status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error details:", errorText);
            return;
        }

        const data = await response.json();
        console.log("3. Data parsed. Number of games:", data.length);

        if (data.length === 0) {
            console.warn("Warning: IGDB returned 0 games. Check your query!");
        }

        const jsonData = JSON.stringify(data, null, 2);

        // Use quotes around the filename
        writeFileSync('games.json', jsonData);

        console.log("4. SUCCESS! Look for games.json in:", process.cwd());

    } catch (error) {
        console.error('5. CRITICAL ERROR:', error.message);
    }
}

async function getGameData() {
    try {
        const rawData = readFileSync('games.json', 'utf8');

        return JSON.parse(rawData);

    } catch (error) {
        console.error('Error reading or parsing JSON:', error.message);
        return[];
    }
}












async function renameGame(oldName, newName) {
    try {
        // 1. Get current data
        const games = await getGames();

        const gameToChange = games.find(g => g.name === oldName);
        if (gameToChange) {
            gameToChange.name = newName;
        }

        writeFileSync('games.json', JSON.stringify(games, null, 2));
        console.log("Success! File updated.");

    } catch (err) {
        console.error("Error updating the name:", err.message);
    }
}





//Tests
async function testMaps() {
    const games = await getGameData();

    if (games && games.length > 0) {
        const myGame = games[0];
        const genres = myGame.genres?.map(g => g.name).join(', ') || "N/A";

        console.log(`Game: ${myGame.name}`);
        console.log(`Genres: ${genres}`);
        console.log(`Type: ${categoryMap[myGame.category] || "Unknown"}`);

    } else {
        console.log("No games found in the JSON.");
    }
}







//const games = await getGames();
//const client = igdb.default('vzurxaty99ttpx6sm1shmpvpekd4rg', accessToken);
/* async function updateGame(gameIndex, newData) {
    try {
        // 1. Read and parse the current data
        const rawData = readFileSync('games.json', 'utf8');
        const games = JSON.parse(rawData);

        // 2. Modify the data (e.g., update the name of a specific game)
        if (games[gameIndex]) {
            games[gameIndex] = { ...games[gameIndex], ...newData };
        }

        // 3. Write the updated array back to the file
        // Use JSON.stringify(data, null, 2) to keep the file readable (pretty-print)
        const updatedJSON = JSON.stringify(games, null, 2);
        writeFileSync('games.json', updatedJSON, 'utf8');

        console.log('File updated successfully!');
        return games;
    } catch (error) {
        console.error('Error modifying file:', error.message);
    }
}
/*
function renameGame(oldName, newName) {
    try {
        // 1. Read the current data
        const rawData = readFileSync('games.json', 'utf8');
        const games = JSON.parse(rawData);

        const gameToChange = games.find(g => g.name === oldName);
        if (gameToChange) {
            gameToChange.name = newName;
        }

        // 2. Change the name at the specific index
        /*if (games[index]) {
            const oldName = games[index].name;
            games[index].name = newName; // Update the property
            console.log(`Renaming "${oldName}" to "${newName}"...`);
        } else {
            console.log("Game index not found.");
            return;
        } */

// 3. Save the changes back to the file
// The 'null, 2' keeps the JSON file formatted nicely
/*
writeFileSync('games.json', JSON.stringify(games, null, 2));
console.log("Success! File updated.");

} catch (err) {
    console.error("Error updating the name:", err.message);
}
}
async function getGames() {
    const response = await axios({
        url: "https://api.igdb.com/v4/games",
        method: 'POST',
        headers: {
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        },
        // This is your query string
        data: "fields name, summary, platforms, genres; limit 10;"
    });

    // 'games' will now be an array of objects
    const games = response.data;

    console.log(games[0].name); // Accessing the first object's name
}



    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // Both maximum and minimum are inclusive
    }

*/

/*
async function getGamesCoverArt() {
    fetch('https://api.igdb.com/v4/covers', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': clientID,
            // 1. Ensure "Bearer " prefix is added
            'Authorization': `Bearer ${accessToken}`,
        },
        body: "fields alpha_channel,animated,checksum,game,height,image_id,url,width; limit 10;"
    })
        .then(async (response) => {
            // 2. Await the json data before logging
            const data = await response.json();
            console.log('Cover Art Data:', data);
        })
        .catch(err => {
            console.error('Fetch Error:', err);
        });
}

async function getIGDBData() {
    try {
        const response = await fetch(
            "https://api.igdb.com/v4/age_rating_content_descriptions",
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Client-ID': clientID,
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: "fields category,checksum,description;"
            })
        const data = await response.json(); // Wait for the JSON to parse
        console.log(data); // Now it's the data, not a promise
    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

async function getGames() {
    try {
        const response = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`, // Must include "Bearer " prefix
                'Content-Type': 'text/plain'
            },
            // Define your query directly in the body string
            body: 'fields name; limit 100;'
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Status ${response.status}: ${errorData}`);
        }

        const games = await response.json();

        console.log('Game Titles:');
        games.forEach(game => console.log(`- ${game.name}`));
    } catch (error) {
        console.error('Error:', error.message);
    }
}*/

//const fs = require('fs');
/*getGlobalStyles();
async function getGlobalStyles() {
    try {
        const data = await fs.readFile('./Customization.json', 'utf8');
        const config = JSON.parse(data);

        // Example: Send this to your GrapesJS frontend
        return config.dataSources;
    } catch (err) {
        console.error("Error reading JSON file:", err);
    }
}

async function getCoverPngUrl(coverId) {
    try {
        const response = await fetch('https://api.igdb.com/v4/covers', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': clientID,
                'Authorization': `Bearer ${accessToken}`,
            },
            // Changed "data" to "body"
            body: `fields image_id; where id = ${coverId};`
        });

        const data = await response.json();

        // Check if we actually got a result
        if (data.length > 0) {
            const imageId = data[0].image_id;
            // Use the full image delivery URL path
            return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
            //return `https://igdb.com${imageId}.png`;
        }

        return null; // Or a default image URL
    } catch (error) {
        console.error('Error fetching cover:', error.message);
        throw error;
    }
}


app.get('/get-cover/:id', async (req, res) => {
    try {
        const coverId = req.params.id;
        const url = await getCoverPngUrl(coverId); // Calls your function
        res.json({ imageUrl: url });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

async function getGamesCoverArt(coverId) {
    fetch('https://api.igdb.com/v4/covers', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': clientID,
            // 1. Ensure "Bearer " prefix is added
            'Authorization': `Bearer ${accessToken}`,
        },
        body: `fields alpha_channel,animated,checksum,game,height,image_id,url,width; where id = ${coverId};`
    })
        .then(async (response) => {
            // 2. Await the json data before logging
            const data = await response.json();
            console.log('Cover Art Data:', data);
        })
        .catch(err => {
            console.error('Fetch Error:', err);
        });
}
//await getCoverPngUrl(467132).then(url => console.log('PNG Link:', url));
const pngUrl = await getCoverPngUrl(467132);
console.log(pngUrl);
getGamesCoverArt(467132);



async function getGameCoverArtURL(gameId) {
    try {
        const games = await getGameData();
        const game = games.find(g => g.id === gameId);

        // Map through the games and construct the URL for each
        if (game && game.cover && game.cover.image_id) {
            // 2. Construct the CORRECT IGDB image URL
            // Needs: https://igdb.com{id}.jpg
            const imageUrl = `https://igdb.com{game.cover.image_id}.jpg`;

            console.log(`Found cover for ${game.name}: ${imageUrl}`);
            return imageUrl;
        }

        console.log("Game ID not found or has no cover art.");
        return null;

    } catch (error) {
        console.error('Error finding game cover:', error.message);
        return null;
    }
}*/
