import { isObject } from "../type-validation"

interface ErrorLike {
  message: string
}

/**
 * A type guard for error-like objects.
 */
export const isErrorLike = (error: unknown): error is ErrorLike => {
  return (
    isObject(error) && "message" in error && typeof error.message === "string"
  )
}

/**
 * Parses errors to string, useful for getting the error message in a
 * `try...catch` statement.
 */
export const getErrorMessage = (error: unknown): string => {
  // If it's an Error-like object, use the error message
  if (isErrorLike(error)) return error.message

  // If it's already a string, use it as is
  if (typeof error === "string") return error

  return "An unknown error has ocurred."
}
