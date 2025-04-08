const { z } = require("zod");

// Schema to validate todo input
const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

// Middleware to validate request body
const validateList = (req, res, next) => {
  const result = todoSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: result.error.errors.map((err) => err.message),
    });
  }

  next(); // Continue if input is valid
};

module.exports = validateList;
