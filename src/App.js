import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import Header from "./components/Header";
import Button from "./components/Button";
import UserProfileWindow from "./components/UserProfileWindow";
import ReposList from "./components/ReposList";

const CLIENT_ID = "2e7940c77b22ef261b29";

function App() {
  const [rerender, SetRerender] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [allRepos, setAllRepos] = useState({});

  useEffect(() => { // используется для проверки - получен ли код
    const urlWithCode = window.location.search;
    const urlParams = new URLSearchParams(urlWithCode);
    const code = urlParams.get("code");
    console.log(code);

    // localStorage
    if(code && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        const res = await fetch(`http://localhost:4000/getAccessToken?code=${code}`, {
          method: "GET", // GET is default method tho
        })
        
        const data = await res.json();
        console.log(data);
        if(data.access_token) localStorage.setItem("accessToken", data.access_token);
        SetRerender(!rerender);
      }
      getAccessToken();
    }
  }, []);

  async function getUserProfile() {
    const res = await fetch("http://localhost:4000/getUserProfile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      }
    })
    
    const data = await res.json();
    console.log(data);
    setUserProfile(data);
  };

  async function getReposCards() {
    const res = await fetch("http://localhost:4000/getUserRepos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })

    const data = await res.json();
    console.log(data);
    setAllRepos(data);
  }

  function githubOauth() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo&per_page=1000`);
  };

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ?
        <div className="main-container">
          <Button text="Log Out" onClick={() => {localStorage.removeItem("accessToken"); SetRerender(!rerender)}} />
          <Button text="User Info" onClick={getUserProfile} />
          <Header login={userProfile.login} />
          <UserProfileWindow userProfile={userProfile}  />

          <Button text="Show Repos" onClick={getReposCards} />
          {Object.keys(allRepos).length > 0 && <ReposList allRepos={allRepos} />}
        </div>  
        :
        <>
          <h3>User is not Logged in</h3>
          <button onClick={githubOauth}>Login via GitHub</button>
        </>
      }
      </header>
    </div>
  );
}

export default App;
