import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

/**
 * Filter Image API
 * - [x] validate the image_url query
 * - [x] call filterImageFromURL(image_url) to filter the image
 * - [x] send the resulting file in the response
 * - [x] deletes any files on the server on finish of the response
 */
app.get("/filteredimage", async (req, res) => {
  const { image_url: imageURL } = req.query;

  try {
    new URL(imageURL);
  } catch (err) {
    res.status(422);
    res.send(err.message);
    return;
  }

  let filteredImagePath;

  try {
    filteredImagePath = await filterImageFromURL(imageURL);
  } catch (err) {
    res.status(422);
    res.send(`Invalid Image - ${err.message}`);
    return;
  }

  res.sendFile(filteredImagePath, () => {
    deleteLocalFiles([filteredImagePath]);
  });
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
