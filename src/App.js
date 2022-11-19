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
  const [visible, setVisible] = useState(6);
  const [visibleUserProfile, setVisibleUserProfile] = useState(false);
  
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
    // if (localStorage.getItem("visibleUserProfile")) return;
    console.log('render!');
    const res = await fetch("http://localhost:4000/getUserProfile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      }
    })
    const data = await res.json();
    setUserProfile(data);
    // setVisibleUserProfile(true);
    // localStorage.setItem("visibleUserProfile", true);
  };

  async function getReposCards() {
    // console.log(localStorage.getItem("pagesCache"));
    // if (localStorage.getItem("pagesCache") > 0) return;
    const res = await fetch("http://localhost:4000/getUserRepos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    const data = await res.json();
    // localStorage.setItem("pagesCache", visible);
    setAllRepos(data);
  }

  function githubOauth() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo&per_page=1000`);
  };

  const showMoreRepos = () => { // Pagination
    setVisible((prevValue) => prevValue + 6);
    localStorage.setItem("pagesCache", visible);
  };

  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") ?
        <div className="main-container">
          <div className="navbar">
            <Button className="btn logout" text="Log Out" onClick={() => {localStorage.clear(); SetRerender(!rerender)}} />
            <Button className="btn info" text="User Info" onClick={getUserProfile} />
            <Button className="btn show-repos" text="Show Repos" onClick={getReposCards} />
          </div>
          <Header login={userProfile.login} />
          {<UserProfileWindow userProfile={userProfile} />}

          {Object.keys(allRepos).length > 0 
          && <ReposList visibleRepos={visible} allRepos={allRepos} showMore={showMoreRepos} />}
          
        </div>  
        :
        <>
          <h3><Button className="btn login" text="Login via GitHub" onClick={githubOauth} />, to see the stats</h3>
        </>
      }
      </header>
    </div>
  );
}

export default App;
