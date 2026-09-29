require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const Comment = require("./models/Comment");
const ScrapeSession = require("./models/ScrapeSession");
const connectDB = require("./config/db");

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());


// ==================================================
// TEST API
// ==================================================

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API is working",
  });
});


// ==================================================
// DEMO COMMENTS
// ==================================================

app.get("/demo-comments", (req, res) => {
  res.send(`
    <html>
      <body>

        <div class="comment">
          <h3>John</h3>
          <p>Great product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>hn</h3>
          <p>Great product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>Jhn</h3>
          <p>Great product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>ohn</h3>
          <p>Great product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>Jon</h3>
          <p>Great product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>Joh</h3>
          <p>Grea product!</p>
          <span class="rating">5</span>
          <time class="date">2026-09-25</time>
        </div>

        <div class="comment">
          <h3>David</h3>
          <p>Very useful product.</p>
          <span class="rating">4</span>
          <time class="date">2026-09-24</time>
        </div>

        <div class="comment">
          <h3>Priya</h3>
          <p>Good quality and fast delivery.</p>
          <span class="rating">5</span>
          <time class="date">2026-09-23</time>
        </div>

      </body>
    </html>
  `);
});


// ==================================================
// SCRAPE API
// ==================================================

app.post("/api/scrape", async (req, res) => {
  console.log("\n=================================");
  console.log("✅ /api/scrape called");

  const { url } = req.body;

  console.log("📌 URL:", url);

  // --------------------------------------------------
  // Validate URL
  // --------------------------------------------------

  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL is required",
    });
  }

  try {

    // --------------------------------------------------
    // Fetch website
    // --------------------------------------------------

    console.log("🌐 Fetching website...");

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
      },
    });

    console.log("✅ Website fetched");
    console.log("📡 Status:", response.status);


    // --------------------------------------------------
    // Load HTML
    // --------------------------------------------------

    const $ = cheerio.load(response.data);

    console.log("✅ HTML loaded into Cheerio");


    // --------------------------------------------------
    // Extract comments
    // --------------------------------------------------

    const comments = [];

    $(".comment").each((index, element) => {
      const currentComment = $(element);

      const author = currentComment
        .find("h3")
        .text()
        .trim();

      const text = currentComment
        .find("p")
        .text()
        .trim();

      const ratingText = currentComment
        .find(".rating")
        .text()
        .trim();

      const date = currentComment
        .find(".date")
        .text()
        .trim();

      const rating = ratingText
        ? Number(ratingText)
        : null;

      comments.push({
        url,
        author,
        text,
        rating,
        date: date || null,
      });
    });


    console.log(
      "✅ Total comments extracted:",
      comments.length
    );


    // --------------------------------------------------
    // No comments found
    // --------------------------------------------------

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No comments found on this webpage",
      });
    }


    // --------------------------------------------------
    // Create scrape session
    // --------------------------------------------------

    console.log("💾 Creating scrape session...");

    const session = await ScrapeSession.create({
      url,
      commentCount: comments.length,
    });

    console.log(
      "✅ Scrape session created:",
      session._id
    );

    console.log(
      "🗄️ Database:",
      ScrapeSession.db.name
    );

    console.log(
      "📦 Collection:",
      ScrapeSession.collection.name
    );


    // --------------------------------------------------
    // Attach session ID to comments
    // --------------------------------------------------

    const commentsWithSession = comments.map(
      (comment) => ({
        ...comment,
        session: session._id,
      })
    );


    // --------------------------------------------------
    // Save comments
    // --------------------------------------------------

    console.log("💾 Saving comments...");

    await Comment.insertMany(commentsWithSession);

    console.log("✅ Comments saved to MongoDB");


    // --------------------------------------------------
    // Debug database
    // --------------------------------------------------

    const sessionCount =
      await ScrapeSession.countDocuments();

    const commentCount =
      await Comment.countDocuments();

    console.log(
      "📊 Total sessions:",
      sessionCount
    );

    console.log(
      "📊 Total comments:",
      commentCount
    );


    // --------------------------------------------------
    // Send response
    // --------------------------------------------------

    res.status(200).json({
      success: true,
      message: "Scraping completed successfully",

      sessionId: session._id,

      count: comments.length,

      saved: comments.length,

      comments: commentsWithSession,
    });

  } catch (error) {

    // --------------------------------------------------
    // Detailed error
    // --------------------------------------------------

    console.error("\n❌ SCRAPING FAILED");
    console.error("---------------------------------");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Code:", error.code);
    console.error("Stack:", error.stack);
    console.error("---------------------------------\n");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// SCRAPE HISTORY
// ==================================================

app.get("/api/scrapes", async (req, res) => {
  try {

    const sessions = await ScrapeSession.find()
      .sort({ createdAt: -1 });

    console.log("\n📚 SCRAPE HISTORY");
    console.log("---------------------------------");

    console.log(
      "🗄️ Database:",
      ScrapeSession.db.name
    );

    console.log(
      "📦 Collection:",
      ScrapeSession.collection.name
    );

    console.log(
      "📊 Session count:",
      sessions.length
    );


    res.status(200).json({
      success: true,

      database: ScrapeSession.db.name,

      collection: ScrapeSession.collection.name,

      count: sessions.length,

      sessions,
    });

  } catch (error) {

    console.error(
      "❌ Failed to fetch scrape history:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// GET COMMENTS FOR ONE SESSION
// ==================================================

app.get("/api/scrapes/:sessionId/comments", async (req, res) => {
  try {

    const { sessionId } = req.params;

    const comments = await Comment.find({
      session: sessionId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {

    console.error(
      "❌ Failed to fetch session comments:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// START SERVER
// ==================================================

const startServer = async () => {
  try {

    await connectDB();

    app.listen(5000, () => {
      console.log("\n=================================");
      console.log("🚀 Server running on port 5000");
      console.log("=================================\n");
    });

  } catch (error) {

    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();