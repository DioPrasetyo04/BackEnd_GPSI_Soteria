import ClientError from "./clientError";

class InvariantError extends ClientError {
  constructor(message: string) {
    super(message, 400);
    this.name = "Invariant Error";
  }
}

export default InvariantError;
