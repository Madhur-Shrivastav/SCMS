import getUserPool from "./AWS_GetUserPool";

export default async function getUserGroups() {
  const userPool = getUserPool();
  const user = userPool.getCurrentUser();

  if (!user) {
    console.log("No user is signed in");
    return null;
  }

  return new Promise((resolve, reject) => {
    user.getSession((err, session) => {
      if (err) {
        reject(err);
      } else {
        const groups = session.getAccessToken().payload["cognito:groups"];
        console.log("User Groups:", groups);
        resolve(groups || []);
      }
    });
  });
}
