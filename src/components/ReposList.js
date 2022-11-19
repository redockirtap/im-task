import Repo from "./Repo"

const ReposList = ({ allRepos, visibleRepos }) => {
  return (
    <div className="repos-list">
        {allRepos.slice(0, visibleRepos).map(repo  => {
            return <Repo key={repo.id} repoId={repo.id} repoName={repo.name}/>
        })}
    </div>
  )
}

export default ReposList