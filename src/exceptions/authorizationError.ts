import ClientError from "./clientError";
class AuthorizationError extends ClientError {
  constructor(message: string) {
    super(message, 403);
    this.name = "Authorization Error";
  }
}
export default AuthorizationError;
