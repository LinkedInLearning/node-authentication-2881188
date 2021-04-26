const { Router } = require('express');
const TodolistService = require('../../../services/TodolistService');

const router = Router();

module.exports = () => {
  router.post('/', async (req, res, next) => {
    try {
      await TodolistService.addItem(req.user.id, req.body.description);
      return res.status(201).json({ status: 'created' });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const items = await TodolistService.getList(req.user.id);
      return res.json({ items });
    } catch (err) {
      return next(err);
    }
  });

  router.put('/:itemId', async (req, res, next) => {
    try {
      const result = await TodolistService.updateItem(
        req.user.id,
        req.params.itemId,
        req.body
      );
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:itemId', async (req, res, next) => {
    try {
      const result = await TodolistService.deleteItem(
        req.user.id,
        req.params.itemId
      );
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
