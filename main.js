const { crawlPage } = require("./crawl.js");

async function main() {
    const args = process.argv;
    if (args.length > 3) {
        console.log("too many args");
        process.exit(1);
    } else if (args.length < 3) {
        console.log("no url provided");
        process.exit(2);
    }

    const baseURL = args[2];

    const pages = await crawlPage(baseURL, baseURL, {});
    console.log(pages);
}

main();