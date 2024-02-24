// sorts the pages with the largest number of links first, return [url, linksCount] array
function sortPagesByMostLinks(pages) {
    const pagesLinksArray = Object.entries(pages);
    const sortedPages = pagesLinksArray.sort(([, a], [, b]) => b - a);
    return sortedPages;
}

function printReport(pages) {
    console.log("\n\n********* REPORT **********\n");

    const sortedPagesArr = sortPagesByMostLinks(pages);
    for (const page of sortedPagesArr) {
        console.log(`Found ${page[1]} internal links to ${page[0]}`);
    }
}

module.exports = {
    printReport
}