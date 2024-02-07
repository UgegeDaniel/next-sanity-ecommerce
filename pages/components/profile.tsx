import { useAuth0 } from "@auth0/auth0-react";

function Profile() {
  const { user, loginWithRedirect, isAuthenticated, isLoading, error } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {JSON.stringify(user)}
      <p>isAuthenticated: {isAuthenticated}</p>
      <p>error: {JSON.stringify(error)}</p>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <button onClick={() => loginWithRedirect()}>Log in</button>
    </div>
  );
}

export default Profile;
