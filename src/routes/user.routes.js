const { Router } = require('express');
const { cache } = require('../middlewares/cache');
const ctrl = require('../controllers/user.controller');


const router = Router();


// Cache list with key users:all (includes query if any)
router.get('/', cache((req) => `users:all:${req.originalUrl}`), ctrl.listUsers);


// Cache per-user by id
router.get('/:id', cache((req) => `user:${req.params.id}`), ctrl.getUser);


router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);


module.exports = router;