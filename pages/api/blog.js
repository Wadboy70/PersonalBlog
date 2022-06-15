export default async function handler(req, res) {
  const auth = req?.headers?.authorization;
  if (!auth) {
    res.status(400).json({ error: "Couldn't retrieve auth header!" });
    return;
  }

  const pw = auth.split(" ")[1];
  const decodedPw = Buffer.from(pw, "base64").toString("ascii");

  if (decodedPw !== process.env.ADMIN_PASSWORD) {
    res.status(400).json({ error: "Incorrect password!" });
    return;
  }
  const deployHook = await fetch(process.env.DEPLOY_BLOG_URL);

  res.status(200).json({ error: null, deployHook });
}
