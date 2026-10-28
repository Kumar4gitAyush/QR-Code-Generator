
import express from "express";
import qr from "qr-image";
import fs from "node:fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/qr", async (req, res) => {
  try {
    const { url } = req.body;

    if (typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        error: "Please enter a URL."
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return res.status(400).json({
        error: "Please enter a valid URL."
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        error: "Only HTTP and HTTPS URLs are supported."
      });
    }

    const cleanUrl = parsedUrl.href;

    const chunks = [];
    const qrStream = qr.image(cleanUrl, { type: "png" });

    qrStream.on("data", chunk => chunks.push(chunk));

    qrStream.on("error", error => {
      console.error(error);

      if (!res.headersSent) {
        res.status(500).json({
          error: "Could not generate the QR code."
        });
      }
    });

    qrStream.on("end", async () => {
      try {
        const imageBuffer = Buffer.concat(chunks);

        await Promise.all([
          fs.writeFile("qr_img.png", imageBuffer),
          fs.writeFile("URL.txt", cleanUrl)
        ]);

        res.set("Content-Type", "image/png");
        res.send(imageBuffer);
      } catch (error) {
        console.error(error);

        if (!res.headersSent) {
          res.status(500).json({
            error: "Could not save the QR code."
          });
        }
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "An unexpected error occurred."
    });
  }
});

app.listen(PORT, () => {
  console.log(`QR Code Generator running at http://localhost:${PORT}`);
});
