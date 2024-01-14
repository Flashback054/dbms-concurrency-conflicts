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
const { create } = require("express-handlebars");
const methodOverride = require("method-override");

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
      layoutsDir: __dirname + "/views/",
      partialsDir: __dirname + "/views/partials/",
      helpers: {
        currencyFormat: function (value) {
          return Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);
        },
      },
    });
    app.engine("html", hbs.engine);
    app.set("view engine", "html");
    app.set("views", __dirname + "/views");

    app.use("/", routes);

    app.use((err, req, res, next) => {
      if (err) {
        res.status(500).send(err.message);
      }
    });

    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000 to see results"
    );
  })
  .catch((error) => console.log(error));
