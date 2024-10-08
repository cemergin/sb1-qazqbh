import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file');
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const urls = [
  'https://www.residentadvisor.net/events/de/berlin',
  'https://www.berghain.berlin/en/program/',
  'https://www.tresorberlin.com/events/',
  // Add more URLs as needed
];

const RATE_LIMIT_DELAY = 2000; // 2 seconds

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseWithAI(content) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts concert information from HTML content. Please extract the following information for each concert event: artist, date, venue, time, genre, description, and ticket URL. Return the information in JSON format."
        },
        {
          role: "user",
          content: `Parse the following HTML content and extract concert information: ${content}`
        }
      ],
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error parsing with AI:', error.message);
    return [];
  }
}

async function crawlUrl(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract the main content area
    const mainContent = $('main, #content, .events, .program').html();
    
    if (!mainContent) {
      console.warn(`No main content found for ${url}`);
      return [];
    }

    const events = await parseWithAI(mainContent);
    return events;
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
    return [];
  }
}

async function crawlAllUrls() {
  const allEvents = [];

  for (const url of urls) {
    console.log(`Crawling ${url}...`);
    const events = await crawlUrl(url);
    allEvents.push(...events);
    console.log(`Found ${events.length} events on ${url}`);
    
    if (url !== urls[urls.length - 1]) {
      console.log(`Waiting ${RATE_LIMIT_DELAY / 1000} seconds before next request...`);
      await delay(RATE_LIMIT_DELAY);
    }
  }

  const uniqueEvents = allEvents.filter((event, index, self) =>
    index === self.findIndex((t) => t.artist === event.artist && t.date === event.date)
  );

  uniqueEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  uniqueEvents.forEach((event, index) => {
    event.id = index + 1;
  });

  return uniqueEvents;
}

crawlAllUrls().then(events => {
  const outputPath = path.join(process.cwd(), 'concerts.json');
  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
  console.log(`Crawled ${events.length} unique events and saved to ${outputPath}`);
}).catch(error => {
  console.error('Error during crawling:', error);
  process.exit(1);
});