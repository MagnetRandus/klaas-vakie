import * as https from 'https';
import express, { NextFunction, Request, Response } from 'express';
import { IConfig, ITalk } from 'src/types';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readFileSync } from 'fs';
import { oai } from '../ai/talk';

export class secureServer {
  private port: number;
  constructor(public app: express.Application, private config: IConfig) {
    this.port = Number(config.server.port);
    this.app = express();

    this.app.use(cors());

    const requestCounts = new Map<string, number>();

    this.app.use(`/submit-data`, (req: Request, res: Response, next: NextFunction) => {
      //RateLimiter
      const ip = req.ip!; // Get the client's IP address
      const maxRequestsPerMinute = this.config.server.maxRequestsPerMinute; // Maximum allowed requests per minute
      const requestCount = requestCounts.get(ip) || 0;

      if (requestCount >= maxRequestsPerMinute) {
        return res.status(429).send('Too Many Requests');
      }

      requestCounts.set(ip, requestCount + 1); // Increment the request count for this IP address

      setTimeout(() => {
        requestCounts.delete(ip);
      }, 60000); // Reset the request count after 1 minute

      next();
    });

    this.app.use('/', (req, res, next) => {
      console.log(`/ requested by: ${req.ip}`);
      next();
    });

    this.app.use((req, res, next) => {
      res.setHeader('X-Powered-By', 'Magnet-Randus');
      next();
    });

    this.app.use(`/submit-data`, bodyParser.json());
    this.app.use(`/submit-data`, bodyParser.urlencoded({ extended: true }));

    /**
     * Remember to allow the node app to use port 443:
     * sudo setcap 'cap_net_bind_service=+ep' $(which node)
     */

    this.app.get('/', (req: Request, res: Response) => {
      if (this.requestHasJson(req) && this.isValidUser(req, res)) {
        this.WebServiceGet(req, res);
      } else {
        this.WebBrowsing(req, res);
      }
    });

    this.app.post('/submit-data', (req: Request, res: Response) => {
      if (this.requestHasJson(req) && this.isValidUser(req, res)) {
        this.WebServicePost(req, res);
      }
    });

    https.createServer(this.config.server.options, this.app).listen(this.port, () => {
      console.log(`Server listening on port: ${this.port}`);
    });
  }
  isValidUser(req: Request, res: Response) {
    const validUser = (req.headers['x-client-key'] && req.headers['x-client-key'] == process.env['clientkey']) || false;

    if (!validUser) {
      console.log(`Tut tut... no client key ${req.ip}`);
      res.status(401).send("I don't know you!");
      return false;
    }
    return true;
  }
  WebServiceGet(req: Request, res: Response) {
    res.json({
      'know-you': true,
      'what-you-need': 'get',
    });
  }
  async WebServicePost(req: Request, res: Response): Promise<void> {
    switch (req.query[`model`]) {
      case 'gpt-3.5-turbo':
        const lnk = new oai(req.query['model'], this.config);
        const response = await lnk.sendMessage(req.body);
        res.status(200).send(JSON.stringify(response));

        break;
      default:
        res.status(400).send(`${req.query['model']} is not a  valid gpt-model`);
        break;
    }
  }
  WebBrowsing(req: Request, res: Response) {
    const welcome = `${process.cwd()}/dist/assets/welcome.html`;
    res.status(200).send(readFileSync(welcome, 'utf8'));
  }

  private setDefaultResponseHeaders(res: Response) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
  }
  private requestHasJson(req: Request) {
    return req.headers.accept && req.headers.accept.includes('application/json');
  }
}

// export function runServer(app, req, res, next) {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.originalUrl}`);

//     const startTime = new Date().getTime();

//     // calling next middleware
//     next();

//     // Logging request duration after response has been sent
//     res.on("finish", () => {
//       const elapsedTime = new Date().getTime() - startTime;

//       console.log(
//         `${req.method} ${req.originalUrl} ${res.statusCode} ${elapsedTime}ms`
//       );
//     });
//   });

//   // Handle POST request to '/submit-data'
//   app.post("/submit-data", (req: Request, res: Response) => {
//     const { method, url } = req;

//     console.log(req.body); // Log data to the console

//     // Echo back the received data with a custom message

//     res.status(200).json({
//       message: "Data received successfully.",
//       receivedData: req.body,
//     });
//   });

//   // Define the routes
//   app.get("/", (req, res) => {
//     if (req.headers.accept && req.headers.accept.includes("application/json")) {
//       const o = { you: "data" };

//       res.setHeader("Content-Type", "application/json");

//       res.setHeader("X-Powered-By", "Magnet-Randus");

//       res.json(o); // Send JSON response
//     } else {
//       res.status(406).send(`We only understand JSON here`); // Send 406 Not Acceptable status
//     }
//   });

//   // Middleware for parsing JSON
//   // app.use(express.json());

//   // app.post("/api/users", (req, res) => {
//   //   // Handle the POST request (e.g., save user data to a database)
//   //   res.send("User created successfully!");
//   // });

//   // Custom middleware function to log request details

//   const configFilePath = path.join(__dirname, "config.json");
//   const config = require(configFilePath) as IConfig;

//   // Use the config file for the settings of the app
//   app.set("port", config.server.port);

//   // Start the server
//   app.listen(app.get("port"), () => {
//     console.log(
//       "TypeScript app is running at http://0.0.0.0:%d",
//       app.get("port")
//     );
//   });
// }
