import Repo from "./Repo"
import Button from "./Button"

const ReposList = ({ allRepos, visibleRepos, showMore }) => {
  const cachedRepos = Number(localStorage.getItem("pagesCache"))
  console.log(cachedRepos)
  return (
    <section className="repos-section">
      <div className="repos-list">
          {allRepos?.slice(0, visibleRepos).map(repo  => {
              return <Repo key={repo.id} repoId={repo.id} repoName={repo.name}/>
          })}
      </div>
      <Button className="btn load-repos" text="Load More" onClick={showMore} />
    </section>
  )
}

export default ReposList