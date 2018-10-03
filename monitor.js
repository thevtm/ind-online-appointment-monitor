#!/bin/node

"use strict";

const _ = require("lodash");
const fetch = require("node-fetch");
const opn = require("opn");

const IND_APPOINTEMENT_DATES_DATA_URL = "https://portal.ind.nl/oap/api/desks/RO/slots/?productKey=DOC&persons=1";
const IND_APPOINTEMENT_PAGE = "https://portal.ind.nl/oap/en/#/DOC";

(async function () {
  let current_appointment_date = process.argv[2];
  console.dir(current_appointment_date);

  while (true) {
    try {
      const latest = await fetch_earliest_appointement();

      if (Date.parse(latest.date) < Date.parse(current_appointment_date)) {
        console.dir("New best date!");
        console.dir(latest);

        // opens the url in the default browser
        opn(IND_APPOINTEMENT_PAGE);
        return;
      }
    } catch (err) {
      console.error("Error looping", err);
    }

    await sleep(15000);
  }
})();

async function fetch_earliest_appointement () {
  const GARBAGE_CHAR_COUNT = 5;

  const resp = await fetch(IND_APPOINTEMENT_DATES_DATA_URL);
  let data = JSON.parse((await resp.text()).substring(5)).data;

  return _.minBy(data, (el) => Date.parse(el.date));
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
