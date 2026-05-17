// The most common error responses are 400, 401, 403, 404. Create a class for each of these.

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
