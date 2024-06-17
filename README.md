# DataNavigator
DataNavigator is a centralised platform designed to empower users with the ability to upload, manage, and search through PDF documents stored in Azure Blob Storage. This platform provides features to extract and parse document content, generate summaries, and perform natural language queries, enabling efficient and detailed information retrieval from a collection of documents.

# Demo and Screenshot
Here is a working live demo : https://datanavigator-71061.web.app/

![Upload File](/screenshots/1.png "Upload File Screen")

![Upload File](/screenshots/2.png "Successful Upload Screen")

![Upload File](/screenshots/3.png "Search File Screen")


# Key Features
- File upload to Azure Blob Container 
- Extract text from Uploaded PDF documents
- Parse the layout of the PDF document to determine sections 
- Generate text summary for each section
- List files stored in the Azure Blob Container
- Input a question/query against the data in the files (In progress)

# Roadmap
- [ ] Implement vector search for documents
- [ ] Integrate RAG pattern for enhanced search capabilities
- [ ] Improve UI/UX for better user interaction
- [ ] NLP chatbot that can answer questions based on the stored information
- [ ] Filter files based on the search query (show files that are relevant to query)
- [ ] Database/backend to store the generated summaries and fulltext
- [ ] Testing for other languages
- [ ] Security updates/hardening
  
# Development
Easily set up a local development environment!

1. Clone the repo `git clone git@github.com:aa3281/data-navigator.git`
2. Install the Yarn packages `yarn install`
3. Add your API keys and endpoints to `blobServiceTemplate.js` and `documentAnalysisTemplate.js`
4. Make sure that `fileSearch.js` and `fileUpload.js` are calling `blobServiceTemplate.js` and `documentAnalysisTemplate.js`
5. Run `yarn start`

# Built With
- Azure Blob Storage
- Azure AI Document Intelligence (Read Layout)
- Azure Language Services (Text Analyser)
- React
- Node
- Bootstrap

# Acknowledgements
- https://codepen.io/havardob/pen/mdPoYmY
- https://www.brandcolorcode.com/microsoft
