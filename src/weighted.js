const {
  STATUSES,
  STATUS_CATEGORIES,
  COMMON_STATUS_CODES,
} = require("./statuses");

const DEFAULT_WEIGHTS = {
  informational: 1,
  success: 70,
  redirection: 3,
  client_error: 20,
  server_error: 6,
};

const WEIGHTED_STATUSES = [
  { code: 200, weight: 50 },
  { code: 201, weight: 5 },
  { code: 204, weight: 10 },
  { code: 202, weight: 3 },
  { code: 206, weight: 2 },

  { code: 400, weight: 5 },
  { code: 401, weight: 3 },
  { code: 403, weight: 2 },
  { code: 404, weight: 4 },
  { code: 429, weight: 2 },
  { code: 422, weight: 2 },
  { code: 409, weight: 1 },
  { code: 415, weight: 1 },

  { code: 500, weight: 3 },
  { code: 502, weight: 1 },
  { code: 503, weight: 1 },
  { code: 504, weight: 1 },

  { code: 100, weight: 1 },

  { code: 301, weight: 1 },
  { code: 302, weight: 1 },
  { code: 304, weight: 1 },
];

function getWeightedStatus(weights = null) {
  const statuses = weights || WEIGHTED_STATUSES;
  const total = statuses.reduce((sum, s) => sum + s.weight, 0);
  let rand = Math.random() * total;

  for (const s of statuses) {
    if (rand < s.weight) return s.code;
    rand -= s.weight;
  }

  return 200;
}

function getWeightedStatusByCategory() {
  const categories = Object.keys(DEFAULT_WEIGHTS);
  const totalWeight = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;

  let selectedCategory = "success";
  for (const category of categories) {
    if (rand < DEFAULT_WEIGHTS[category]) {
      selectedCategory = category;
      break;
    }
    rand -= DEFAULT_WEIGHTS[category];
  }

  const codes = STATUS_CATEGORIES[selectedCategory];
  return codes[Math.floor(Math.random() * codes.length)];
}

const PRESETS = {
  production: WEIGHTED_STATUSES,
  testing: [
    { code: 200, weight: 60 },
    { code: 400, weight: 15 },
    { code: 500, weight: 15 },
    { code: 404, weight: 10 },
  ],
  chaos: [
    { code: 200, weight: 30 },
    { code: 500, weight: 20 },
    { code: 503, weight: 20 },
    { code: 429, weight: 15 },
    { code: 418, weight: 15 },
  ],
  api: [
    { code: 200, weight: 65 },
    { code: 201, weight: 10 },
    { code: 204, weight: 5 },
    { code: 400, weight: 5 },
    { code: 401, weight: 5 },
    { code: 404, weight: 5 },
    { code: 422, weight: 3 },
    { code: 500, weight: 2 },
  ],
};

function getWeightedStatusByPreset(preset = "production") {
  return getWeightedStatus(PRESETS[preset] || PRESETS.production);
}

module.exports = {
  getWeightedStatus,
  getWeightedStatusByCategory,
  getWeightedStatusByPreset,
  WEIGHTED_STATUSES,
  DEFAULT_WEIGHTS,
  PRESETS,
};
