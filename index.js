import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync } from "fs";
import { URL } from "url";

// Read Website from file
const readWebsiteFromFile = (pathFile) => {
    try {
        const textFile = readFileSync(pathFile, "utf-8");
        const url = textFile
            .split("\n")
            .map((line) => line.trim())
            .filter((url) => url);
        console.log(url);
        return url;
    } catch (error) {
        console.error("Failed to read file!");
    }
};

// Check valid URL
const isValid = (stringUrl) => {
    try {
        new URL(stringUrl)
        return true
    } catch (error) {
        return false;
    }
}

// Run Lighthouse tool
const runLighthouse = async (website, outputPath) => {
    const browser = await puppeteer.launch({ headless: true, });
    try {
        const result = await lighthouse(website, {
            port: new URL(browser.wsEndpoint()).port,
            output: "html",
            logLevel: "info",
        });

        if (!result || !result.report) {
            throw new Error(`Report lighthouse not valid for url ${website}`);
        }

        writeFileSync(outputPath, result.report, "utf-8");
        console.log(`Report for website ${website} saved in ${outputPath}`);
    } catch (error) {
        console.error(`Failed to create report for ${website}`, error);
    } finally {
        await browser.close();
    }
};

const main = async () => {
    const websites = readWebsiteFromFile("./websites.txt");
    if (websites.length === 0) {
        console.error(`Does not any found website in file`);
        return;
    }

    for (let website of websites) {
        if(!isValid(website)) {
            console.log(`URL is not valid!`)
            continue;
        }
        console.log(`Proceed ${website}`);
        console.log(3, website)
        const outputDir = `./reports/${website
            .replace(/https?:\/\//, "")
            .replace(/\//g, "_")}.html`;
        await runLighthouse(website, outputDir);
    }
};

main();
