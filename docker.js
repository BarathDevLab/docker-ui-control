const Docker = require("dockerode");
const express = require("express");
const cross = require("cors");
const path = require("path");
const app = express();
const docker = new Docker();
app.use(express.json());
app.use(cross({ origin: "*" }));

// Serve static HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/start", async (req, res) => {
  const { Container } = req.body;

  try {
    const containers = await docker.listContainers({ all: true });

    const target = containers.find((c) => c.Names[0] === `/${Container}`);

    if (!target) {
      res.status(404).send(`container ${Container} is not found`);
    }

    const con = docker.getContainer(target.Id);
    await con.start();
    res.status(200).send("container started");
  } catch (error) {
    res.status(500).send({
      message: `Error starting container ${Container}: ${error.message}`,
    });
  }
});

app.post("/stop", async (req, res) => {
  const { Container } = req.body;

  try {
    const containers = await docker.listContainers();

    const target = containers.find((c) => c.Names[0] === `/${Container}`);

    if (!target) {
      res.status(404).send(`container ${Container} is not found`);
    }

    const con = docker.getContainer(target.Id);
    await con.stop();
    res.status(200).send("container stop");
  } catch (error) {
    res.status(500).send({
      message: `Error stoping container ${Container}: ${error.message}`,
    });
  }
});

app.get("/list", async (req, res) => {
  try {
    const containers = await docker.listContainers({ all: true });
    res.status(200).send(containers);
  } catch (error) {
    res.status(500).send({
      message: `Error listing containers: ${error.message}`,
    });
  }
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
