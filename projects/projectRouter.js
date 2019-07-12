const express = require('express');

const router = express.Router();

const Project = require('./projectModel.js');


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

//Get project by ID (WOEKING/ SHOWS PROJECT_ID AS WELL)
router.get('/:id', validateProjectId, async (req, res) => {
    const { id } = req.params;

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
        res.status(500).json({ errorMessage: 'There was an error while add the new project!' })
    }
});

//Delete a project (WORKING)
router.delete('/:id', validateProjectId, async (req, res) => {
    const id = req.params.id;

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
        const newProjectID = req.params.id
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

module.exports = router;