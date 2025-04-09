const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const validateList = require("../middleware/validateList");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

/**
 * @swagger
 * tags:
 *   name: Todo
 *   description: Endpoints for managing tasks (Todo items)
 */

/**
 * @swagger
 * /api/v2/addTask:
 *   post:
 *     summary: Add a new task for a user
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               body:
 *                 type: string
 *                 example: Milk, Bread, Eggs
 *               id:
 *                 type: string
 *                 description: User ID
 *                 example: 64f891fae7ab76852b2ed8d1
 *     responses:
 *       200:
 *         description: Task added successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post("/addTask", authMiddleware, validateList, async (req, res) => {
  try {
    const { title, body, id } = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = new List({ title, body, user: id });
    await list.save();

    existingUser.list.push(list._id);
    await existingUser.save();

    return res.status(200).json({ message: "Task added successfully", list });
  } catch (error) {
    console.error("Add Task Error:", error);
    return res.status(500).json({ message: "Server error while adding task" });
  }
});

/**
 * @swagger
 * /api/v2/updateTask/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated title
 *               body:
 *                 type: string
 *                 example: Updated task body
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.put("/updateTask/:id", authMiddleware, validateList, async (req, res) => {
  try {
    const { title, body } = req.body;

    const updatedTask = await List.findByIdAndUpdate(
      req.params.id,
      { title, body },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Server error while updating task" });
  }
});

/**
 * @swagger
 * /api/v2/deleteTask/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Task ID to delete
 *         schema:
 *           type: string
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID of the user who owns the task
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: User or Task not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteTask/:id", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findByIdAndUpdate(userId, {
      $pull: { list: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedTask = await List.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Server error while deleting task" });
  }
});

/**
 * @swagger
 * /api/v2/getTasks/{id}:
 *   get:
 *     summary: Get all tasks for a specific user
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to fetch tasks for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found or no tasks
 *       500:
 *         description: Server error
 */
router.get("/getTasks/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const list = await List.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(list.length > 0 ? { list } : { message: "No tasks found" });
  } catch (error) {
    console.error("Fetch Task Error:", error);
    res.status(500).json({ error: "Server error while fetching tasks" });
  }
});

module.exports = router;
