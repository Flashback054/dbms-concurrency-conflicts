import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import { create } from "express-handlebars";
import helmet from "helmet";
import path = require("path");
const methodOverride = require("method-override");
require("express-async-errors");

import { AppDataSource } from "./data-source";
import routes from "./route";

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    dotenv.config({ path: path.join(__dirname, "../.env") });
    app.use(cors());
    app.use(helmet());
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(express.static(`${__dirname}/public`));
    app.use(methodOverride("_method"));
    app.use(bodyParser.urlencoded({ extended: true }));

    const hbs = create({
      extname: ".html",
      defaultLayout: "main",
      layoutsDir: `${__dirname}/views/`,
      partialsDir: `${__dirname}/views/components/`,
      helpers: {
        currencyFormat(value: number | bigint) {
          return Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);
        },
      },
    });
    app.engine("html", hbs.engine);
    app.set("view engine", "html");
    app.set("views", `${__dirname}/views`);

    app.use("/", routes);

    app.use((err, req, res, next) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });

    app.listen(3000, () => {
      console.log(
        "Express server has started on port 3000. Open http://localhost:3000 to see results"
      );
    });
  })
  .catch((error) => console.log(error));
