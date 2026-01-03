const crypto = require("crypto");
const { STATUSES, getStatusCategory } = require("./statuses");

function buildResponse(code) {
  const meta = STATUSES[code] || {
    type: "unknown",
    message: "Unknown Status Code",
  };

  return {
    status: code,
    type: meta.type,
    category: getStatusCategory(code),
    message: meta.message,
    trace_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    documentation: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`,
    details: getStatusDetails(code),
  };
}

function getStatusDetails(code) {
  const details = {
    // Common success details
    200: { action: "proceed", retry: false },
    201: { action: "check_location_header", retry: false },
    204: { action: "no_additional_action", retry: false },

    // Common client error details
    400: { action: "check_request_format", retry: false },
    401: { action: "authenticate", retry: true },
    403: { action: "check_permissions", retry: false },
    404: { action: "verify_resource_exists", retry: false },
    429: { action: "wait_and_retry", retry_after: 60, retry: true },

    // Common server error details
    500: { action: "contact_support", retry: true },
    502: { action: "wait_and_retry", retry: true },
    503: { action: "wait_and_retry", retry: true },
    504: { action: "increase_timeout", retry: true },
  };

  return details[code] || { action: "refer_to_documentation", retry: false };
}

function generateErrorResponse(code, customMessage = null) {
  const response = buildResponse(code);
  if (customMessage) {
    response.custom_message = customMessage;
  }
  return response;
}

function getStatusDescription(code) {
  const descriptions = {
    100: "The server has received the request headers and the client should proceed to send the request body.",
    200: "Standard response for successful HTTP requests.",
    201: "The request has been fulfilled and resulted in a new resource being created.",
    204: "The server successfully processed the request but is not returning any content.",
    301: "This and all future requests should be directed to the given URI.",
    400: "The server cannot or will not process the request due to an apparent client error.",
    401: "Authentication is required and has failed or has not yet been provided.",
    403: "The request was valid, but the server is refusing action.",
    404: "The requested resource could not be found.",
    418: "I'm a teapot - April Fools' joke from RFC 2324.",
    429: "The user has sent too many requests in a given amount of time.",
    500: "A generic error message when an unexpected condition was encountered.",
    502: "The server was acting as a gateway or proxy and received an invalid response.",
    503: "The server is currently unavailable (overloaded or down for maintenance).",
    504: "The server was acting as a gateway or proxy and did not receive a timely response.",
  };

  return (
    descriptions[code] || "Refer to official HTTP specification for details."
  );
}

function sendStatusResponse(res, code, payload) {
  if (code >= 100 && code < 200 && code !== 101) {
    return res.status(200).json({
      simulated: true,
      simulated_status: code,
      ...payload,
      note: "1xx status codes are informational and cannot be sent as final HTTP responses"
    });
  }

  return res.status(code).json(payload);
}

module.exports = {
  buildResponse,
  generateErrorResponse,
  getStatusDetails,
  getStatusDescription,
  sendStatusResponse
};
