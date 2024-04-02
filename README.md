## Description

Admin CRM for the project

## Installation

```bash
$ npm install
```

## Copy .env

```bash
cp .env.sample .env
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Auto documentation

```js
`${url}/swagger`;
```

## File name rules:

Controllers must end with `.controller.ts.`

entities at `.entity.ts.`

DTO and `.dto.ts`

So now your documentation will be generated automatically without using decorators
`@ApiTags(), @ApiOperation(), @ApiResponse()`

## Note:

All API responses will follow the format of ApiResponseDto.

```ts
export class ApiResponseDto<T> {
  status_code: HttpStatus;
  detail: T;
  result: 'success' | 'error';
}
```

### Example:

```json
{
  "status_code": 400,
  "detail": {
    "error": 400,
    "message": "Bad Request",
    "description": "The request cannot be fulfilled due to bad syntax",
    "timestamp": "2024-02-14T12:00:00.000Z",
    "traceId": "12345"
  },
  "result": "error"
}
```

```json
{
  "status_code": 200,
  "detail": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "result": "success"
}
```
