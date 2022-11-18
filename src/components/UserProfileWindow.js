import DataList from "./DataList"

const UserProfileWindow = ({ userProfile }) => {
  return (
    <>
        {Object.keys(userProfile).length > 0 ?
            <div className="user">
                <div className="user profile-bio">
                    I am {userProfile.name}!
                </div>
                <DataList userProfile={userProfile} className="user profile-info" />
            </div>
            :
            <>
            Noooo!
            </>
        }
    </>  
  )
}

export default UserProfileWindow