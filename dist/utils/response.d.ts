import type { Response } from "express";
declare const responses: (res: Response, statusCode: number, message: string, data: unknown) => Response<any, Record<string, any>>;
export default responses;
//# sourceMappingURL=response.d.ts.map