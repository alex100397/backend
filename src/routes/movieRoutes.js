import express from 'express';

const router = express.Router();

//GET, POST, PUT, DELETE

router.get('/', (req, res) => {
    res.json({'message': 'Getting all movies'});
});

router.post('/', (req, res) => {
    res.json({'message': 'Creating a movie'});
});

router.get('/:id', (req, res) => {
    res.json({'message': `Getting a movie with id ${req.params.id}`});
});

router.put('/:id', (req, res) => {
    res.json({'message': `Updating a movie with id ${req.params.id}`});
});

router.delete('/:id', (req, res) => {
    res.json({'message': `Deleting a movie with id ${req.params.id}`});
});

export default router;