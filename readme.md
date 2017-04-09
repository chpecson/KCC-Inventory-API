# KCC Inventory System API
API for registering users in this program with mongodb and authentication by the help of JWT(JSON web token). This program uses passport, passport-jwt and uses JWT-Strategy 

## Usage
```bash
npm install
```

```bash
npm start
```

## Endpoints
```bash
POST users\register  // Adds a new user
```

```bash
POST users\authenticate // Returns a token
```

```bash
POST users\profile // Require token to be authorized
```