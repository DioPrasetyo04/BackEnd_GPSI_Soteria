import ClientError from "./clientError";

class AuthenticationError extends ClientError {
  constructor(message: string) {
    super(message, 401);
    this.name = "Authentication Error";
  }
}

export default AuthenticationError;
