module.exports = getImageTags;

function getImageTags(data, fragments) {
  const imageIndicatorsArray = ["<picture", "<img", 'property="og:image"'];
  const imageIndicators = new RegExp(imageIndicatorsArray.join("|"));
  let imageTags = data.split(imageIndicators);
  // console.log({p: imageTags})
  imageTags = imageTags.reduce((arr, item, i) => {
    // console.log({ item });
    if (item) {
      let tempArr = item.split("http");
      if (tempArr[1]) {
        item = tempArr[1].split('"')[0];
        item = `http${item}`;
        item = item.trim();
        const specialExclusion = determineSpecialExclusion(item);
        item = item.split("?")[0];
        const isProperLink = item.split("/").length > 4;
        const isImage =
          item.includes(".jpg") ||
          item.includes(".png") ||
          item.includes(".jpeg") ||
          item.includes(".tiff") ||
          item.includes(".bmp") ||
          item.includes(".gif");
        const isNew = arr.indexOf(item) === -1;
        if (isProperLink && isImage && isNew && !specialExclusion) {
          arr.push(item);
        }
      }
    }

    return arr;
  }, []);

  return removeExcessImages(data, imageTags, fragments);
}

function determineSpecialExclusion(item) {
  if (item.includes("cdn.theatlantic.com") && item.includes("1500.jpg")) {
    return true;
  } else {
    return false;
  }
}

function removeExcessImages(data, imageTags, fragments) {
  const firstFragment = fragments[0];
  const lastFragment = fragments[fragments.length - 1];
  // console.log({ firstFragment, lastFragment });
  let relevantData = data.split(firstFragment)[1].split(lastFragment)[0];

  // console.log({relevantData})
  return imageTags.reduce((arr, item) => {
    if (relevantData.includes(item)) {
      // console.log({item})
      arr.push(item);
    }
    return arr;
  }, []);
}
