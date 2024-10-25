export interface IConfig {
    server: Server;
    database: Database;
    cors: Cors;
    security: Security;
}
export interface ITalk {
    role: 'user' | 'system' | 'assistant';
    content: string;
}
interface Security {
    jwtSecret: string;
    bcryptSaltRounds: number;
}
interface Cors {
    origin: string;
    methods: string;
}
interface Database {
    mongodb: Mongodb;
    mysql: Mysql;
}
interface Mysql {
    host: string;
    user: string;
    password: string;
    database: string;
}
interface Mongodb {
    uri: string;
    options: Options;
}
interface Options {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}
interface Server {
    port: number;
    hostname: string;
    clientkey: string;
    maxRequestsPerMinute: number;
    openaikey: {
        'gpt-3.5-turbo': string;
        'gpt-4-turbo-preview': string;
    };
    options: {
        key: string;
        cert: string;
    };
}
export interface initConv {
    cnv: Array<ITalk>;
}
export {};
