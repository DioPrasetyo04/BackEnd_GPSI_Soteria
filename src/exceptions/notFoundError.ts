import ClientError from "./clientError";

class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
    this.name = "Not Found Error";
  }
}

export default NotFoundError;
