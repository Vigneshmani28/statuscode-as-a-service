const express = require("express");
const cors = require("cors");
const { 
  STATUSES, 
  STATUS_CODES, 
  STATUS_CATEGORIES,
  COMMON_STATUS_CODES,
  getStatusCategory
} = require("./statuses");
const { 
  getWeightedStatus, 
  getWeightedStatusByCategory,
  getWeightedStatusByPreset 
} = require("./weighted");
const { buildResponse, generateErrorResponse,getStatusDescription, sendStatusResponse } = require("./utils");
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86400
  })
);

app.options("*", cors());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req) => {
    const ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.ip;

    return ipKeyGenerator(ip);
  },
  message: {
    error: "Too many requests, please try again later. (120 reqs/min/IP)",
  },
});


app.use(limiter);

app.get("/status/random", (req, res) => {
  const code = STATUS_CODES[Math.floor(Math.random() * STATUS_CODES.length)];
  sendStatusResponse(res, code, buildResponse(code));
});

app.get("/status/random/:category", (req, res) => {
  const category = req.params.category;
  if (!STATUS_CATEGORIES[category]) {
    return res.status(400).json(generateErrorResponse(400, `Invalid category. Valid categories: ${Object.keys(STATUS_CATEGORIES).join(", ")}`));
  }
  
  const codes = STATUS_CATEGORIES[category];
  const code = codes[Math.floor(Math.random() * codes.length)];
  sendStatusResponse(res, code, buildResponse(code));
});

app.get("/status/weighted", (req, res) => {
  const { preset } = req.query;
  const code = preset ? getWeightedStatusByPreset(preset) : getWeightedStatus();
  sendStatusResponse(res, code, buildResponse(code));
});

app.get("/status/weighted/category", (req, res) => {
  const code = getWeightedStatusByCategory();
  sendStatusResponse(res, code, buildResponse(code));
});

app.get("/status/:code", (req, res) => {
  const code = Number(req.params.code);
  const { message } = req.query;

  if (!STATUSES[code]) {
    return res
      .status(400)
      .json(generateErrorResponse(400, `Unsupported status code. Supported codes: ${STATUS_CODES.join(", ")}`));
  }

  const response = buildResponse(code);

  if (message) {
    response.custom_message = message;
  }

  sendStatusResponse(res, code, response);
});


app.get("/status/:code/info", (req, res) => {
  const code = Number(req.params.code);
  
  if (!STATUSES[code]) {
    return res.status(400).json(generateErrorResponse(400, "Unsupported status code"));
  }
  
  res.json({
    code,
    ...STATUSES[code],
    category: getStatusCategory(code),
    rfc_url: `https://tools.ietf.org/html/rfc7231#section-${Math.floor(code/100)}`,
    mdn_url: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`,
    description: getStatusDescription(code)
  });
});

app.get("/", (req, res) => {
  res.json({
    service: "Status Code As a Service",
    version: "2.0.0",
    description: "Comprehensive HTTP status code testing service",
    total_status_codes: STATUS_CODES.length,
    endpoints: {
      random: [
        "/status/random",
        "/status/random/:category (categories: informational, success, redirection, client_error, server_error)"
      ],
      weighted: [
        "/status/weighted",
        "/status/weighted?preset=production|testing|chaos|api",
        "/status/weighted/category"
      ],
      deterministic: "/status/:code",
      information: "/status/:code/info",
    }
  });
});

app.use((req, res) => {
  res.status(405).json(generateErrorResponse(405, `Method ${req.method} not allowed for ${req.path}`));
});

app.use((req, res) => {
  res.status(404).json(generateErrorResponse(404, `Endpoint ${req.path} not found`));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json(generateErrorResponse(500, "Internal server error occurred"));
});

app.listen(PORT, () => {
  console.log(`Status Code As a Service v2.0 running on http://localhost:${PORT}`);
  console.log(`Total supported status codes: ${STATUS_CODES.length}`);
});

module.exports = app;