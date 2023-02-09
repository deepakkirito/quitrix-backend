const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const routes = require('./routes');
const plot = require('./model');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

// <===================================== Middlewares ========================================>


app.use(bodyParser.json());
app.use('/',(req,res,next) => {
    if (req.url === '/') {
        res.status(200).send('Welcome to the Quitrix Server')
    } else {
        next();
    };
});

// <===================================== Web Socket ==========================================>

io.on('connection', socket => {

    socket.on('updated-data', data =>{
        plot.findByIdAndUpdate(data.id,{[data.name]:data.value},{new:true},(err,udata)=>{
            socket.broadcast.emit('broadcast-data',udata);
            socket.emit('data-updated',udata);
        })
    })
    
    socket.on('disconnect', ()=>{
        console.log(disconnected);
    });
    
})

app.set('socketio', io);

// <===================================== Routes =============================================>

app.use('/', routes);

// <===================================== MongoDB ============================================>

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB Connection error!'));
db.on('open', () => {
    console.log('MongoDB is connected successfully');
    startServer();
});

// <===================================== Server ============================================>

const startServer = () => {
    server.listen(process.env.PORT, ()=>{
        console.log(`Server is running on http://localhost:${process.env.PORT}`);
    })
};

// <=========================================================================================>
