import './App.css';
import { useEffect, useState } from 'react';

import Button from "./components/Button";
import UserProfileWindow from "./components/UserProfileWindow";
import ReposList from "./components/ReposList";
import Modal from "./components/Modal"

const CLIENT_ID = "2e7940c77b22ef261b29";

function App() {
  
  const [rerender, setRerender] = useState(false); // to rerender the page on demand
  const [userProfile, setUserProfile] = useState({}); // to store user profile data
  const [allRepos, setAllRepos] = useState({}); // to store repos data
  const [visible, setVisible] = useState(localStorage.getItem("pagesCache") ? Number(localStorage.getItem("pagesCache")) : 6); // to store pagination data
  const [modalID, setModalID] = useState(0); // to open modal with repo
  const [followersCount, setFollowersCount] = useState(0); // to fetch data from repo data
  const [repoLanguages, setRepoLanguages] = useState({});// to fetch data from repo data
  const [repoDescription, setRepoDescription] = useState('');// to fetch data from repo data
  
  function githubOauth() { // to authorize thru github oauth
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user%20repo&per_page=1000`);
  };

  const checkAccessToken = () => { // receive token
    const urlWithCode = window.location.search;
    const urlParams = new URLSearchParams(urlWithCode);
    const code = urlParams.get("code");

    if(code && localStorage.getItem("accessToken") === null) { // get token if localStorage is empty
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

  const addToCache = (cacheName, url, res) => { // to add data to cache
    const data = new Response(JSON.stringify(res));
    caches.open(cacheName).then((cache) => {
    cache.put(url, data);
    });
  };
  
  const getFromCache = async (cacheName, url) => { // to receive data from cache
    if (!(await caches.has(cacheName))) return;
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(url);
    const data = await cachedResponse.json();
    cacheName === "User Profile" ? setUserProfile(data) : setAllRepos(data);
  };

  useEffect(() => { 
    checkAccessToken();
	  getFromCache('User Profile','https://localhost:3000');
	  getFromCache('User Repos','https://localhost:3000');
  }, []);

  const clearCache = async () => { // to clear the cache
    const allCache = await caches.keys();
    allCache.forEach(cache => caches.delete(cache));
  }

  const logOutBtnLogic = () => { // logic to clear the cache and storage after logging out
    clearCache();
    localStorage.clear();
    setRerender(!rerender);
  }

  async function getUserProfile() { // to receive and store user data
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

  async function getReposCards() { // to receive and store repos data
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

  const showModal = (e) => {
    const currentID = e.currentTarget.previousSibling.id;
    setModalID(currentID);
    fetchRepo(currentID);
  }

  const fetchRepo =  async function fetchRepoLanguageAndDescription(currentID) { // to fetch data from repos api urls
    const currentRepo = allRepos.filter(repo => repo.id === Number(currentID));
    if (currentRepo[0].size < 1) {
      return [setRepoDescription("Repo is empty"),
              setRepoLanguages("no info"),
              setFollowersCount(0)];
    }
    const followersURL = currentRepo[0].subscribers_url;
    const languagesURL = currentRepo[0].languages_url;
    const repoDescription = currentRepo[0].description;
    
    const repoFollowers = await fetch(followersURL);
    const repoLanguages = await fetch(languagesURL);

    const followersData = await repoFollowers.json();
    const languagesData = await repoLanguages.json();
    
    setFollowersCount(followersData?.length || 0);
    languagesData["message"] !== "Not Found" ? setRepoLanguages(languagesData) : setRepoLanguages("no info");
    setRepoDescription(repoDescription || "no description");
  };
  
  return (
    <div className="App">
      <header className="App-header">
        {localStorage.getItem("accessToken") !== "undefined" && localStorage.getItem("accessToken") ?
        <div className="main-container">
          <Modal open={modalID} modalID={modalID} onClose={() => setModalID(false)}
           allRepos={allRepos} followersCount={followersCount} repoLanguages={repoLanguages} repoDescription={repoDescription} />
          <div className="navbar">
            <Button className="btn logout" text="Log Out" onClick={logOutBtnLogic} />
            <Button className="btn info" text="User Info" onClick={getUserProfile} />
            <Button className="btn show-repos" text="Show Repos" onClick={getReposCards} />
          </div>
          {<UserProfileWindow userProfile={userProfile} />}
          {Object.keys(allRepos).length > 0 
          && <ReposList visibleRepos={visible} allRepos={allRepos}
           showMore={showMoreRepos} showModal={showModal} followersCount={followersCount} />}
        </div> 
        :
        <h3><Button className="btn login" text="Login via GitHub" onClick={() => {logOutBtnLogic(); githubOauth()}} />, to see the stats</h3>
      }
      </header>
    </div>
  );
}

export default App;
