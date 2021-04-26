const TodolistitemModel = require('../models/TodolistItemModel');

/**
 * Provides CRUD methods for the todo list
 */
class TodolistService {
  /**
   * Adds a todolist item
   * @param {*} userId
   * @param {*} text
   * @returns save result
   */
  static async addItem(userId, description) {
    const item = new TodolistitemModel();
    item.description = description;
    item.userId = userId;
    return item.save();
  }

  /**
   * Updates an item
   * @param {*} itemId
   * @param {*} data
   * @returns update result
   */
  static async updateItem(userId, id, data) {
    const item = await TodolistitemModel.findOne({ _id: id, userId }).exec();
    if (!item) throw new Error('Could not find item!');
    item.completed = data.completed ? data.completed : item.completed;
    item.description = data.description ? data.description : item.description;
    return item.save();
  }

  static async deleteItem(userId, id) {
    return TodolistitemModel.deleteOne({ _id: id, userId }).exec();
  }

  /**
   * Returns a list of items for a given user
   * @param {*} userId
   * @returns item list
   */
  static async getList(userId) {
    return TodolistitemModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}

module.exports = TodolistService;
