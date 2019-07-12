const express = require('express');

const router = express.Router();

const Project = require('./projectModel.js');
const Action = require('../actions/actionModel.js')

//Get all projects (WORKING)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.get();
        res.status(200).json(projects)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The projects could not be retrived.' })
    }
});

//Get project by ID (WORKING/ SHOWS PROJECT_ID AS WELL)
router.get('/:id', validateProjectId, async (req, res) => {
    const id = req.project.id;

    try {
        const projectById = await Project.get(id)
            if(projectById) {
                res.status(200).json(projectById)
            } else {
                res.status(404).json({ errorMessage: 'The project with the specified user ID does not exist.' })
            }
    } catch (err) {
        res.status(500).json({ errorMessage: 'This project could not be retrieved.' })
    }
});

//Add new project (WORKING)
router.post('/', validateProject, async (req, res) => {
    const project = req.body;

    try {
        const newProject = await Project.insert(project);
        res.status(201).json(newProject)
    }
    catch (err) { 
        res.status(500).json({ errorMessage: 'There was an error while adding a new project.' })
    }
});

//Post a new action to a project (WORKING)
router.post('/:id/actions', validateProjectId, validateAction, async (req, res) => {
    const action = {
        description: req.body.description,
        notes: req.body.notes
    }
    const id = req.project.id;
    console.log(action, id)

    try {
        const newAction = await Action.insert({ ...action, project_id:id })
        res.status(201).json(newAction)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'There was an error while saving the new action to the database.' })
    }
});

//Get action by ID (WORKING)
router.get('/:id/actions', validateActionId, async (req, res) => {
    const id = req.action.id;
    
    try {
        const action = await Action.get(id)
            if(action) {
                res.status(200).json(action);
            } else {
                res.status(404).json({ errorMessage: 'The action with the specified ID does not exist.' })
            }
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'This action could not be retrieved.' })
    }
});

//Delete a project (WORKING)
router.delete('/:id', validateProjectId, async (req, res) => {
    const id = req.project.id;

    try {
        const deleted = await Project.remove(id);
            if(deleted) {
                res.status(200).json({ message: 'Project was deleted.' }) 
            }   else {
                res.status(400).json({ errorMessage: 'Project with that ID could not be deleted' })
            }
    } catch (err) {
        res.status(500).json({ errorMessage: 'This project could not be remvoed.' })
    }
});

//Update a project (WORKING)
router.put('/:id', validateProjectId, validateProject, async (req, res) => {
    try {
        const project = req.body
        const newProjectID = req.project.id
        await Project.update(newProjectID, project)

        const updatedProject = await Project.get(newProjectID)
        res.status(201).json(updatedProject)
    }
    catch (err) {
        res.status(500).json({ errorMessage: 'The user could not be updated.' })
    }
});

//custom middleware

function validateProjectId(req, res, next) {
    const id = req.params.id;

    Project.get(id)
        .then(project => {
            if(project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({ message: 'invalid project id' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'project could not be retieved' })
        })
};

function validateProject(req,res, next) {
    if (!req.body) {
        res.status(404).json({ errorMessage: 'missing data' })
    } else if (!req.body.name) {
        res.status(400).json({ errorMessage: 'missing required name field' })
    } else if (!req.body.description) {
        res.status(400).json({ errorMessage: 'missing required description field' })
    } else {
        next()
    }
}

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
            res.status(500).json({ message: 'action with that id could not be retieved' })
        })
};

module.exports = router;