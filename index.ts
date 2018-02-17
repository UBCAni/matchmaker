import * as fs from 'fs';
import * as path from 'path';

import { Comparator } from './src/comparator/comparator';

const parse = require('csv-parse/lib/sync');
const json2csv = require('json2csv');

const results = parse(fs.readFileSync(path.resolve("resources", "responses.csv"), { encoding: "utf8" }), { columns: [
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
]});

const headers = results[0];
const info = results.slice(1).sort((a: any, b: any) => a['Nickname'].localeCompare(b['Nickname']));

const people = info.map((i: DataHandler<string>) => i.Nickname);

function createCSV() {
    const data = info.map((i: DataHandler<string>) => Object.assign({}, ...info.map((d: DataHandler<string>, x: number) => ({ [people[x]]: Comparator.compare(i, d) }))));
    
    data.forEach((data: any, i: number) => data['Nickname'] = people[i]);
    people.unshift("Nickname");
    
    const csv = json2csv({ data, fields: people})
    
    fs.writeFileSync("results.csv", csv);
}

function likedBy() {
    const data = info.map((i: DataHandler<string>) => info
    .map((d: DataHandler<string>) => ({ name: d.Nickname, score: Comparator.compare(d, i)}))
    .sort((a: any , b: any) => b.score - a.score)
    .filter((a: any) => a.name !== i.Nickname)
    .slice(0, 3));

    let s = data.map((row: any, i: number) => `${people[i]}\n${row.map((r: any) => `${r.name}: ${(r.score * 100).toFixed(2)}%`).join("\n")}`).join("\n\n");
    fs.writeFileSync("likedBy.txt", s);
}


function likes() {
    const data = info.map((i: DataHandler<string>) => info
    .map((d: DataHandler<string>) => ({ name: d.Nickname, score: Comparator.compare(i, d)}))
    .sort((a: any , b: any) => b.score - a.score)
    .filter((a: any) => a.name !== i.Nickname)
    .slice(0, 3));

    let s = data.map((row: any, i: number) => `${people[i]}\n${row.map((r: any) => `${r.name}: ${(r.score * 100).toFixed(2)}%`).join("\n")}`).join("\n\n");
    fs.writeFileSync("likes.txt", s);
}

function leastLikedBy() {
    const data = info.map((i: DataHandler<string>) => info
    .map((d: DataHandler<string>) => ({ name: d.Nickname, score: Comparator.compare(d, i)}))
    .sort((a: any , b: any) => a.score - b.score)
    .filter((a: any) => a.name !== i.Nickname)
    .slice(0, 3));

    let s = data.map((row: any, i: number) => `${people[i]}\n${row.map((r: any) => `${r.name}: ${(r.score * 100).toFixed(2)}%`).join("\n")}`).join("\n\n");
    fs.writeFileSync("leastLikedBy.txt", s);
}


function leastLikes() {
    const data = info.map((i: DataHandler<string>) => info
    .map((d: DataHandler<string>) => ({ name: d.Nickname, score: Comparator.compare(i, d)}))
    .sort((a: any , b: any) => a.score - b.score)
    .filter((a: any) => a.name !== i.Nickname)
    .slice(0, 3));

    let s = data.map((row: any, i: number) => `${people[i]}\n${row.map((r: any) => `${r.name}: ${(r.score * 100).toFixed(2)}%`).join("\n")}`).join("\n\n");
    fs.writeFileSync("leastLikes.txt", s);
}

likedBy();
likes();
leastLikedBy();
leastLikes();