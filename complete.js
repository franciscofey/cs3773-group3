import igdb from 'igdb-api-node';
const clientID = 'vzurxaty99ttpx6sm1shmpvpekd4rg';
const clientSecret = 'dobzr421pzsecxjrhcxxzgyjkh9iqe';
const url = `https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`;
const accessToken = await getTwitchToken();
const client = igdb.default('vzurxaty99ttpx6sm1shmpvpekd4rg', accessToken);
getGames();
getGamesCoverArt();

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
}*/

//Twitch token to start website API
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

    function getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // Both maximum and minimum are inclusive
    }
}