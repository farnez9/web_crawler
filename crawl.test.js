const { normalizeURL, getURLsFromHTML } = require("./crawl.js")
const { test, expect } = require("@jest/globals")

test("normalizeURL protocol", () => {
  const input = "https://blog.boot.dev/path"
  const actual = normalizeURL(input)
  const expected = "blog.boot.dev/path"
  expect(actual).toEqual(expected)
})

test("normalizeURL slash", () => {
  const input = "https://blog.boot.dev/path/"
  const actual = normalizeURL(input)
  const expected = "blog.boot.dev/path"
  expect(actual).toEqual(expected)
})

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path"
  const actual = normalizeURL(input)
  const expected = "blog.boot.dev/path"
  expect(actual).toEqual(expected)
})

test("normalizeURL http", () => {
  const input = "http://BLOG.boot.dev/path"
  const actual = normalizeURL(input)
  const expected = "blog.boot.dev/path"
  expect(actual).toEqual(expected)
})


// getURLsFromHTML

test("single anchor tag", () => {
  const input = `<!DOCTYPE html><body><a href="/farnez.html">Link</a></body>`;
  const actual = getURLsFromHTML(input, "https://example.com");
  const expected = ["https://example.com/farnez.html"]
  expect(actual).toEqual(expected);
})

test("multiple anchor tags", () => {
  const input = `<!DOCTYPE html><body><a href="/farnez.html">Link</a>
  <a href="/js.html">Link</a>
  </body>`;

  const actual = getURLsFromHTML(input, "https://email.com");
  const expected = [
    "https://email.com/farnez.html",
    "https://email.com/js.html",
  ];
  expect(actual).toEqual(expected);
})

test("both case", () => {
  const input = `<a href="/new/path">Link</a><a href="https://new_test.com/v1/check">Link</a>`;
  const actual = getURLsFromHTML(input, "https://example.com");
  const expected = ["https://example.com/new/path", "https://new_test.com/v1/check"];
  expect(actual).toEqual(expected);
})

test("handle exception", () => {
  const input = `<!DOCTYPE html><body><a href="new/path">Link</a></body>`;
  const actual = getURLsFromHTML(input, "https://example.com");
  const expected = []
  expect(actual).toEqual(expected);
})