module.exports = getParas;

function getParas(data, identifier_words = {}) {
  // console.log({ identifier_words });
  let fragments = [];
  const textStartIndicatorsArray = ["<p", "<h"];
  const textStartIndicators = new RegExp(textStartIndicatorsArray.join("|"));
  const textEndIndicatorsArray = ["</p", "</h"];
  const textEndIndicators = new RegExp(textEndIndicatorsArray.join("|"));
  const headlines = getHeadlines(data, textEndIndicators);
  let items = data.split(textStartIndicators);

  items.shift();
  items.reverse();
  let triggeredEnd = false;
  let triggeredStart = false;

  let paras = items.reduce((array, item, i, arr) => {
    item = item.split(textEndIndicators)[0];
    item = stripHtmlTags(item);
    // if (isFinishingPara(item)) {
    //   console.log("is finishing para");
    //   triggeredStart = true;
    //   arr.splice(1); // ejects early
    // }
    if (!triggeredEnd) {
      if (item.includes(identifier_words.end_words)) {
        triggeredEnd = true;
      }
    }

    if (triggeredEnd && !triggeredStart) {
      const { includePara, fragment } = includeParaFunc(item, data);
      if (includePara) {
        if (headlines.indexOf(item) > -1) {
          item = `<b>${item}`;
        }
        array.push(item);
        fragments.push(fragment);
      } else {
        // console.log({ item });
      }
    }

    if (!triggeredStart) {
      if (item.includes(identifier_words.start_words)) {
        triggeredStart = true;
        arr.splice(1); // ejects early
      }
    }
    return array;
  }, []);

  paras.reverse();
  // console.log({ paras });

  return { paras, fragments };
}

function getHeadlines(data, textEndIndicators) {
  let headlines = data.split("<h");
  headlines.shift();
  return headlines.reduce((array, item) => {
    item = item.split(textEndIndicators)[0];
    item = stripHtmlTags(item);
    array.push(item);
    return array;
  }, []);
}

function stripHtmlTags(item) {
  let itemArray = item.split("<");
  itemArray = itemArray.reduce((arr, k) => {
    k = k.split(">")[1];
    arr.push(k);
    return arr;
  }, []);

  item = itemArray.join("");
  return item;
}

function isFinishingPara(para) {
  const finishingParas = [
    "We want to hear what you think about this article. Submit a letter to the editor or write to letters@theatlantic.com.",
    "Previous in Issue",
    "Follow us here and subscribe here for all the latest news on how you can keep Thriving.",
  ];
  if (finishingParas.indexOf(para) > -1) {
    return true;
  }
  return false;
}

function includeParaFunc(para, data) {
  // if (para=)
  // const linkArray = para.split(linkTextIndicators);
  const paraArray = para.split(" ");
  const paraWordCount = paraArray.length;
  const threshold = Math.min(4, paraWordCount);
  const iteratorArray = Array.from(
    Array(Math.max(0, paraWordCount - threshold)).keys()
  );

  const excludedParas = [
    "Skip to the next and previous photo by typing j/k or ←/→.",
    "Latest Issue",
    "Past Issues",
  ];

  const isExcludedPara = excludedParas.indexOf(para) > -1;

  let fragmentIncluded = false;
  let fragment;
  const sufficientLength = paraWordCount > 2;
  if (sufficientLength) {
    fragmentIncluded = iteratorArray.slice(0).reduce((bool, item, i, arr) => {
      // console.log({i})
      if (bool === true) {
        arr.splice(1); // ejects early
      } else {
        const fragmentArray = paraArray.slice(i, i + threshold);
        if (fragmentArray.length === threshold) {
          const fragmentText = paraArray.slice(i, i + threshold).join(" ");
          bool = data.includes(fragmentText);
          fragment = fragmentText;
        }
      }
      return bool;
    }, false);
  }

  const includePara =
    sufficientLength &&
    !isExcludedPara &&
    !isBogusPara(para) &&
    (fragmentIncluded || data.includes(para));

  return { includePara, fragment };
}

function isBogusPara(item) {
  if (item.split("\n").length > 3) {
    return true;
  } else {
    return false;
  }
}
