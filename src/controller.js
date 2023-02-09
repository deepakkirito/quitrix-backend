const plot = require('./model');

const sendPlot = (req, res) => {
    plot.find({},{__v:0}).sort({year:-1}).exec((err, data1)=>{
        plot.find({},{__v:0}).exec((err, data2)=>{

            res.status(200).send({data1:data1,data2:data2});
        })
    })
}

const addPlot = (req, res) => {
    const io = req.app.get('socketio');
    plot.find({year:req.body.year}).exec((err, data)=>{
        if(err) {
            res.status(200).send('Internal Server Error');
        }
        if(data.length !== 0) {
            res.status(200).send('Data already exists for this year');
        } else {
            let data = new plot(req.body);
            data.save((err,data)=>{
                if(err) {
                    res.status(200).send('Internal Server Error');
                }
                io.emit('add-broadcast', data);
                res.status(201).send('Data Saved');
            })
        }
    })
}

const sendVideo = (req, res) => {
    // res.status(200).send('https://cdn.glitch.global/529e6edc-0399-461b-8c23-d40e94013348/http-bing.mp4?v=1675900954580');
    res.status(200).send('');
}

module.exports = {
    sendPlot,
    addPlot,
    sendVideo
}