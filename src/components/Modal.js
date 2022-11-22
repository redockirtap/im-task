import React from 'react';
import ReactDom from 'react-dom';
import Button from "./Button"
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Modal = ( { open, onClose, allRepos, modalID, followersCount, repoLanguages, repoDescription } ) => {
  if (!open) return null;
  if (followersCount === null) followersCount = 0;
  modalID = Number(modalID);
  const currentRepo = allRepos.filter(repo => repo.id === modalID);

  console.log(repoLanguages)
  const languagesArr = Object.keys(repoLanguages).map(key => [key]);
  console.log(typeof followersCount)
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
                        {typeof repoLanguages !== "string" ? languagesArr.map((array, index) => <li key={`lang-${index}`}>{array[0]}</li>) : <>no info</>}
                      </ul>
                    </div>
                    {followersCount.length > 0 ? <p>Watchers: {followersCount}</p> : <p>Watchers: 0</p>}
                    { repoDescription.length > 0 ?
                      <article className="repo-description" style={{padding: "2rem 0"}}>
                      <h3>Project description:</h3>
                      {repoDescription}
                      </article>
                      :
                      <>"null"</>
                    }
                </div>
            </div>
        </div>
    </>,
    document.getElementById("portal")
  )
}

export default Modal