import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

let url_current_count = 0;

let shortened_urls = [];

const regex = /^https?:\/\/[^\/\s\?]+(?:\:\d+)?(?:\/[^\s\?]*)?\/?(?:\?.*)?$/;

app.post('/api/shorturl', async (req, res) => {
    if (!req.body.url) {
        return res.send({ "error": "invalid url" }), 400
    }
    const url = req.body.url;
    if (!regex.test(url)) {
        return res.send({ "error": "invalid url" }), 400
    }
    url_current_count = url_current_count + 1;
    let response = { original_url: url, short_url: url_current_count };
    shortened_urls.push(response);
    return res.send(response), 200
})

app.get('/api/shorturl/:short_url', async (req, res) => {
    const short_url = req.params.short_url;
    if (!short_url) {
        return res.send({ "error": "No short URL found for the given input" }), 400
    }

    let response = shortened_urls.filter((seperate_response) => seperate_response.short_url == Number(short_url))
    if (response.length == 0) {
        return res.send({ "error": "No short URL found for the given input" }), 400
    } else {
        return res.redirect(response[0].original_url)
    }
})


app.listen(3000, () => {
    console.log("Server is running in the port: ", 3000)
})