const { JSDOM } = require('jsdom');

function normalizeURL(url) {
  const urlObj = new URL(url)
  let fullPath = `${urlObj.host}${urlObj.pathname}`
  if (fullPath.length > 0 && fullPath.slice(-1) === '/') {
    fullPath = fullPath.slice(0, -1)
  }
  return fullPath
}

function getURLsFromHTML(htmlBody, baseURL) {
  const { document } = new JSDOM(htmlBody).window;
  const urls = [];
  const anchors = document.querySelectorAll("a");

  for (const a of anchors) {
    try {
      let absURL;
      if (a.href.slice(0, 1) === "/") {
        absURL = new URL(a.href, baseURL).href;
      } else {
        absURL = new URL(a.href).href;
      }
      urls.push(absURL);
    } catch (err) {
      console.log(`${err.message}: ${a.href}`);
    }
  }
  return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
  const baseDomain = new URL(baseURL).hostname;
  const currentDomain = new URL(currentURL).hostname;
  if (baseDomain !== currentDomain) {
    return pages;
  }

  const currentNormalized = normalizeURL(currentURL);
  if (pages[currentNormalized] > 0) {
    pages[currentNormalized]++;
    return pages;
  }

  if (currentURL == baseURL) {
    pages[currentNormalized] = 0;
  } else {
    pages[currentNormalized] = 1;
  }

  console.log(`crawling ${currentURL} ...`);
  let htmlBody = ``;
  try {
    const response = await fetch(currentURL);
    if (response.status >= 400) {
      console.log(`http error, code: ${response.status}`);
      return pages
    }
    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log('not html');
      return pages;
    }
    htmlBody = await response.text();
  } catch (error) {
    console.log(`fetch error on ${currentDomain}: ${error.message}`);
  }

  const urls = getURLsFromHTML(htmlBody, baseURL);
  for (const url of urls) {
    await crawlPage(baseURL, url, pages);
  }

  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
}
