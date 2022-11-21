import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import Header from "./components/Header";
import Button from "./components/Button";
import UserProfileWindow from "./components/UserProfileWindow";
import ReposList from "./components/ReposList";

const CLIENT_ID = "2e7940c77b22ef261b29";

function App() {
  
  const [rerender, setRerender] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [allRepos, setAllRepos] = useState({});
  const [visible, setVisible] = useState(localStorage.getItem("pagesCache") ? Number(localStorage.getItem("pagesCache")) : 6);
  
  function githubOauth() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo&per_page=1000`);
  };

  const checkAccessToken = () => {
    const urlWithCode = window.location.search;
    const urlParams = new URLSearchParams(urlWithCode);
    const code = urlParams.get("code");
    if(code && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        const res = await fetch(`http://localhost:4000/getAccessToken?code=${code}`, {
          method: "GET", // GET is default method tho
        })
        const data = await res.json();
        localStorage.setItem("accessToken", data.access_token);
        setRerender(!rerender);
      }
      getAccessToken();
    }
  }

  const addToCache = (cacheName, url, res) => { 
    const data = new Response(JSON.stringify(res));
    caches.open(cacheName).then((cache) => {
    cache.put(url, data);
    });
  };
  
  const getFromCache = async (cacheName, url) => {
    if (!(await caches.has(cacheName))) return;
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url);
    const data = await cachedResponse.json();
    console.log(data)
    cacheName === "User Profile" ? setUserProfile(data) : setAllRepos(data);
  };

  useEffect(() => { 
    checkAccessToken();
	  getFromCache('User Profile','https://localhost:3000');
	  getFromCache('User Repos','https://localhost:3000');
  }, []);

  const clearCache = async () => {
    const allCache = await caches.keys();
    allCache.forEach(cache => caches.delete(cache));
  }

  const logOutBtnLogic = () => {
    clearCache();
    localStorage.clear();
    setRerender(!rerender);
  }

  async function getUserProfile() {
    if (Object.keys(userProfile).length > 0) return;
    const res = await fetch("http://localhost:4000/getUserProfile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      }
    })
    const data = await res.json();
    setUserProfile(data);
    addToCache('User Profile', 'https://localhost:3000', data);
    getFromCache('User Profile', 'https://localhost:3000');
  };

  async function getReposCards() {
    if (localStorage.getItem("pagesCache")) return;
    const res = await fetch("http://localhost:4000/getUserRepos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
    const data = await res.json();
    localStorage.setItem("pagesCache", 6);
    addToCache('User Repos', 'https://localhost:3000', data);
    setAllRepos(data);
  }

  const showMoreRepos = async () => { // Pagination
    setVisible((prevValue) => {
      localStorage.setItem("pagesCache", prevValue + 6);
      return prevValue + 6;
    });
  };
  
  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") !== "undefined" && localStorage.getItem("accessToken") ?
        <div className="main-container">
          <div className="navbar">
            <Button className="btn logout" text="Log Out" onClick={logOutBtnLogic} />
            <Button className="btn info" text="User Info" onClick={getUserProfile} />
            <Button className="btn show-repos" text="Show Repos" onClick={getReposCards} />
          </div>
          <Header login={userProfile.login} />
          {<UserProfileWindow userProfile={userProfile} />}
          {Object.keys(allRepos).length > 0 && <ReposList visibleRepos={visible} allRepos={allRepos} showMore={showMoreRepos} />}
        </div> 
        :
        <h3><Button className="btn login" text="Login via GitHub" onClick={() => {logOutBtnLogic(); githubOauth()}} />, to see the stats</h3>
      }
      </header>
    </div>
  );
}

export default App;
