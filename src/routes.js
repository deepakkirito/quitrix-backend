const routes = require('express').Router();
const {sendPlot, addPlot, sendVideo} = require('./controller');

routes.get('/plot', sendPlot);

routes.post('/plot', addPlot);

routes.get('/video', sendVideo);

module.exports = routes;