const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
 

require("./conn/conn");
const auth = require("./routes/auth");
const list = require("./routes/list");

// ✅ Swagger setup
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello");
});

app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(1000, () => {
    console.log("Server Started");
    
});
