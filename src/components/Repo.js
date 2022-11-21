import Button from "./Button"
import Modal from "./Modal"
const Repo = ({ repoId, repoName, showModal }) => {

  return (
    <div className="repo">
      <div className={`id-${repoId}`}>{repoName}</div>
      <Button className="btn repo-see-details" text="See Details" onClick={showModal} /> 
    </div>
  )
}

export default Repo