type err = "client" | "server";

export type customError = {
  error: err;
  msg: string;
  details: unknown;
};

export function isACustomError(error: any): error is customError {
  if (error.error === "client" || error.error === "server") {
    return true;
  } else {
    return false;
  }
}

export function newCustomError(error: err, msg: string, details: any) {
  return { error, msg, details };
}
