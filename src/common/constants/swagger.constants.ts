export const SWAGGER_DESCRIPTION = `AdminCRMback <b>API's</b> documentation
## Note: 
All API responses will follow the format of ApiResponseDto:

\`\`\`
export class ApiResponseDto<T> {
  status_code: HttpStatus;
  detail: T;
  result: 'success' | 'error';
}
\`\`\`
### Example:

\`\`\`json
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
\`\`\`

\`\`\`json
{
  "status_code": 200,
  "detail": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  "result": "success"
}

\`\`\``;
