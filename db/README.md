# WAA DB Manager

<img src="img/dynamodb-import.png" data-canonical-src="img/dynamodb-import.png" align="center"/>

## Setup

```bash
npm install
```

## AWS Development

### AWS Create, Insert, Test

```bash
npm run create
npm run insert
npm run test
```

## Local Development

Run Docker local instance

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

### Local Create, Insert, Test

```bash
npm run local-create
npm run local-insert
npm run local-test
```
