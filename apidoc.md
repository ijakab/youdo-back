----------
## Response data structure

All responses are sent as **JSON**. <br>
Also, response always contain **data** and **message** key. <br>
_data_ is **array** or **object**, while message is always a **string**.

### x-is-mobile header
Set it to `android` or `ios` if you want to wrap all responses to data array

## Examples:
**Single response:**
```json
{
  "data": {
      "token": "eyJhbGciOinR5cCI6IkpXVCJ9.eyJ1aWiOnsiaXNB",
      "user": {
        "name": "user 1"
      }
  },
  "message": "ok"
}
```
> **Note:** Even when sending single object as response, data is still an array!

**Same response with x-is-mobile header**
```json
{
  "data": [
    {
      "token": "eyJhbGciOinR5cCI6IkpXVCJ9.eyJ1aWiOnsiaXNB",
      "user": {
        "name": "user 1"
      }
    }
  ],
  "message": "ok"
}
```

**Empty response:**
```json
{
  "data": {},
  "message": "User not found"
}
```

**Empty response with x-is-mobile header:**
```json
{
  "data": [],
  "message": "User not found"
}
```

## Authorization

After login, you will receive JWT token. <br>
JWT token should be sent to **all** protected routes **inside header** field **Authorization** in format: <br>
```json
Bearer token_string_here
```
Token will expire in short period of time (usually 15 minutes). <br>
Server will respond with status 401 (Unauthorized) when this happens. <br>
To get new token, there is a refresh token route where you send your refresh token to get new one

## Filtering

All resources that have /filter GET routes accept following query params

| Name | Type | Example | Description |
|------|------|---------|-------------|
| orderByFields | array | orderByFields[]=title,created_at | Will order by title (alphabetically). If same, orders by created_at (by date) |
| orderByModes | array | orderByModes[]=asc,desc | If above param above is set, title will be ordered descending and created_at ascending |
| createdFrom | integer | createdFrom=1542893239767 | All records created after November 22 2018 |
| createdTill | integer | createdTill=1542893239767 | All records created before November 22 2018 |
| updatedFrom | integer | createdFrom=1542893239767 | All records updated after November 22 2018 |
| updatedTill | integer | createdFrom=1542893239767 | All records updated before November 22 2018 |
| ids | array | ids[]=2,3,1 | Records with ids 2,3,1. Will automatically order them in that order unless orderByFields is specified |
| slugs | array | slugs[]=post2,post3,post1 | Records with slugs post2,post3,post1. Will automatically order them in that order unless orderByFields is specified |
| searchString | string | string=Home | Records that have "Home" in field specified in resource |
| paramKeys and paramValues (must go in pair and have equal length | arrays | paramKeys[]=status,display&paramValues[]=published,components | Will get only posts that have status=published and display=components |
