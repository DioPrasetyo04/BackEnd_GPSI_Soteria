declare class ClientError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export default ClientError;
//# sourceMappingURL=clientError.d.ts.map