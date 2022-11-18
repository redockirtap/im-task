import Repo from "./Repo"

const ReposList = ({ allRepos }) => {
  return (
    <div className="repos-list">
        {allRepos.map(repo  => {
            return <Repo key={repo.id} repoId={repo.id} repoName={repo.name}/>
        })}
    </div>
  )
}

export default ReposList