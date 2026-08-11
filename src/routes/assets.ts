import express from "express";

const router = express.Router();

router.post("/cleanup", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
      console.error("CLOUDINARY_CLOUD_NAME not set");
      return res.status(500).json({ error: "Server configuration error" });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
        signal: controller.signal,
      }
    );

    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (error) {
    console.error("Cloudinary cleanup error:", error);
    return res.status(500).json({ error: "Failed to cleanup asset" });
  } finally {
    clearTimeout(timeoutId);
  }
});

export default router;
