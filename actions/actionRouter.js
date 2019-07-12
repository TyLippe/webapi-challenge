const express = require('express');

const router = express.Router();

const Action = require('./actionModel.js');

//Get all actions (WORKING)
router.get('/', async (req, res) => {
    try {
        const actions = await Action.get();
        res.status(200).json(actions)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The actions could not be retrived.' })
    }
});

//Delete an action
router.delete('/:id', validateActionId, async (req, res) => {
    const id = req.user.id;

    try {
        const deleted = await Action.remove(id);
            if(deleted) {
                res.status(200).json({ message: 'Action was deleted.' }) 
            }   else {
                res.status(400).json({ errorMessage: 'Action with that ID could not be deleted' })
            }
    } catch (err) {
        res.status(500).json({ errorMessage: 'This action could not be remvoed.' })
    }
});

//Update an action
router.put('/:id', validateAction, validateActionId, async (req, res) => {
    try {
        const update = req.body
        const newActionId = req.action.id
        await Action.update(newActionId, update)

        const updatedAction = await User.getById(newActionId)
        res.status(201).json(updatedAction)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'This action could not be updated.' })
    }
});

//custom middleware

function validateActionId(req, res, next) {
    const id = req.params.id;

    Action.get(id)
        .then(action => {
            if(action) {
                req.action = action;
                next();
            } else {
                res.status(400).json({ message: 'invalid action id' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'action could not be retieved' })
        })
};

function validateAction(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: 'missing user data' })
    } else if (!req.body.description) {
        res.status(400).json({ message: 'missing required description field' })
    } else if (!req.body.notes) {
        res.status(400).json({ message: 'missing required notes field' })
    } else {
        next()
    }
};

module.exports = router;