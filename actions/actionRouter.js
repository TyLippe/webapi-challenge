const express = require('express');

const router = express.Router();

const Action = require('./actionModel.js');

//Post a new action
router.post('/', async (req, res) => {
    const userName = req.body;
    console.log(userName)
    
    try {
        const name = await User.insert(userName);
        res.status(201).json(name)
    }
    catch (err) { 
        res.status(500).json({ errorMessage: 'There was an error while add the new user!' })
    }
});

//Get all actions
router.get('/', async (req, res) => {
    try {
        const users = await User.get();
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The users information could not be retrived.' })
    }
});

//Get action by ID
router.get('/:id', async (req, res) => {
    const id = req.user.id;
    
    try {
        const user = await User.getById(id)
            if(user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
            }
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The user information could not be retrieved.' })
    }
});


//Delete an action
router.delete('/:id', async (req, res) => {
    const id = req.user.id;

    try {
        const deleted = await User.remove(id);
            if(deleted) {
                res.status(200).json({ message: 'User was deleted.' }) 
            }   else {
                res.status(400).json({ errorMessage: 'User with that ID could not be deleted' })
            }
    } catch (err) {
        res.status(500).json({ errorMessage: 'The user could not be remvoed.' })
    }
});

//Update an action
router.put('/:id', async (req, res) => {
    try {
        const userName = req.body
        const newUserId = req.user.id
        await User.update(newUserId, userName)

        const updatedUser = await User.getById(newUserId)
        res.status(201).json(updatedUser)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The user could not be updated.' })
    }
});

//custom middleware

function validateActionId(req, res, next) {
    const id = req.params.id;

    Action.getById(id)
        .then(action => {
            if(action) {
                req.action = action;
                next();
            } else {
                res.status(400).json({ message: 'invalid user id' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'user could not be retieved' })
        })
};

function validateAction(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: 'missing user data' })
    } else if (!req.body.name) {
        res.status(400).json({ message: 'missing required name field' })
    } else {
        next()
    }
};

module.exports = router;