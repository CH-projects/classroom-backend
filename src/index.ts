import express from "express";

const app = express();
const PORT = 8000;

app.use(express.json()); // Use JSON middleware

//Get route that retuns a short message
app.get("/", (req, res) =>{
    res.send("Server is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
