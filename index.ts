import * as fs from 'fs';
import * as path from 'path';

import { Comparator } from './src/comparator/comparator';

const parse = require('csv-parse/lib/sync');

const data = fs.readFileSync(path.resolve("resources", "responses.csv"), { encoding: "utf8" });

const results = parse(data, { columns: [
    "Timestamp",
    "Nickname",
    "How would your friends describe your personality?",
    "Cats or dogs?",
    "What's your favourite type of drink?",
    "Which RPG class would you want to be?",
    "What is your musical preference?",
    "What's the most important quality that they should have?",
    "What's your ideal first date?",
    "What are your preferred personality traits in your partner?",
    "Sweets?",
    "Favourite genres",
    "Do you prefer watching anime, reading manga, or something else?",
    "Do you prefer watching anime with others or on your own?",
    "How much of your time do you spend watching anime?",
    "What's your favourite dere?",
    "Who would you want as a love interest?",
    "What would you do after school as a high-schooler in Japan?",
    "You're in Japan. What do you do first?"
]}).slice(1);
