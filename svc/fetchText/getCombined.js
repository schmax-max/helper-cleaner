module.exports = getCombined;

const getParas = require("./getParas");
const getImageTags = require("./getImageTags");

function getCombined(data, identifier_words) {
  const { paras, fragments } = getParas(data, identifier_words);
  // console.log({ paras, fragments });
  const imageTags = getImageTags(data, fragments);
  // console.log({ imageTags });
  const input = { data, paras, fragments, imageTags };
  const combined = cycleThroughContent(input);
  const formattedText = combined.join("\n\n");
  return formattedText;
}

function cycleThroughContent(input, combined = []) {
  const { data, paras, fragments, imageTags } = input;
  // console.log('starting cycleThroughContent')
  // console.log({i: imageTags.length, p: paras.length})
  const nextImageTag = imageTags[0];
  const nextPara = paras[0];
  const nextFragment = fragments[0];
  let pickText = false;
  if (paras.length !== fragments.length) {
    console.log("error with fragments and paras");
  }
  if (nextFragment !== undefined) {
    pickText = pickItem(data, nextFragment, nextImageTag);
  }

  const pickImage = pickItem(data, nextImageTag, nextPara);
  // console.log({pickText, pickImage})

  if (paras.length === 0 && imageTags.length === 0) {
    return combined;
  } else if (pickText) {
    return handleTextPick(input, combined, nextPara);
  } else if (pickImage) {
    return handleImagePick(input, combined, nextImageTag);
  } else {
    // console.log("running back-up case");
    if (paras.length === 0) {
      return handleImagePick(input, combined, nextImageTag);
    } else {
      return handleTextPick(input, combined, nextPara);
    }
  }
}

function handleTextPick(input, combined, nextPara) {
  if (nextPara.length > 20) {
    combined.push(nextPara);
  }
  input.paras.shift();
  input.fragments.shift();
  return cycleThroughContent(input, combined);
}

function handleImagePick(input, combined, nextImageTag) {
  const imageUrl = getImageUrl(nextImageTag);
  if (imageUrl) {
    combined.push(imageUrl);
  }
  input.imageTags.shift();
  return cycleThroughContent(input, combined);
}

function getImageUrl(nextImageTag) {
  const arr = nextImageTag.split('"');
  return arr.reduce((str, item) => {
    if (!str) {
      str = item;
    }
    return str;
  }, undefined);
}

function pickItem(data, nextItem, nextOtherItem) {
  // const data = data
  let pickThisItem = false;
  if (nextOtherItem === undefined) {
    pickThisItem = true;
  } else if (nextItem !== undefined) {
    const nextItemSplit = data.split(nextItem)[0];
    const pickOtherItem = nextItemSplit.includes(nextOtherItem);
    pickThisItem = !pickOtherItem;
  }
  return pickThisItem;
}
