import fetch from "node-fetch";
import minimist from 'minimist'
import { joinImages } from 'join-images';
import { join } from 'path';

let argv = minimist(process.argv.slice(2));

const BASE_URL = "https://cataas.com/cat"

let {
    greeting = 'Hello',
    who = 'You',
    width = 400,
    height = 500,
    color = 'pink',
    size = 100,
} = argv;

// returns a random cat image with the given text
async function fetchCatWithText(text, params) {
    const queryParams = new URLSearchParams(params)
    const response = await fetch(`${BASE_URL}/says/${text}?${queryParams}`)

    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    return response.arrayBuffer()
}

// merges the given images and saves as a jpg in the current path
function joinAndSave(imageBuffers) {
    joinImages(imageBuffers, { direction: 'horizontal' })
        .then((img) => {
            const fileOut = join(process.cwd(), `/cat-card.jpg`);
            img.toFile(fileOut);
            console.log("The file was saved!")

        })
        .catch(error => console.log(error))
}

try {
    const images = await Promise.all([greeting, who].map(text => fetchCatWithText(text, { width, height, color, size })))
    const imageBuffers = images.map(image => Buffer.from(image))

    joinAndSave(imageBuffers)
} catch (error) {
    console.log(error)
}

