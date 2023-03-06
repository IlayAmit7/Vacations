import express from "express";
import cors from "cors"
import catchAll from "./3-middleware/catch-all";
import routeNotFound from "./3-middleware/route-not-found";
import expressFileUpload from "express-fileupload";
import authController from "./6-routs/auth-routs";
import vacationsController from "./6-routs/vacations-routs";
import sanitize from "./3-middleware/sanitize";
import expressRateLimit from "express-rate-limit";
import appConfig from "./2-utils/app-config";


const server = express();

server.use("/api/", expressRateLimit({
    windowMs: 500,
    max: 50,
    message: "You have exceeded the allowed amount of times for browsing the site."
}));

server.use(sanitize);

server.use(cors());

server.use(express.json());

server.use(expressFileUpload());

server.use("/", authController);
server.use("/", vacationsController);

server.use("*", routeNotFound);

server.use(catchAll);

server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));