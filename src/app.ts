import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import { logRequests } from "./middleware/logger.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/books.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 6000;

//  Allow frontend URL (http://localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(logRequests);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => res.send("Library System API is running"));

sequelize.authenticate()
  .then(() => {
    sequelize.sync({ alter: true });
    console.log("Database connected");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection failed:", err));
