/**
 * Standardized API response utilities.
 * Ensures every endpoint returns a consistent JSON shape.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object|null} data    - payload to return
 * @param {string}      message - human-readable message
 * @param {number}      statusCode - HTTP status (default 200)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
    const response = {
        status: 'success',
        message,
    };
    if (data !== null) response.data = data;
    return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message    - human-readable error message
 * @param {number} statusCode - HTTP status (default 500)
 * @param {object|null} errors - optional validation / detail errors
 */
export const sendError = (res, message = 'Internal server error', statusCode = 500, errors = null) => {
    const response = {
        status: 'error',
        message,
    };
    if (errors !== null) response.errors = errors;
    return res.status(statusCode).json(response);
};
