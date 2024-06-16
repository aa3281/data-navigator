import logo from './logo.svg';
import './App.scss';
import FileUpload from './FileUpload';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Upload PDF to Azure Blob Storage</h1>
        <p>Description of how to use the app</p>
        <FileUpload />
      </header>
    </div>
  );
}

export default App;
