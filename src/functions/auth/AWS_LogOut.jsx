import getUserPool from "./AWS_GetUserPool";

export default function AWS_LogOut() {
  const userPool = getUserPool();
  const currentUser = userPool.getCurrentUser();

  if (currentUser) {
    currentUser.signOut();
    console.log("User successfully logged out.");
  } else {
    console.log("No user is currently logged in.");
  }
}
