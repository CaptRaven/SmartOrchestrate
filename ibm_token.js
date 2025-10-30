// /api/ibm-token.js
export default async function handler(req, res) {
  try {
    const r = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: process.env.ORCHESTRATE_APIKEY,
      }),
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching IBM token:", err);
    res.status(500).json({ error: "Failed to fetch token" });
  }
}
