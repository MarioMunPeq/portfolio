const http = require("http");

function check(path) {
  return new Promise((resolve, reject) => {
    http
      .get("http://localhost:4173" + path, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () =>
          resolve({ status: res.statusCode, length: data.length }),
        );
      })
      .on("error", reject);
  });
}

(async () => {
  const routes = [
    "/portfolio/",
    "/portfolio/about",
    "/portfolio/projects",
    "/portfolio/experience",
    "/portfolio/education",
  ];
  for (const route of routes) {
    try {
      const r = await check(route);
      console.log(route, "=>", JSON.stringify(r));
    } catch (e) {
      console.log(route, "=> ERROR:", e.message);
    }
  }
  const vid = await check("/portfolio/videos/train-transition.webm");
  console.log("video =>", JSON.stringify(vid));
})();
