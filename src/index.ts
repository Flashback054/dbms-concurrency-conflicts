import * as express from "express";
require("express-async-errors");
import * as bodyParser from "body-parser";
import helmet from "helmet";
import * as cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./route";
import * as dotenv from "dotenv";
import path = require("path");
import * as cookieParser from "cookie-parser";

AppDataSource.initialize()
	.then(async () => {
		// create express app
		const app = express();

		// Call midlewares
		dotenv.config({ path: path.join(__dirname, "../.env") });
		app.use(cors());
		app.use(helmet());
		app.use(cookieParser());
		app.use(bodyParser.json());

		//Set all routes from routes folder
		app.use("/", routes);
		app.use((err, req, res, next) => {
			if (err) {
				res.status(500).send(err.message);
			}
		});

		// start express server
		app.listen(3000);

		console.log(
			"Express server has started on port 3000. Open http://localhost:3000 to see results"
		);
	})
	.catch((error) => console.log(error));
