import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const GIPHY_API_KEY = process.env.Giphy_api_key;

const activities = [
    'running', 'swimming', 'dancing', 'cycling', 'skiing',
    'surfing', 'hiking', 'yoga', 'boxing', 'skateboarding',
    'playing guitar', 'playing piano', 'cooking', 'painting', 
    'gardening', 'fishing', 'reading', 'writing', 'drawing', 
    'singing', 'juggling', 'bowling', 'baking', 'photography', 
    'knitting', 'sewing', 'rock climbing', 'diving', 'horse riding',
    'basketball', 'soccer', 'tennis', 'badminton', 'table tennis', 
    'volleyball', 'baseball', 'golf', 'cricket', 'rugby',
    'ice skating', 'roller skating', 'fencing', 'archery',
    'weightlifting', 'gymnastics', 'cheerleading', 'karate',
    'taekwondo', 'judo'
];

let correctAnswers = 0;

app.get('/', async (req, res) => {
    try {
        const options = getRandomOptions(activities, 4);
        let correctOption = options[Math.floor(Math.random() * options.length)];
       let  correctOption1='"'+correctOption+'"'
         console.log(correctOption)
         console.log(options)
        //  console.log(first)
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${correctOption1}&limit=1`);
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        
        const data = await response.json();
        const gif = data.data[0]?.images.original.url;

        if (!gif) throw new Error('No GIF found');
        console.log(response)
        res.render('index', { gif, options, correctOption });
    } catch (error) {
        console.error('Error fetching GIF:', error);
        res.render('error', { message: 'Failed to load GIF. Please try again later.' });
    }
});

app.get('/gameover', (req, res) => {
    res.render('gameover', { correctAnswers });
    correctAnswers = 0; // Reset the correct answers count for the next game
});

app.use(express.json());

app.post('/check-answer', (req, res) => {
    const { selectedOption, correctOption } = req.body;
    if (selectedOption === correctOption) {
        correctAnswers++;
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

function getRandomOptions(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
