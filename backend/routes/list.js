// const router = require("express").Router();
// const User = require("../models/user");
// const List = require("../models/list");
// const validateList = require("../middleware/validateList");
// const authMiddleware = require("../middleware/authMiddleware");
// const mongoose = require("mongoose");


// /**
//  * @swagger
//  * tags:
//  *   name: Todo
//  *   description: Todo management
//  */

// /**
//  * @swagger
//  * /api/v2/addTask:
//  *   post:
//  *     summary: Add a task
//  *     tags: [Todo]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               body:
//  *                 type: string
//  *               id:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Task added
//  */
// router.post("/addTask", authMiddleware, validateList, async (req, res) => {
//   try {
//     const { title, body, id } = req.body;

//     const existingUser = await User.findById(id);
//     if (!existingUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const list = new List({ title, body, user: existingUser._id });
//     await list.save();

//     existingUser.list.push(list._id);
//     await existingUser.save();

//     return res.status(200).json({ message: "Task added successfully", list });
//   } catch (error) {
//     console.error("Add Task Error:", error);
//     return res.status(500).json({ message: "Server error while adding task" });
//   }
// });


// /**
//  * @swagger
//  * /api/v2/updateTask/{id}:
//  *   put:
//  *     summary: Update a task
//  *     tags: [Todo]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: Task ID
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *               body:
//  *                 type: string
//  *     responses:
//  *       200:
//  *         description: Task updated
//  */
// router.put("/updateTask/:id", authMiddleware, validateList, async (req, res) => {
//   try {
//     const { title, body } = req.body;
//     const list = await List.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
//     list.save().then(() =>
//       res.status(200).json({ message: "Task Updated successfully" })
//     );
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * @swagger
//  * /api/v2/deleteTask/{id}:
//  *   delete:
//  *     summary: Delete a task
//  *     tags: [Todo]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: Task ID
//  *         schema:
//  *           type: string
//  *       - name: userId
//  *         in: query
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Task deleted
//  */
// router.delete("/deleteTask/:id", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.query.userId;
//     const existingUser = await User.findByIdAndUpdate(userId, {
//       $pull: { list: req.params.id },
//     });

//     if (existingUser) {
//       await List.findByIdAndDelete(req.params.id);
//       res.status(200).json({ message: "Task deleted successfully" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// /**
//  * @swagger
//  * /api/v2/getTasks/{id}:
//  *   get:
//  *     summary: Fetch tasks by user ID
//  *     tags: [Todo]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: User ID
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: List of tasks
//  */
// router.get("/getTasks/:id", authMiddleware, async (req, res) => {
//   try {
//     const userId = req.params.id;

//     // ✅ Step 3.1: Check for valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ error: "Invalid user ID" });
//     }

//     // ✅ Step 3.2: Query the List collection
//     const list = await List.find({ user: userId }).sort({ createdAt: -1 });

//     // ✅ Step 3.3: Return tasks or message
//     if (list.length > 0) {
//       res.status(200).json({ list });
//     } else {
//       res.status(200).json({ message: "No tasks found" });
//     }
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ error: "Server error while fetching tasks" });
//   }
// });


// module.exports = router;

















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
 *   description: Todo management
 */

/**
 * @swagger
 * /api/v2/addTask:
 *   post:
 *     summary: Add a task
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
 *               body:
 *                 type: string
 *               id:
 *                 type: string
 *                 description: User ID
 *     responses:
 *       200:
 *         description: Task added successfully
 *       404:
 *         description: User not found
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
 *     summary: Update a task
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
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
 *     summary: Delete a task
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *       - name: userId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: User or task not found
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
 *     summary: Fetch tasks by user ID
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of tasks
 *       404:
 *         description: User not found
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
