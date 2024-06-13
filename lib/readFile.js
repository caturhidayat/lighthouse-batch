import { readFileSync } from "fs";

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

export { readWebsiteFromFile };
