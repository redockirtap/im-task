
const Repo = ({ repoId, repoName }) => {
  return (
    <div className={`repo id-${repoId}`}>{repoName}</div>
  )
}

export default Repo