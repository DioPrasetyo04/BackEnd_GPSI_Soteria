import type { Response } from "express";

const responses = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown,
) => {
  let status: string;
  if (statusCode >= 200 && statusCode < 300) {
    status = "success response";
  } else if (statusCode >= 400 && statusCode < 500) {
    status = "error response";
  } else {
    status = "failed response";
  }

  const body = {
    status: status,
    message: message,
    data: data,
  };

  if (data !== undefined && data !== null) {
    body.data = data;
  }
  return res.status(statusCode).json(body);
};

export default responses;
