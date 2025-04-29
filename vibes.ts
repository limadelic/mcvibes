#!/usr/bin/env node

import * as tcr from "./tcr";
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
    const { arguments: args } = req.body.params;

    const result = await tcr.run(args);
    res.json({
      id: req.body.id,
      result,
    });
  });

  const port = 3000;
  app.listen(port, () => {
    console.log("MC Vibes in the house! Let's break some code down!");
  });

  process.on("SIGINT", () => {
    console.log("MC Vibes has left the building! Peace out!");
    process.exit(0);
  });
}

run();
