
const DataList = ({ userProfile }) => {
  return (
    <div className="user datalist">
      <ul>
        <li>{userProfile.name ? `${userProfile.name}` : `${userProfile.login}`}</li>
        <li>{userProfile.email ? `${userProfile.email}` : "no email information"}</li>
        <li>{userProfile.location ? `${userProfile.location}` : "no location information"}</li>
        <li>public repos: {userProfile.public_repos}</li>
        <li>private repos: {userProfile.total_private_repos}</li>
      </ul>
    </div>
  )
}

export default DataList