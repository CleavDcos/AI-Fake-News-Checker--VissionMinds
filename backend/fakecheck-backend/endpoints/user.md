# User Endpoints

## Authentication Endpoints

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Description**: Register a new user account

**Request Body:**
```json
{
  "name": "string (required, 2-50 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters, must contain uppercase, lowercase, and number)",
  "role": "string (optional, 'user' or 'moderator', default: 'user')"
}
```

**Response Success (201):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "user_name",
    "email": "user_email",
    "role": "user_role",
    "token": "jwt_token"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "User already exists" | "Invalid user data"
}
```

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Description**: Authenticate user and get access token

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "user_name",
    "email": "user_email",
    "role": "user_role",
    "token": "jwt_token"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Response Error (400):**
```json
{
  "success": false,
  "errors": [
    {
      "msg": "validation_error_message",
      "param": "field_name",
      "location": "body"
    }
  ]
}
```

### 3. Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Access**: Private (requires authentication)
- **Description**: Get current logged-in user information

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "user_name",
    "email": "user_email",
    "role": "user_role",
    "history": ["prediction_ids"],
    "createdAt": "timestamp",
    "__v": 0
  }
}
```

## User Model Schema

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'moderator'],
    default: 'user'
  },
  history: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

## Authentication Notes

- All private endpoints require JWT token in Authorization header
- Token format: `Bearer <jwt_token>`
- Passwords are hashed using bcrypt before storage
- Password field is excluded from default queries for security
- User roles: 'user' (default) and 'moderator'