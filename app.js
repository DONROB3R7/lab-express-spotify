const express = require('express');
const hbs = require('hbs');
const path = require('path');

require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(path.join(__dirname, '/views/partials'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error)); 

app.get('/', (req, res) => {
        res.render('home')

})

app.get('/artist-search', (req, res) => {
    const artistQuery = req.query.cats
    spotifyApi
    .searchArtists(artistQuery)
    .then(data => {
        console.log(data.body.artists.items);
        res.render('artistsAlbums', {artists: data.body.artists.items})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    const artistQuery = req.params.id

    spotifyApi
    .getArtistAlbums(artistQuery)
    .then(data => {
    res.render('albums', {albums: data.body.items})

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:id', (req, res) => {
    const artistQuery = req.params.id

    spotifyApi
    .getAlbumTracks(artistQuery)
    .then(data => {
    res.render('tracks', {tracks: data.body.items})

    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));