require("module-alias/register");

import express, { Request, Response } from "express";
import path from "path";
import { IConfig } from "./types";
import { existsSync, readFileSync } from "fs";
import { secureServer } from "./api/utils/server";

const configFilePath = path.join(__dirname, "config.json");
const config = require(configFilePath) as IConfig;

const privateKeyPath = `${process.cwd()}/.prv/arendtcert-open.key`;
const certificatePath = `${process.cwd()}/.prv/arendtcert.cert`;

process.env["clientkey"] = config.server.clientkey;

if (existsSync(privateKeyPath) && existsSync(certificatePath)) {
  try {
    config.server.options.key = readFileSync(privateKeyPath, "utf8");
    config.server.options.cert = readFileSync(certificatePath, "utf8");

    new secureServer(express(), config);
    
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message); //hello 1234
    }
  }

  // Do something with privateKey
} else {
  console.error(
    `Can't secure the connection without the certs: ${privateKeyPath}`
  );
}
