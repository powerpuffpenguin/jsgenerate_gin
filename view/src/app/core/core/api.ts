import { MakeRESTful } from './restful';
const root = 'api'

export const ServerAPI = {
    v1: {
        version: MakeRESTful(root, 'v1', 'version'),
        loggers: MakeRESTful(root, 'v1', 'loggers'),
    },
    static: {
        licenses: MakeRESTful('static', '3rdpartylicenses.txt'),
        license: MakeRESTful('static', 'LICENSE.txt'),
    },
}
