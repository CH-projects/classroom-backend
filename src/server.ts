import express from "express";
import subjectsRouter from "./routes/subjects.js";
import assetsRouter from "./routes/assets.js";
import cors from "cors";
import helmet from "helmet";
import securityMiddleware from "./middleware/security.js";

const app = express();

app.use(securityMiddleware);


app.use(helmet());
const PORT = 8000;
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());

app.use('/api/subjects', subjectsRouter);
app.use('/api/assets', assetsRouter);

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
