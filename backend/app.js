const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();
// ✅ Mongo connection
require("./conn/conn");

// ✅ CORS config - place it early and correctly
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

// ✅ Express body parser
app.use(express.json());

// ✅ Preflight response
// app.options("*", cors());



// ✅ Routes
const auth = require("./routes/auth");
const list = require("./routes/list");

// ✅ Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
