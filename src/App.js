import logo from './logo.svg';
import './App.scss';
import FileUpload from './FileUpload';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>DataNavigator</h1>
        <p>
          Upload your PDF documents to Azure Blob Storage and leverage Azure AI services to extract text and summarise documents effortlessly.
        </p>
      </header>
      <FileUpload />
    </div>
  );
}

export default App;
