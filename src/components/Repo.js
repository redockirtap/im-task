import Button from "./Button"
const Repo = ({ repoId, repoName, showModal, }) => {

  return (
    <div className="repo">
      <div style={{fontWeight: "bold"}} id={`${repoId}`}>{repoName}</div>
      <Button className="btn repo-see-details" text="See Details" onClick={showModal}   /> 
    </div>
  )
}

export default Repo