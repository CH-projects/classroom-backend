import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";

const app = express();
const PORT = 8000;
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.use(express.json());

app.use('/api/subjects', subjectsRouter);

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
