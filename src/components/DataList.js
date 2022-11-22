
const DataList = ({ userProfile }) => {
  return (
    <div className="datalist">
      <ul>
        <li>name: {userProfile.name ? `${userProfile.name}` : `${userProfile.login}`}</li>
        <li>email: {userProfile.email ? `${userProfile.email}` : "¯\\_(ツ)_/¯"}</li>
        <li>location: {userProfile.location ? `${userProfile.location}` : "¯\\_(ツ)_/¯"}</li>
        <li>public repos: {userProfile.public_repos}</li>
        <li>private repos: {userProfile.total_private_repos}</li>
      </ul>
    </div>  
  )
}

export default DataList