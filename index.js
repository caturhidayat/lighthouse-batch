import { readFileSync } from "fs";
import { URL } from "url";
import {
    runLighthouseToJson,
    runLighthouseToHtml,
} from "./lib/runLighthouse.js";
import { readWebsiteFromFile } from "./lib/readFile.js";
import * as xlsx from "xlsx";

// Check valid URL
const isValid = (stringUrl) => {
    try {
        new URL(stringUrl);
        return true;
    } catch (error) {
        return false;
    }
};

const main = async () => {
    const websites = readWebsiteFromFile("./websites.txt");
    if (websites.length === 0) {
        console.error(`Does not any found website in file`);
        return;
    }

    const result = [];

    for (let website of websites) {
        if (!isValid(website)) {
            console.log(`URL is not valid!`);
            continue;
        }
        console.log(`Proceed ${website}`);

        // const outputDir = `./reports/${website
        //     .replace(/https?:\/\//, "")
        //     .replace(/\//g, "_")}.html`;
        // await runLighthouseToHtml(website, outputDir);

        const report = await runLighthouseToJson(website);
        // console.log(report);
        const perf = report.categories.performance.score * 100;
        const acce = report.categories.accessibility.score * 100;
        const bp = report.categories["best-practices"].score * 100;
        const seo = report.categories.seo.score * 100;
        if (report) {
            result.push({
                url: website,
                performance: perf,
                accessibility: acce,
                bestPractices: bp,
                seo: seo,
            });
        }

        // if (report) {
        //     result.push({
        //         url: website,
        //         performance: report.categories.performance.score,
        //         accessibility: report.categories.accessibility.score,
        //         bestPractices: report.categories["best-practices"].score,
        //         seo: report.categories.seo.score
        //     });
        // }
    }
    // console.log(result);

    // Write report to File Excel
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(result);
    xlsx.utils.book_append_sheet(workbook, worksheet, "Lighthouse Reports");
    xlsx.writeFile(workbook, "./reports/lighthouse_reports.xlsx");
    console.log("Report saved in lighthouse_reports.xlsx file!");
};

main();
