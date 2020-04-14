"use strict";
const moment = require("moment");
const _ = require("lodash");
const { validateReq } = require("./validateReq");
const fetchText = require("./fetchText");

module.exports = { master, commander };

async function master(req) {
  if (validateReq(req)) {
    return await commander(req.body);
  } else {
    return;
  }
}

async function commander({ url }) {
  // console.log(`starting helper-date for ${url}`)
  try {
    return await fetchText(url);
  } catch (err) {
    return;
  }
}
