const mongoose = require('mongoose');
const { MONGO_URI } = require('./config')
const axios = require('axios').default;
const cheerio = require('cheerio');
const cron = require('node-cron');

// Creamos la conection
mongoose.connect(MONGO_URI, { useNewUrlParser: true });
// Import model
const { BreakingNew } = require('./models');

// Cada 4 horas: 0 */4 * * *
cron.schedule('*/1 * * * *', async () => {
    console.log('Cron Job Executed!')
    const html = await axios.get('https://cnnespanol.cnn.com/');
    const $ = cheerio.load(html.data);
    const titles = $('.news__title');
    let arrayNews = []
    titles.each((index, element) => {
        const breakingNew = {
            title: $(element)
                .children()
                .attr('title'),
            link: $(element)
                .children()
                .attr('href')
        };
        arrayNews.push(breakingNew);
    });
    BreakingNew.create(arrayNews);
})




