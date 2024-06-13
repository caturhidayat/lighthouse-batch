import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";

const runLighthouseToHtml = async (website, outputPath) => {
    const browser = await puppeteer.launch({ headless: true });
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

const runLighthouseToJson = async (website) => {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const result = await lighthouse(website, {
            port: new URL(browser.wsEndpoint()).port,
            output: "json",
            logLevel: "info",
        });

        if (!result || !result.report) {
            throw new Error(`Report lighthouse not valid for url ${website}`);
        }

        const reportJson = JSON.parse(result.report)
        console.log(`Report for website ${website} was created`);
        return reportJson;
    } catch (error) {
        console.error(`Failed to create report for ${website}`, error);
        return null
    } finally {
        await browser.close();
    }
};

export { runLighthouseToHtml, runLighthouseToJson };
