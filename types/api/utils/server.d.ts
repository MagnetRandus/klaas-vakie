import express, { Request, Response } from 'express';
import { IConfig } from 'src/types';
export declare class secureServer {
    app: express.Application;
    private config;
    private port;
    constructor(app: express.Application, config: IConfig);
    isValidUser(req: Request, res: Response): boolean;
    WebServiceGet(req: Request, res: Response): void;
    WebServicePost(req: Request, res: Response): Promise<void>;
    WebBrowsing(req: Request, res: Response): void;
    private setDefaultResponseHeaders;
    private requestHasJson;
}
