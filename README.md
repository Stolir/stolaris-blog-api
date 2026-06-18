# Stolaris Blog API

## Table of Contents

1.  [Introduction](#introduction)
2.  [Architecture](#architecture)
3.  [Data Models](#data-models)
4.  [API Endpoints](#api-endpoints)
    - [Authentication & Registration](#authentication--registration)
    - [Articles](#articles)
    - [Authors](#authors)
    - [Comments](#comments)
    - [Users](#users)
5.  [Authentication & Authorization](#authentication--authorization)
6.  [Validation](#validation)

## 1. Introduction

Stolaris Blog API, is a RESTFul backend build with Node.js, Express, Passport.js, and JWT authentication. Allowing user registration, login, and CRUD operations for blog posts, with protected routes for both types of user roles (reader, author).

## 2. Architecture

To separate concerns, the repository is split into multiple layers:

- **`app.js`**: The main entry point of the application, responsible for setting up the Express server, middleware, and routing.
- **`config/`**: Contains configuration files, primarily for Passport.js authentication strategies.
- **`controllers/`**: Houses the business logic for handling requests and preparing responses. Each controller corresponds to a specific resource (e.g., `articleController.js`, `authController.js`).
- **`middleware/`**: Contains custom middleware functions for authentication, authorization, and input validation.
- **`prisma/`**: Manages the database schema and migrations using Prisma ORM.
- **`routes/`**: Defines the API endpoints and maps them to the appropriate controller functions. Each file in this directory represents a major resource route (e.g., `articleRouter.js`, `authRouter.js`).
- **`services/`**: Provides an abstraction layer for interacting with the database via Prisma Client. These services are called by controllers to perform CRUD operations.

## 3. Data Models

The database schema is defined in `prisma/schema.prisma` and includes the following models:

### User Model

Represents a user in the system. Users can be authors or regular users.

| Field           | Type        | Description                               |
| :-------------- | :---------- | :---------------------------------------- |
| `id`            | `Int`       | Unique identifier for the user.           |
| `username`      | `String`    | Unique username for login.                |
| `password_hash` | `String`    | Hashed password of the user.              |
| `name`          | `String`    | Display name of the user.                 |
| `email`         | `String?`   | Optional unique email address.            |
| `isAuthor`      | `Boolean`   | Indicates if the user is an author.       |
| `articles`      | `Article[]` | Relation to articles created by the user. |
| `comments`      | `Comment[]` | Relation to comments made by the user.    |

### Article Model

Represents a blog post.

| Field         | Type        | Description                                                              |
| :------------ | :---------- | :----------------------------------------------------------------------- |
| `id`          | `Int`       | Unique identifier for the article.                                       |
| `user`        | `User`      | Relation to the author of the article.                                   |
| `userId`      | `Int`       | ID of the author.                                                        |
| `title`       | `String`    | Title of the article.                                                    |
| `slug`        | `String`    | URL-friendly slug, unique.                                               |
| `content`     | `Json`      | Content of the article (JSON format).                                    |
| `readTime`    | `Int?`      | Estimated reading time in minutes (optional).                            |
| `status`      | `Status`    | Current status of the article (PUBLISHED, UNPUBLISHED, ARCHIVED, DRAFT). |
| `comments`    | `Comment[]` | Relation to comments on the article.                                     |
| `createdAt`   | `DateTime`  | Timestamp of article creation.                                           |
| `lastUpdated` | `DateTime`  | Timestamp of last update.                                                |

### Comment Model

Represents a comment on an article, supporting nested comments.

| Field       | Type        | Description                                           |
| :---------- | :---------- | :---------------------------------------------------- |
| `id`        | `Int`       | Unique identifier for the comment.                    |
| `user`      | `User?`     | Relation to the user who made the comment (optional). |
| `userId`    | `Int?`      | ID of the user who made the comment (optional).       |
| `content`   | `String`    | Content of the comment.                               |
| `createdAt` | `DateTime`  | Timestamp of comment creation.                        |
| `parent`    | `Comment?`  | Self-referencing relation for parent comment.         |
| `parentId`  | `Int?`      | ID of the parent comment (for replies).               |
| `replies`   | `Comment[]` | Self-referencing relation for replies.                |
| `article`   | `Article`   | Relation to the article the comment belongs to.       |
| `articleId` | `Int`       | ID of the article.                                    |

### Status Enum

Defines the possible states for an article.

- `PUBLISHED`
- `UNPUBLISHED`
- `ARCHIVED`
- `DRAFT`

## 4. API Endpoints

The API provides various endpoints categorized by resource.

### Authentication & Registration

| Method  | Endpoint             | Description                                  | Authentication | Validation             |
| :------ | :------------------- | :------------------------------------------- | :------------- | :--------------------- |
| `POST`  | `/api/register`      | Register a new user.                         | None           | `validateRegistration` |
| `POST`  | `/auth/login`        | Log in a user.                               | None           | `validateLogin`        |
| `POST`  | `/auth/login/author` | Log in an author.                            | None           | `validateLogin`        |
| `GET`   | `/auth/me`           | Get current authenticated user's details.    | `requireAuth`  | None                   |
| `POST`  | `/auth/logout`       | Log out the current user.                    | `requireAuth`  | None                   |
| `PATCH` | `/auth/me`           | Update current authenticated user's details. | `requireAuth`  | `validateUserUpdate`   |

### Articles

| Method | Endpoint                     | Description                          | Authentication | Validation        |
| :----- | :--------------------------- | :----------------------------------- | :------------- | :---------------- |
| `GET`  | `/api/articles`              | Get all published articles.          | None           | None              |
| `GET`  | `/api/articles/search`       | Search for articles.                 | None           | None              |
| `GET`  | `/api/articles/featured`     | Get featured articles.               | None           | None              |
| `GET`  | `/api/articles/:slug`        | Get a single article by its slug.    | None           | None              |
| `GET`  | `/api/articles/:id/comments` | Get comments for a specific article. | None           | None              |
| `POST` | `/api/articles/:id/comments` | Post a new comment on an article.    | `optionalAuth` | `validateComment` |

### Authors

These endpoints are protected and require `requireAuth` and `requireAuthor` middleware.

| Method   | Endpoint                                    | Description                                         | Authentication                                 | Validation        |
| :------- | :------------------------------------------ | :-------------------------------------------------- | :--------------------------------------------- | :---------------- |
| `GET`    | `/api/author/articles`                      | Get all articles by the authenticated author.       | `requireAuth`, `requireAuthor`                 | None              |
| `GET`    | `/api/author/articles/:articleId`           | Get a specific article by the authenticated author. | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `POST`   | `/api/author/articles`                      | Create a new article.                               | `requireAuth`, `requireAuthor`                 | `validateArticle` |
| `POST`   | `/api/author/articles/:articleId/publish`   | Publish an article.                                 | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `POST`   | `/api/author/articles/:articleId/unpublish` | Unpublish an article.                               | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `POST`   | `/api/author/articles/:articleId/draft`     | Set article status to draft.                        | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `POST`   | `/api/author/articles/:articleId/archive`   | Archive an article.                                 | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `DELETE` | `/api/author/articles/:articleId`           | Delete an article.                                  | `requireAuth`, `requireAuthor`, `requireOwner` | None              |
| `PATCH`  | `/api/author/articles/:articleId`           | Update an article.                                  | `requireAuth`, `requireAuthor`, `requireOwner` | `validateArticle` |

### Comments

| Method   | Endpoint                   | Description       | Authentication                   | Validation |
| :------- | :------------------------- | :---------------- | :------------------------------- | :--------- |
| `GET`    | `/api/comments`            | Get all comments. | None                             | None       |
| `DELETE` | `/api/comments/:commentId` | Delete a comment. | `requireAuth`, `deleteAuthCheck` | None       |

### Users

| Method | Endpoint                      | Description                           | Authentication | Validation         |
| :----- | :---------------------------- | :------------------------------------ | :------------- | :----------------- |
| `GET`  | `/api/users/:userId`          | Get user details by ID.               | None           | None               |
| `GET`  | `/api/users/:userId/comments` | Get comments made by a specific user. | None           | None               |
| `POST` | `/api/users/username-attempt` | Check if a username is available.     | None           | `validateUsername` |

## 5. Authentication & Authorization

The API uses Passport.js with JWT (JSON Web Token) for authentication and authorization.

- **Local Strategy**: Used for initial user login with username and password.
- **JWT Strategy**: Used for subsequent requests, where a JWT token (stored in a cookie) is verified.

**Middleware functions** (`middleware/auth.js`):

- `requireAuth`: Ensures that a user is authenticated via JWT. If not, returns a 401 Unauthorized error.
- `optionalAuth`: Attempts to authenticate a user via JWT, but allows the request to proceed even if no valid token is present. If a token is present and valid, `req.user` is populated.
- `requireAuthor`: Checks if the authenticated user has `isAuthor: true`. If not, returns a 403 Forbidden error.
- `requireOwner`: A higher-order middleware that checks if the authenticated user is the owner of a specific resource (e.g., an article or comment). It takes `idParam` (parameter name for the resource ID), `findById` (service function to find the resource), and `ownerField` (field in the resource object that stores the owner's ID) as arguments.
- `deleteAuthCheck`: Custom middleware for deleting comments. It allows authors to delete any comment, while regular users can only delete their own comments.

## 6. Validation

Input validation is handled by `express-validator` and defined in `middleware/validation.js`. The following validation middleware functions are available:

- `validateRegistration`: Validates user registration data (username, name, email, password, confirm password).
- `validateLogin`: Validates user login credentials (username, password).
- `validateComment`: Validates comment content and parent ID.
- `validateArticle`: Validates article title, content, and read time.
- `validateUserUpdate`: Validates user profile update data, including username, name, email, and password changes.
- `validateUsername`: Validates username format and availability.
