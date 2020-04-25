const axios = require("axios");
const unfluff = require("unfluff");
const getCombined = require("./getCombined");

module.exports = fetchText;

const url = "https:/www.worldblu.com/summit2020";
// "https://www.theguardian.com/environment/2015/jul/24/the-9-green-policies-killed-off-by-tory-government";

// fetchText(url);

function fetchText(url) {
  if (url[0] === "?") {
    url = url.split("?")[1];
  }
  if (!url.includes("://")) {
    url = url.replace(":/", "://");
  }

  console.log("starting fetchText");
  // console.log({text_content})
  console.log({ url });
  return axios({ method: "get", url })
    .then(({ data }) => {
      try {
        const identifier_words = getIdentifierWords(data);
        if (data.includes('"<body"')) data = data.split("<body")[1];
        // console.log({ data });
        return getCombined(data, identifier_words);
      } catch (err) {
        console.log({ err });
        return;
      }
    })
    .catch((err) => {
      console.log("error with fetchText");
      console.log({ err });
      return null;
    });
}

function getIdentifierWords(data) {
  const { text } = unfluff(data);
  const paras = text.split("\n");
  return {
    start_words: getInitialWords(paras[0], 7),
    end_words: getInitialWords(paras[paras.length - 1], 7),
  };
}

function getInitialWords(para, count) {
  const words = para.split(" ");
  const wordArrays = words.slice(0, count);
  return wordArrays.join(" ");
}
