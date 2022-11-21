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
  
  useEffect(() => { 
    const urlWithCode = window.location.search;
    const urlParams = new URLSearchParams(urlWithCode);
    const code = urlParams.get("code");

    // Requesting access token
    if(code && localStorage.getItem("accessToken") === null) {
      async function getAccessToken() {
        const res = await fetch(`http://localhost:4000/getAccessToken?code=${code}`, {
          method: "GET", // GET is default method tho
        })
        
        const data = await res.json();
        localStorage.setItem("accessToken", data.access_token);
        SetRerender(!rerender);
      }
      getAccessToken();
    }
  }, []);

  const addToCache = (cacheName, url, res) => { 
    const data = new Response(JSON.stringify(res));
    caches.open(cacheName).then((cache) => {
    cache.put(url, data);
    alert('Data Added into cache!')
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

  const clearCache = async () => {
    const allCache = await caches.keys();
    allCache.forEach(cache => caches.delete(cache));
  }

  const logOutBtnLogic = () => {
    clearCache();
    localStorage.clear();
    SetRerender(!rerender);
  }

  // const getFromCache = async () => {
    
  //   const url = 'https://localhost:3000'
  //   const cacheName = await caches.keys()
  //   cacheName.filter(async(name) => {
  //     const cacheStorage = await caches.open(name);
  //     const cachedResponse = await cacheStorage.match(url);
  //     const data = await cachedResponse.json() 
  //     console.log(data);
  //     setUserProfile(data);
  //   })
  // };
  

  async function getUserProfile() {
    if (userProfile.length > 0) return;
    console.log('render!');
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

  
  // const getUserProfileCache = async () => {
    
	// 	const url = 'https://localhost:4000'
	// 	const names = await caches.keys()
	// 	const cacheDataArray = []
	// 	names.forEach(async(name) => {
	// 	  const cacheStorage = await caches.open(name);
	// 	  // Fetching that particular cache data
	// 	  const cachedResponse = await cacheStorage.match(url);
	// 	  const dataB = await cachedResponse.json() /////////////////////////////TVOJA DATA////
	// 	  // Pushing fetched data into our cacheDataArray
	// 	  cacheDataArray.push(dataB);
	// 	  console.log(dataB);
	// 	  setUserProfile(dataB);
	// 	})
  // };


  useEffect(() => { 
	  getFromCache('User Profile','https://localhost:3000');
	  // if (userProfile.length > 0) getFromCache('User Profile','https://localhost:3000');
	  // if (allRepos.length > 0) getFromCache('User Repos','https://localhost:3000');
	  getFromCache('User Repos','https://localhost:3000');
  }, []);


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
    addToCache('User Repos', 'https://localhost:3000', data);
    // getFromCache('User Repos', 'https://localhost:3000');
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
            <Button className="btn logout" text="Log Out" onClick={logOutBtnLogic} />
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
