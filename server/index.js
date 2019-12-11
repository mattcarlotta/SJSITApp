/* eslint-disable no-console */
import express from "express";
import openBrowser from "react-dev-utils/openBrowser";

const fs = require("fs");

const {
  APIPORT, HOST, NODE_ENV, CLIENT,
} = process.env;

//= ===========================================================//
// CREATE EXPRESS SERVER                                       //
//= ===========================================================//

export default app => {
  const currentDirectory = process.cwd();
  const inProduction = NODE_ENV === "production" || NODE_ENV === "staging";

  //= ===========================================================//
  // PRODUCTION CONFIG                                           //
  //= ===========================================================//
  if (inProduction) {
    const clientFolder = `${currentDirectory}/client/dist`;
    const fallbackFolder = `${currentDirectory}/public`;

    app.use(express.static(clientFolder), express.static(fallbackFolder));

    app.get("*", async (req, res) => {
      let serveFolder;
      try {
        await fs.promises.access(clientFolder, fs.constants.R_OK);
        serveFolder = clientFolder;
      } catch (e) {
        serveFolder = fallbackFolder;
      } finally {
        serveFolder !== clientFolder && req.url !== "/"
          ? res.redirect("/")
          : res.sendFile(`${serveFolder}/index.html`);
      }
    });
  }

  app.listen(APIPORT, err => {
    if (!err) {
      const API = `${HOST}${APIPORT}`;
      if (inProduction) {
        console.log(
          `\nYour client application is running on \x1b[1m${CLIENT}\x1b[0m`,
        );
        console.log(`Your API is running on \x1b[1m${API}\x1b[0m\n`);
        openBrowser(API);
      }
    } else {
      console.err(`\nUnable to start server: ${err}`);
    }
  });
};
