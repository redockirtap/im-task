import React from 'react';
import ReactDom from 'react-dom';
import Button from "./Button"
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Modal = ( { open, onClose, allRepos, modalID, followersCount, repoLanguages } ) => {
  if (!open) return null;
  modalID = Number(modalID);
  const currentRepo = allRepos.filter(repo => repo.id === modalID);
//   let followersCount;
//   const fetchRepo =  async function fetchRepoLanguageAndDescription() {
//         const followersURL = currentRepo[0].subscribers_url;
//         const LanguagesURL = currentRepo[0].languages_url;

//         const repoFollowers = await fetch(followersURL);
//         const repoLanguages = await fetch(LanguagesURL);

//         const followersData = await repoFollowers.json();
//         const LanguagesData = await repoLanguages.json();
//         // followersCount = followersData.length;
        
//         console.log(LanguagesData)
//         const follow = LanguagesData;
//         console.log(follow)
//         return follow;
//     };
//     console.log(fetchRepo().PromiseResult)
//         fetchRepo().then(res => res).then(data => followersCount = data);
//   const followers = async () =>  await fetchRepo();
//   const a = (async () =>{ 
//     followersCount = await fetchRepo();
//     console.log(followersCount);
//     })();
//   console.log(followersCount, followers().then(data => data));
//   (async () => console.log(await fetchRepo()))()
// console.log(repoLanguages.['HTML'])
const languagesArr = Object.keys(repoLanguages).map(key => [key]);
console.log(languagesArr.map(array => console.log(array)))
  return ReactDom.createPortal(
    <>
        <div className="modal-overlay"></div>
        <div className="modal-container">
            <div className="modal-bar">
                <p className="modal-name">id-{currentRepo[0].id}</p>
                <Button className="btn modal-close" onClick={onClose} text={<AiOutlineCloseCircle/>} />
            </div>    
            <div className="modal-info">
                <div className="project-info">
                    <p>Project: <a href={currentRepo[0].html_url} rel="noopener noreferrer" target="_blank">{currentRepo[0].name}</a></p>
                    <div className="repo-language">
                      Project languages:
                      <ul>
                        {languagesArr.map(array => <li>{array[0]}</li>)}
                      </ul>
                    </div>
                    <p>Watchers: {followersCount}</p>
                </div>
            </div>
        </div>
    </>,
    document.getElementById("portal")
  )
}

export default Modal