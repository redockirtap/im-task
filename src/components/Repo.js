import Button from "./Button"

const Repo = ({ repoId, repoName }) => {
  return (
    <div className="repo">
      <div className={`id-${repoId}`}>{repoName}</div>
      <Button className="btn repo-see-details" text="See Details" /> 
    </div>
  )
}

export default Repo