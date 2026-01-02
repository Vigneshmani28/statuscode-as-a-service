const STATUSES = {
  
  100: { type: "informational", message: "Continue" },
  101: { type: "informational", message: "Switching Protocols" },
  102: { type: "informational", message: "Processing" },
  103: { type: "informational", message: "Early Hints" },

  
  200: { type: "success", message: "OK" },
  201: { type: "success", message: "Created" },
  202: { type: "success", message: "Accepted" },
  203: { type: "success", message: "Non-Authoritative Information" },
  204: { type: "success", message: "No Content" },
  205: { type: "success", message: "Reset Content" },
  206: { type: "success", message: "Partial Content" },
  207: { type: "success", message: "Multi-Status" },
  208: { type: "success", message: "Already Reported" },
  226: { type: "success", message: "IM Used" },

  
  300: { type: "redirection", message: "Multiple Choices" },
  301: { type: "redirection", message: "Moved Permanently" },
  302: { type: "redirection", message: "Found" },
  303: { type: "redirection", message: "See Other" },
  304: { type: "redirection", message: "Not Modified" },
  305: { type: "redirection", message: "Use Proxy" },
  306: { type: "redirection", message: "Unused" },
  307: { type: "redirection", message: "Temporary Redirect" },
  308: { type: "redirection", message: "Permanent Redirect" },

  
  400: { type: "client_error", message: "Bad Request" },
  401: { type: "client_error", message: "Unauthorized" },
  402: { type: "client_error", message: "Payment Required" },
  403: { type: "client_error", message: "Forbidden" },
  404: { type: "client_error", message: "Not Found" },
  405: { type: "client_error", message: "Method Not Allowed" },
  406: { type: "client_error", message: "Not Acceptable" },
  407: { type: "client_error", message: "Proxy Authentication Required" },
  408: { type: "client_error", message: "Request Timeout" },
  409: { type: "client_error", message: "Conflict" },
  410: { type: "client_error", message: "Gone" },
  411: { type: "client_error", message: "Length Required" },
  412: { type: "client_error", message: "Precondition Failed" },
  413: { type: "client_error", message: "Payload Too Large" },
  414: { type: "client_error", message: "URI Too Long" },
  415: { type: "client_error", message: "Unsupported Media Type" },
  416: { type: "client_error", message: "Range Not Satisfiable" },
  417: { type: "client_error", message: "Expectation Failed" },
  418: { type: "client_error", message: "I'm a teapot" },
  421: { type: "client_error", message: "Misdirected Request" },
  422: { type: "client_error", message: "Unprocessable Entity" },
  423: { type: "client_error", message: "Locked" },
  424: { type: "client_error", message: "Failed Dependency" },
  425: { type: "client_error", message: "Too Early" },
  426: { type: "client_error", message: "Upgrade Required" },
  428: { type: "client_error", message: "Precondition Required" },
  429: { type: "client_error", message: "Too Many Requests" },
  431: { type: "client_error", message: "Request Header Fields Too Large" },
  451: { type: "client_error", message: "Unavailable For Legal Reasons" },

  
  500: { type: "server_error", message: "Internal Server Error" },
  501: { type: "server_error", message: "Not Implemented" },
  502: { type: "server_error", message: "Bad Gateway" },
  503: { type: "server_error", message: "Service Unavailable" },
  504: { type: "server_error", message: "Gateway Timeout" },
  505: { type: "server_error", message: "HTTP Version Not Supported" },
  506: { type: "server_error", message: "Variant Also Negotiates" },
  507: { type: "server_error", message: "Insufficient Storage" },
  508: { type: "server_error", message: "Loop Detected" },
  510: { type: "server_error", message: "Not Extended" },
  511: { type: "server_error", message: "Network Authentication Required" },
};


function getStatusCategory(code) {
  if (code >= 100 && code < 200) return "informational";
  if (code >= 200 && code < 300) return "success";
  if (code >= 300 && code < 400) return "redirection";
  if (code >= 400 && code < 500) return "client_error";
  if (code >= 500 && code < 600) return "server_error";
  return "unknown";
}


const STATUS_CATEGORIES = {
  informational: [100, 101, 102, 103],
  success: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
  redirection: [300, 301, 302, 303, 304, 305, 306, 307, 308],
  client_error: [
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
    415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,
  ],
  server_error: [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511],
};

const STATUS_CODES = Object.keys(STATUSES).map(Number);
const COMMON_STATUS_CODES = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];

module.exports = {
  STATUSES,
  STATUS_CODES,
  STATUS_CATEGORIES,
  COMMON_STATUS_CODES,
  getStatusCategory,
};
