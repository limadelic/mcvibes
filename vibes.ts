#!/usr/bin/env node

import * as tcr from "./tcr.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

async function run() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  app.post("/tools/list", (req, res) => {
    res.json({
      id: req.body.id,
      result: { tools: [tcr.def] },
    });
  });

  app.post("/tools/call", async (req, res) => {
    const id = req.body.id;
    const args = req.body.params.arguments;
    const result = await tcr.run(args);
    res.json({ id, result });
  });

  const port = 3000;
  app.listen(port, () => {});

  process.on("SIGINT", () => {
    process.exit(0);
  });
}

run();
