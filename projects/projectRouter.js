const express = require('express');

const router = express.Router();

const Project = require('./projectDb.js');

//Post a project on a specific action
router.post('/:id/posts', async (req, res) => {
    const id = req.user.id;
    const text = req.body.text;
    console.log(text, id)

    try {
        const newPost = await Post.insert({text, user_id:id})
        res.status(201).json(newPost)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'There was an error while saving the post to the database.' })
    }
});

//Get all projects
router.get('/', async (req, res) => {
    try {
        const users = await User.get();
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The users information could not be retrived.' })
    }
});

//Get project by ID
router.get('/:id/posts', async (req, res) => {
    const id = req.user.id;

    try {
        const post = await User.getUserPosts(id)
            if(post && post.length > 0) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified user ID does not exist.' })
            }
    } catch (err) {
        res.status(500).json({ errorMessage: 'The posts information could not be retrieved.' })
    }
});

//Delete a project
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

//Update a project
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

    User.getById(id)
        .then(user => {
            if(user) {
                req.user = user;
                next();
            } else {
                res.status(400).json({ message: 'invalid user id' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'user could not be retieved' })
        })
};

function validateProject(req,res, next) {
    if(!req.body) {
        res.status(404).json({ errorMessage: 'missing post data' })
    } else if (!req.body.text) {
        res.status(400).json({ errorMessage: 'missing required text field' })
    } else {
        next()
    }
}

module.exports = router;