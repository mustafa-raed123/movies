const express = require("express");
const app = express();
const jsondata = require('./movie-data/data.json')
const jsdata = JSON.stringify(jsondata)
require('dotenv').config();
const cors = require('cors')
app.use(cors())
app.use(express.json())
let pg = require('pg')
const DataBase = process.env.PG_DATABASE;
const UserName = process.env.PG_USERNAME;
const Password = process.env.PG_PASSWORD;
const Host = process.env.PG_HOST;
const Port = process.env.PG_POST
const client = new pg.Client(`postgresql://${UserName}:${Password}@${Host}:${Port}/${DataBase}`)
const port = 8080;
const Key_api = process.env.Key_api;
app.use(express.json())
const axios = require("axios");
function constructor(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}
function getdata(id, title, release_date, poster_path, overview) {
    this.id = id
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


app.get("/", (req, res) => {

    res.send(new constructor(jsondata.title, jsondata.poster_path, jsondata.overview));
})
app.get("/trending", trending)
app.get("/search", search)
app.get("/popular", popular)
app.get("/nowplaying", nowplaying)
app.get("/getMovies",getMovies)
app.post("/addMovies",addMovies)
app.get("*", defulthandler)

app.get("/favorite", (req, res) => {
    res.send("Welcome to Favorite Page")
})
async function trending(req, res) {

    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${Key_api}&language=en-US`
    try {
        const axiosresult = await axios.get(url)
        const axiosname = axiosresult.data.results.map(items => ({
            id: items.id,
            title: items.title,
            release_date: items.release_date,
            poster_path: items.poster_path,
            overview: items.overview


        }))
        res.json(axiosname);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve trending movies", error: error });
    }

}
async function search(req, res) {

    const url = `https://api.themoviedb.org/3/search/movie?query=JACK+Reacher&api_key=${Key_api}&language=en-US`
    try {
        const axiosresult = await axios.get(url)
        const axiosname = axiosresult.data.results.map(items => {
            let get = new getdata(items.id, items.title, items.release_date, items.poster_path, items.overview)
            return get;
        })
        res.json(axiosname);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve searching movies", error: error });
    }
}
async function popular(req, res) {

    const url = `//api.themoviedb.org/3/movie/popular?api_key=${Key_api}&language=en-US`
    try {
        const axiosresult = await axios.get(url)
        const axiosname = axiosresult.data.results.map(items => {

            let get = new getdata(items.id, items.title, items.release_date, items.poster_path, items.overview)
            return get;
        })
        res.json(axiosname);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve popular movies", error: error });
    }
}
async function nowplaying(req, res) {

    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${Key_api}&language=en-US&page=1`
    try {
        const axiosresult = await axios.get(url)
        const axiosname = axiosresult.data.results.map(items => {
            let get = new getdata(items.id, items.title, items.release_date, items.poster_path, items.overview)
            return get;
        })
        res.json(axiosname);
    } catch (error) {
        res.status(500).json({ message: "Unable to retrieve nowplaying movies", error: error });
    }
}
function getMovies(req,res){
    const sql = "SELECT * FROM movie_detail"
    client.query(sql)
    .then((data)=>{
        res.send(data.rows)
    })
    .catch((err,req,res)=>{
        res.status(500).send({ message: "can't add the movie", error: err });


    })

}
function addMovies(req,res){
    const movie = req.body;
    const sql ='INSERT INTO movie_detail(title,release_date,poster_path,overview,comments) VALUES ($1, $2, $3 , $4 , $5 ) RETURNING *'
    const values = [movie.title,movie.release_date,movie.poster_path,movie.overview,movie.comments]
    client.query(sql,values)
    .then((data)=>{
        res.send("your data was added")
    })
    .catch((err)=>{
        res.status(500).json({ message: "can't add the movie", error: err });


    })
}
client.connect()
.then(()=>{
    
    app.listen(port, () => {
        console.log(`listing to port ${port}`)
    });
})

function defulthandler(req, res) {
    res.status(404).json({
        "status": 404,
        "responsetext": "Page not found"
    })
}
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        "status": 500,
        "responseText": `"Sorry, something  went wrong":  ${err}`
    });
});
