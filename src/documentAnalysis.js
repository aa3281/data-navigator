// const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

// function* getTextOfSpans(content, spans) {
//     for (const span of spans) {
//         yield content.slice(span.offset, span.offset + span.length);
//     }
// }

// /*
//   Remember to remove the key from your code when you're done, and never post it publicly. For production, use
//   secure methods to store and access your credentials. For more information, see 
//   https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-security?tabs=command-line%2Ccsharp#environment-variables-and-application-configuration
// */
// const endpoint = "https://cwb-ai-document-intelligence.cognitiveservices.azure.com/";
// const key = "474b149a54d242c19dd6a711867986de";

// async function main(fileUrl) {
//     const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
//     const poller = await client.beginAnalyzeDocument("prebuilt-layout", fileUrl);

//     const { content, pages, paragraphs } = await poller.pollUntilDone();

//     if (!pages || pages.length <= 0) {
//         throw new Error("No pages were extracted from the document.");
//     }

//     // const fullText = pages.map(page => page.lines.map(line => line.content).join("\n")).join("\n\n");
//     let fullText = "";
//     let sections = [];
//     let currentSection = { title: "", content: "" };

//     paragraphs.forEach(paragraph => {
//         const role = paragraph.role || "text";
//         if (role === "title" || role === "sectionHeading") {
//             if (currentSection.content) {
//                 sections.push(currentSection);
//             }
//             currentSection = { title: paragraph.content, content: "" };
//         } else {
//             currentSection.content += `${paragraph.content}\n`;
//         }
//     });

//     if (currentSection.content) {
//         sections.push(currentSection);
    
//     }
//     sections.forEach(section => {
//         fullText += `<h2>${section.title}</h2>\n${section.content}\n`;
//     });

//     // const summaryText = fullText.substring(0, 200) + "..."; // Example summary: first 200 characters
//     // const summaryText = sections.map(section => section.content.substring(0, 200) + "...").join("\n");
//     const summaryText = sections.map(section => `<strong>${section.title}</strong>\n<br/>${section.content.substring(0, 200)}...<br/><br/>`).join("\n\n");

//     return { summaryText, fullText };
// }

// module.exports = main;

const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
const { TextAnalysisClient } = require("@azure/ai-language-text");

// Replace these values with your actual endpoint and key
const documentEndpoint = "https://cwb-ai-document-intelligence.cognitiveservices.azure.com/";
const documentKey = "474b149a54d242c19dd6a711867986de";
const textEndpoint = `https://text-summarization-question-answer.cognitiveservices.azure.com/`;
const textKey = `b83e465e03904e07ae98cd730e88eca8`;

async function analyzeDocument(fileUrl) {
    const client = new DocumentAnalysisClient(documentEndpoint, new AzureKeyCredential(documentKey));
    const poller = await client.beginAnalyzeDocument("prebuilt-layout", fileUrl);

    const { content, pages, paragraphs } = await poller.pollUntilDone();

    if (!pages || pages.length <= 0) {
        throw new Error("No pages were extracted from the document.");
    }

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

    return { sections, fullText };
}

async function summarizeSections(sections) {
    const client = new TextAnalysisClient(textEndpoint, new AzureKeyCredential(textKey));
    const actions = [
        {
            kind: "ExtractiveSummarization",
            maxSentenceCount: 2,
        },
    ];

    const summaries = [];

    for (const section of sections) {
        const documents = [section.content];
        const poller = await client.beginAnalyzeBatch(actions, documents, "en");

        const results = await poller.pollUntilDone();

        for await (const actionResult of results) {
            if (actionResult.kind !== "ExtractiveSummarization") {
                throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
            }
            if (actionResult.error) {
                const { code, message } = actionResult.error;
                throw new Error(`Unexpected error (${code}): ${message}`);
            }
            for (const result of actionResult.results) {
                if (result.error) {
                    const { code, message } = result.error;
                    throw new Error(`Unexpected error (${code}): ${message}`);
                }
                summaries.push(`<strong>${section.title}</strong>\n<br/>${result.sentences.map(sentence => sentence.text).join(" ")}<br/><br/>`);
            }
        }
    }

    return summaries.join("\n\n");
}

async function main(fileUrl) {
    const { sections, fullText } = await analyzeDocument(fileUrl);
    const summaryText = await summarizeSections(sections);

    return { summaryText, fullText };
}

module.exports = main;
