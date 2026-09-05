const express = require("express");
const cors = require("cors");
const axios = require("axios")
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//node backend
app.get("/api/test", (req,res) => {
    res.json({
        message: "document Screening API is running",
    });
});

// Test Node -> Python
app.post("/api/test-ai", async (req, res) => {
    try {

        const response = await axios.post(
            "http://localhost:8000/analyze"
        );

        res.json(response.data);

    } catch (error) {

        console.error("AI Service Error:", error.message);

        res.status(500).json({
            message: "AI service unavailable"
        });
    }
});


app.listen(PORT, () => {
    console.log(`app is listening to http://localhost:${PORT}`);
})
