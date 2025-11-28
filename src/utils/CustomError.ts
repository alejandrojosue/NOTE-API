export class CustomError extends Error {
  public status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CustomError";
    this.status = status;
  }
}
