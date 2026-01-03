<img src="https://raw.githubusercontent.com/Vigneshmani28/statuscode-as-a-service/refs/heads/main/assets/img/scaas_banner.png" alt="scaas.png" />

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Rate%20Limit-120%20req%2Fmin-blue.svg" alt="Rate Limit" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" />
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status" />
  <img src="https://img.shields.io/badge/Type-HTTP%20API-orange.svg" alt="API Type" />
</p>


## GitAds Sponsored
[![Sponsored by GitAds](https://gitads.dev/v1/ad-serve?source=vigneshmani28/statuscode-as-a-service@github)](https://gitads.dev/v1/ad-track?source=vigneshmani28/statuscode-as-a-service@github)

# Status Code As a Service (SCaaS)
A professional HTTP status code simulation API for frontend development, QA testing, and chaos engineering. Test your application's error handling with realistic HTTP response codes.

## 🌟 Features

- **Complete HTTP Status Support**  
  All standard HTTP status codes (1xx–5xx)

- **Multiple Response Modes**  
  Random, weighted, deterministic, and categorized responses

- **Rate Limiting**  
  IP-based rate limiting with proper 429 responses

- **Production Simulation**  
  Weighted distributions that mimic real-world traffic patterns

- **Chaos Testing**  
  Random failure injection for resilience testing

- **Detailed Metadata**  
  Trace IDs, documentation links, and actionable advice in every response

- **Proxy Support**  
  Proper handling of `X-Forwarded-For` and Cloudflare headers

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```
# Clone the repository
git clone https://github.com/Vigneshmani28/statuscode-as-a-service.git
cd statuscode-as-a-service

# Install dependencies
npm install

# Start the server
npm start

# Development mode (auto-restart)
npm run dev
```

## API Endpoints
### 1. Root Endpoint
**GET / - Service information and available endpoints**

```
curl http://localhost:3000/
```
#### Response
```
{
  "service": "Status Code As a Service",
  "version": "2.0.0",
  "description": "Comprehensive HTTP status code testing service",
  "total_status_codes": 61,
  "endpoints": {
    "random": [
      "/status/random",
      "/status/random/:category"
    ],
    "weighted": [
      "/status/weighted",
      "/status/weighted?preset=production|testing|chaos|api",
      "/status/weighted/category"
    ],
    "deterministic": "/status/:code",
    "information": "/status/:code/info",
  }
}
```

### 2. Random Status Codes
**GET /status/random - Returns a random HTTP status code (any code 100-511)**
```
curl http://localhost:3000/status/random
curl http://localhost:3000/status/random/success
curl http://localhost:3000/status/random/:category
```
**Categories**: informational, success, redirection, client_error, server_error

### 3. Weighted Status Codes (Production Simulation)
**GET /status/weighted - Returns status codes with realistic distribution (70% success, 20% client errors, 6% server errors, etc.)**
```
curl http://localhost:3000/status/weighted
```
*GET /status/weighted?preset=:preset - Use specific distribution presets*

- **production (default)**: Real-world API distribution

- **testing**: Higher error rate for testing

- **chaos**: High failure rate for chaos engineering

- **api**: API-specific distribution
```
curl "http://localhost:3000/status/weighted?preset=chaos"
```
*GET /status/weighted/category - Weighted random by category*

### 4. Deterministic Status Codes
**GET /status/:code - Force a specific HTTP status code**

```
# Get a 404 response
curl http://localhost:3000/status/404

# Get 418 (I'm a teapot) with custom message
curl "http://localhost:3000/status/418?message=Short%20and%20stout"
```
### 5. Status Code Information
**GET /status/:code/info - Get detailed information about a status code**

```
curl http://localhost:3000/status/429/info
```
#### Response
```
{
  "code": 429,
  "type": "client_error",
  "message": "Too Many Requests",
  "category": "client_error",
  "rfc_url": "https://tools.ietf.org/html/rfc7231#section-4",
  "mdn_url": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429",
  "description": "The user has sent too many requests in a given amount of time."
}
```
## 🔧 Rate Limiting
The service implements IP-based rate limiting to prevent abuse:

- **Limit**: 120 requests per minute per IP

- **Response**: 429 (Too Many Requests) with detailed information

- **Headers**: Standard rate limit headers included

*Exemptions*: Localhost (127.0.0.1) and internal IPs are exempt

Rate Limit Headers
When rate limited, the service returns:

```
{
  "status": 429,
  "type": "rate_limit",
  "message": "Too many requests, please try again later. (120 reqs/min/IP)",
  "retry_after": 45,
  "limit": 120,
  "remaining": 0,
  "reset": "2024-01-15T10:45:00.000Z",
  "ip": "203.0.113.1",
  "documentation": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429"
}
```
## 📋 Response Format
All responses follow this standardized format:

```
{
  "status": 200,
  "type": "success",
  "category": "success",
  "message": "Request completed successfully",
  "trace_id": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "documentation": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200",
  "details": {
    "action": "proceed",
    "retry": false
  }
}
```

## 📊 Monitoring & Health Checks
```
# Health check (always returns 200)
curl -I http://localhost:3000/

# Status endpoint with verbose output
curl -v http://localhost:3000/status/503

# Check rate limit headers
curl -I http://localhost:3000/status/random
```
## 📁 Project Structure
```
status-code-as-a-service/
├── src/
│   ├── index.js                  # Application entry point
│   ├── statuses.js               # HTTP status definitions & categories
│   ├── weighted.js               # Weighted & preset-based status logic
│   └── utils.js                  # Response builders & helper utilities
```
## 🤝 Contributing
- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit changes (git commit -m 'Add amazing feature')
- Push to branch (git push origin feature/amazing-feature)
- Open a Pull Request

## 📞 Support
- Create an issue for bug reports
- Start a discussion for feature requests
- Check the examples folder for usage patterns

## 😄 Inspired From

Inspired by the legendary  
👉 https://github.com/hotheadhacker/no-as-a-service

If *No as a Service* taught the internet how to say **NO**,  
**Status Code as a Service** teaches your API how to fail — professionally.


## 📄 License

MIT — do whatever.

**Note:** This service is for testing purposes only. Do not use in production for critical functionality.
<!-- GitAds-Verify: TJ2XRQCS17R8YT4T2I4RGDH3XMO5X1G5 -->
