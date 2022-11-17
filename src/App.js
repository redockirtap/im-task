import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

const CLIENT_ID = "2e7940c77b22ef261b29";

function App() {

  useEffect(() => { // используется для проверки - получен ли код
    const urlWithCode = window.location.search;
    const urlParams = new URLSearchParams(urlWithCode);
    const code = urlParams.get("code");
    console.log(code);
  }, []);

  function githubOauth() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`);
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={githubOauth}>Login via GitHub</button>
      </header>
    </div>
  );
}

export default App;
