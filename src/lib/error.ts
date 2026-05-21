// The most common error responses are 400, 401, 403, 404. Create a class for each of these.

// 400
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
// 401
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// 403
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}
// 404
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

// The flow is:
// const err = new BadRequestError("Invalid input");
// → message param = "Invalid input"
// → super(message) initializes Error with that message
// → err.message === "Invalid input"
