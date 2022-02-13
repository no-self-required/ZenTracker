//json-rpc
// POST /

## CreateUser

Creates a user with the specified userId and password

### Parameters
--- 
-  method: 'createUser'
-  userId: string

    The unique idenitifier for the user account to be created

-  password: string

    The password for the account to be created

### Responses
--- 
#### 200
- createdAt: string 

The unix timestamp of when the user was created

#### 500
- errorCode: ErrorCode 

The type of error that occured


#### ErrorCodes 
- UserAlreadyExists
  - username: string 
- InvalidRequestParameters
  - parameterName: string 

## CreateUserSession 

Creates a session for logged in user with timer length, date, and log

### Parameters
--- 
- method: 'CreateUserSession'

- userid: string

    The unique identifier for the user account

- sessionid: string

    The unique identifier for the session to be created

- sessionLength: number

    The length of the session

- sessionDate: Date

    The date of the session completion

- sessionLog: string (optional)

    The users notes of the session

### Responses
--- 
#### 200
- createdAt: string 

The unix timestamp of when the session was created

#### 500
- errorCode: ErrorCode 

The type of error that occured

#### ErrorCodes 
- 
## UpdateUserSessionLog

Updates a session log with specified userId and sessionId

### Parameters
---
- method: 'updateUserSessionLog'
- userid: string

    The unique identifier of the session's user to be updated

- sessionid: string

    The unique identifier of the session to be updated

- sessionLog: string

    The string to be updated to the session log

### Responses
---
#### 200
- createAt: string

The unix timestamp of when the session was updated

#### 500
- errorCode: ErrorCode the type of error that occured

#### ErrorCodes
- 

## DeleteSession 

Deletes a session with specified userId and sessionId

### Parameters
---
- method: 'deleteUserSession'
- userid: string

    The unique identifier of the session's user to be deleted

- sessionid: string

    The unique identifier of the session to be deleted

### Responses
---
#### 200
- createdAt: string

The unix timestamp of when the session is deleted

#### 500
- errorCode: ErrorCode the type of error that occured

#### ErrorCodes
- 




