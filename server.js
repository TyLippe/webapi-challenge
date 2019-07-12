const express = require('express');
const server = express();
const helmet = require('helmet');
const actionRouter = require("./actions/actionRouter")
const projectRouter = require("./projects/projectRouter")

server.use(express.json());
server.use(helmet());
server.use(logger);

server.use("/api/actions", actionRouter);
server.use("/api/projects", projectRouter);


server.get('/', logger, (req, res) => {
    res.send(`<h2>SPRINT DAY!</h2>`)
});


function logger(req, res, next) {
    console.log(`${req.method} Request`);
    next();
}

module.exports = server;