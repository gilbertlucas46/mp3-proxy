# MP3 Proxy Server

A Node.js proxy server designed to handle MP3 file requests through rotating proxies with custom headers and origin validation.

## Features

- 🔒 Origin validation and access control
- 🔄 Rotating proxy support
- 📝 Custom header management
- 🌊 Streaming response handling
- 🔐 Environment-based configuration

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd mp3-proxy
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp sample.env .env
```

Edit the `.env` file with your configuration:
- `PORT`: Server port (default: 3004)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
- `DEFAULT_REFERER`: Default referer header
- `DEFAULT_ORIGIN`: Default origin header
- `ALLOWED_URLS`: Comma-separated list of allowed URL patterns

## Docker Setup

The application can be run using Docker:

```bash
docker-compose up
```

Or build and run manually:
```bash
docker build -t mp3-proxy .
docker run -p 3004:3004 mp3-proxy
```

## API Usage

### Proxy Endpoint

```
GET /proxy?url=https://domain/example.mp3
```

Query Parameters:
- `url`: The MP3 file URL to proxy (required)
- `referer`: Custom referer header (optional)
- `origin`: Custom origin header (optional)

Example:

## Security

- Origin validation middleware ensures requests only come from allowed domains
- URL validation ensures only specific patterns are allowed
- Proxy rotation helps prevent rate limiting
- Environment-based configuration keeps sensitive data secure

## Development

1. Set up your environment variables using the sample.env template
2. Run the development server:
```bash
node index.js
```

## Docker Environment Variables

When using Docker, configure environment variables in `docker-compose.yml`:

```yaml
environment:
  - PORT=3004
  - ALLOWED_ORIGINS=
  - DEFAULT_REFERER=
  - DEFAULT_ORIGIN=
  - ALLOWED_URLS=
```

## License

ISC