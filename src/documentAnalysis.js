const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

function* getTextOfSpans(content, spans) {
    for (const span of spans) {
        yield content.slice(span.offset, span.offset + span.length);
    }
}

/*
  Remember to remove the key from your code when you're done, and never post it publicly. For production, use
  secure methods to store and access your credentials. For more information, see 
  https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
*/
const endpoint = "https://cwb-ai-document-intelligence.cognitiveservices.azure.com/";
const key = "474b149a54d242c19dd6a711867986de";

async function main(fileUrl) {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginAnalyzeDocument("prebuilt-layout", fileUrl);

    const { content, pages, paragraphs } = await poller.pollUntilDone();

    if (!pages || pages.length <= 0) {
        throw new Error("No pages were extracted from the document.");
    }

    // const fullText = pages.map(page => page.lines.map(line => line.content).join("\n")).join("\n\n");
    let fullText = "";
    let sections = [];
    let currentSection = { title: "", content: "" };

    paragraphs.forEach(paragraph => {
        const role = paragraph.role || "text";
        if (role === "title" || role === "sectionHeading") {
            if (currentSection.content) {
                sections.push(currentSection);
            }
            currentSection = { title: paragraph.content, content: "" };
        } else {
            currentSection.content += `${paragraph.content}\n`;
        }
    });

    if (currentSection.content) {
        sections.push(currentSection);
    
    }
    sections.forEach(section => {
        fullText += `<h2>${section.title}</h2>\n${section.content}\n`;
    });

    // const summaryText = fullText.substring(0, 200) + "..."; // Example summary: first 200 characters
    // const summaryText = sections.map(section => section.content.substring(0, 200) + "...").join("\n");
    const summaryText = sections.map(section => `<strong>${section.title}</strong>\n<br/>${section.content.substring(0, 200)}...<br/><br/>`).join("\n\n");

    return { summaryText, fullText };
}

module.exports = main;