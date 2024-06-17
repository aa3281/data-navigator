import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import logo from './logo.svg';
import './App.scss';
import FileUpload from './FileUpload';
import FileSearch from './fileSearch';

function App() {
  return (
    <BrowserRouter>
      
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/">File Upload</Link>
            </li>
            <li>
              <Link to="/file-search">File Search</Link>
            </li>
          </ul>
        </nav>
        <div className="App">
        <Routes>
          <Route exact path="/" element={<FileUpload />} />
          <Route path="/file-search" element={<FileSearch/>} />
          <Route path="*" element={<FileUpload/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
