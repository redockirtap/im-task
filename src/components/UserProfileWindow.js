import DataList from "./DataList"

const UserProfileWindow = ({ userProfile }) => {
  return (
    <>
        {Object.keys(userProfile).length > 0 ?
            <div className="user-container">
                <div className="user profile-bio">
                    <img src={userProfile.avatar_url} alt={`${userProfile.login} avatar`}/>
                    {userProfile.login}
                </div>
                <DataList userProfile={userProfile} className="user profile-info" />
            </div>
            :
            <>

            </>
        }
    </>  
  )
}

export default UserProfileWindow