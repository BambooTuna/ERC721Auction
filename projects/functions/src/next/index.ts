import * as functions from "firebase-functions";
import * as next from "next";

const isDev = process.env.NODE_ENV !== "production";
const nextServer = next.default({
  dev: isDev,
  conf: {
    distDir: "dist",
  },
});
const nextHandle = nextServer.getRequestHandler();


export const hosting = functions
    .region("us-central1")
    .https.onRequest((request, response) => {
      return nextServer.prepare().then(() => nextHandle(request, response));
    });
