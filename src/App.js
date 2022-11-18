import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

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
        // .then(response => {
        //   return response.json();
        // }).then(data => {
        //   console.log(data);
        //   if(data.access_token) localStorage.setItem("accessToken", data.access_token);
        //   SetRerender(!rerender);
        // })
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

    // .then(response => response.json()).then(data => {console.log(data); setUserProfile(data)});
  };

  async function getReposCards() {
    const res = await fetch("http://localhost:4000/getUserRepos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        // "Accept": "application/vnd.github+json",
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
        <>
          <button onClick={() => {localStorage.removeItem("accessToken"); SetRerender(!rerender)}}>Log out</button>
          <button onClick={getUserProfile}>User Info</button>
          {Object.keys(userProfile).length !== 0 ?
          <>
            <h3>Hey there, {userProfile.login}</h3>
            <h4>{userProfile.bio}</h4>
            <img width="100px" height="100px" src={userProfile.avatar_url}></img>
            <ul>
              <li>{userProfile.name}</li>
              {userProfile.email ?
              <>
                <li>{userProfile.email}</li>
              </>
              :
              <>
                <li>email is missing</li>
              </>
              }
              {userProfile.location ?
              <>
                <li>{userProfile.location}</li>
              </>
              :
              <>
                <li>location is missing</li>
              </>
              }
              <li>private repos: {userProfile.total_private_repos}</li>
              <li>public repos: {userProfile.public_repos}</li>
              <li>{userProfile.repos_url}</li>
            </ul>

            <>
              <button onClick={getReposCards}>Show Repos</button>
            </>
          </>
          :
          <>

          </>
          }
        </>  
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
