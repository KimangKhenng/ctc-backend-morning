# Express.js Practice: Blog REST API Endpoints

A beginner-friendly API reference for building a blog backend with
**Node.js, Express.js, and JavaScript**.

Use this document as your implementation checklist. For every endpoint,
create an Express route, return the expected HTTP status code, and make
your JSON response follow the examples.

## 1. Project overview

Build a simple blog API with these resources:

-   **Posts** --- create, read, update, delete, and list blog posts.
-   **Comments** --- add, read, update, and delete comments on posts.
-   **Categories** --- organize posts by category.
-   **Likes** --- like and unlike a post.

### Base URL

``` text
http://localhost:3000/api
```

### Suggested data model

These are example JavaScript objects. You can begin with in-memory
arrays before connecting MongoDB.

``` js
const posts = [
  {
    id: 1,
    title: "Learning Express.js",
    content: "Express.js makes it easier to build web APIs.",
    author: "Dara",
    categoryId: 1,
    likes: 2,
    createdAt: "2026-11-13T08:00:00.000Z"
  }
];

const comments = [
  {
    id: 1,
    postId: 1,
    author: "Sokha",
    content: "Great introduction!",
    createdAt: "2026-11-13T08:30:00.000Z"
  }
];

const categories = [
  { id: 1, name: "Programming", description: "Programming tutorials" }
];

const likes = [
  { id: 1, postId: 1, userId: 2 }
];
```

## 2. Standard response format

Use consistent JSON responses throughout your API.

### Successful response

``` json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learning Express.js"
  }
}
```

### Error response

``` json
{
  "success": false,
  "message": "Post not found"
}
```

> The examples in this document show suggested response formats. Your
> exact message wording can differ, but keep the structure consistent.

## 3. Blog posts

Base path: `/api/posts`

  Method   Endpoint           Description                 Expected status
  -------- ------------------ ------------------------- -----------------
  GET      `/api/posts`       Get all posts                           200
  GET      `/api/posts/:id`   Get one post by ID                      200
  POST     `/api/posts`       Create a new post                       201
  PUT      `/api/posts/:id`   Update an existing post                 200
  DELETE   `/api/posts/:id`   Delete a post                           200

### 3.1 Get all posts

**Request**

``` http
GET /api/posts
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Learning Express.js",
      "content": "Express.js makes it easier to build web APIs.",
      "author": "Dara",
      "categoryId": 1,
      "likes": 2
    },
    {
      "id": 2,
      "title": "Understanding REST APIs",
      "content": "REST APIs use HTTP methods to work with resources.",
      "author": "Sokha",
      "categoryId": 1,
      "likes": 5
    }
  ]
}
```

### 3.2 Get one post

**Request**

``` http
GET /api/posts/1
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learning Express.js",
    "content": "Express.js makes it easier to build web APIs.",
    "author": "Dara",
    "categoryId": 1,
    "likes": 2
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Post not found"
}
```

### 3.3 Create a post

**Request**

``` http
POST /api/posts
Content-Type: application/json
```

**Request body**

``` json
{
  "title": "Introduction to Node.js",
  "content": "Node.js allows JavaScript to run outside the browser.",
  "author": "Dara",
  "categoryId": 1
}
```

**Response --- 201 Created**

``` json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 3,
    "title": "Introduction to Node.js",
    "content": "Node.js allows JavaScript to run outside the browser.",
    "author": "Dara",
    "categoryId": 1,
    "likes": 0
  }
}
```

**Response --- 400 Bad Request**

``` json
{
  "success": false,
  "message": "Title and content are required"
}
```

### 3.4 Update a post

**Request**

``` http
PUT /api/posts/1
Content-Type: application/json
```

**Request body**

``` json
{
  "title": "Learning Express.js: Beginner Guide",
  "content": "An updated introduction to building APIs with Express.js."
}
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": 1,
    "title": "Learning Express.js: Beginner Guide",
    "content": "An updated introduction to building APIs with Express.js.",
    "author": "Dara",
    "categoryId": 1,
    "likes": 2
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Post not found"
}
```

### 3.5 Delete a post

**Request**

``` http
DELETE /api/posts/1
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": 1
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Post not found"
}
```

## 4. Comments

Base path: `/api/posts/:postId/comments`

  Method   Endpoint                        Description                 Expected status
  -------- ------------------------------- ------------------------- -----------------
  GET      `/api/posts/:postId/comments`   Get comments for a post                 200
  POST     `/api/posts/:postId/comments`   Add a comment to a post                 201
  PUT      `/api/comments/:id`             Update a comment                        200
  DELETE   `/api/comments/:id`             Delete a comment                        200

### 4.1 Get comments for a post

**Request**

``` http
GET /api/posts/1/comments
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "author": "Sokha",
      "content": "Great introduction!"
    },
    {
      "id": 2,
      "postId": 1,
      "author": "Vanna",
      "content": "This helped me understand Express."
    }
  ]
}
```

### 4.2 Add a comment

**Request**

``` http
POST /api/posts/1/comments
Content-Type: application/json
```

**Request body**

``` json
{
  "author": "Vanna",
  "content": "Thanks for sharing this tutorial!"
}
```

**Response --- 201 Created**

``` json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": 3,
    "postId": 1,
    "author": "Vanna",
    "content": "Thanks for sharing this tutorial!"
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Post not found"
}
```

**Response --- 400 Bad Request**

``` json
{
  "success": false,
  "message": "Author and content are required"
}
```

### 4.3 Update a comment

**Request**

``` http
PUT /api/comments/1
Content-Type: application/json
```

**Request body**

``` json
{
  "content": "Great explanation! Very helpful."
}
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 1,
    "postId": 1,
    "author": "Sokha",
    "content": "Great explanation! Very helpful."
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Comment not found"
}
```

### 4.4 Delete a comment

**Request**

``` http
DELETE /api/comments/1
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {
    "id": 1
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Comment not found"
}
```

## 5. Categories

Base path: `/api/categories`

  Method   Endpoint                Description            Expected status
  -------- ----------------------- -------------------- -----------------
  GET      `/api/categories`       Get all categories                 200
  GET      `/api/categories/:id`   Get one category                   200
  POST     `/api/categories`       Create a category                  201
  PUT      `/api/categories/:id`   Update a category                  200
  DELETE   `/api/categories/:id`   Delete a category                  200

### 5.1 Get all categories

**Request**

``` http
GET /api/categories
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Programming",
      "description": "Programming tutorials"
    },
    {
      "id": 2,
      "name": "Technology",
      "description": "Technology news and articles"
    }
  ]
}
```

### 5.2 Get one category

**Request**

``` http
GET /api/categories/1
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Programming",
    "description": "Programming tutorials"
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Category not found"
}
```

### 5.3 Create a category

**Request**

``` http
POST /api/categories
Content-Type: application/json
```

**Request body**

``` json
{
  "name": "Backend Development",
  "description": "Server-side programming and API development"
}
```

**Response --- 201 Created**

``` json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Backend Development",
    "description": "Server-side programming and API development"
  }
}
```

**Response --- 400 Bad Request**

``` json
{
  "success": false,
  "message": "Category name is required"
}
```

### 5.4 Update a category

**Request**

``` http
PUT /api/categories/1
Content-Type: application/json
```

**Request body**

``` json
{
  "name": "Software Development",
  "description": "Articles about building software"
}
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Software Development",
    "description": "Articles about building software"
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Category not found"
}
```

### 5.5 Delete a category

**Request**

``` http
DELETE /api/categories/1
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {
    "id": 1
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Category not found"
}
```

## 6. Post likes

Base path: `/api/posts/:postId/likes`

For this beginner exercise, identify a user with a simple `userId` in
the request body. In a real application, the user would normally be
identified through authentication.

  Method   Endpoint                     Description              Expected status
  -------- ---------------------------- ---------------------- -----------------
  GET      `/api/posts/:postId/likes`   Get likes for a post                 200
  POST     `/api/posts/:postId/likes`   Like a post                          201
  DELETE   `/api/posts/:postId/likes`   Remove a user's like                 200

### 6.1 Get likes for a post

**Request**

``` http
GET /api/posts/1/likes
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Likes retrieved successfully",
  "data": {
    "postId": 1,
    "totalLikes": 2,
    "users": [2, 5]
  }
}
```

### 6.2 Like a post

**Request**

``` http
POST /api/posts/1/likes
Content-Type: application/json
```

**Request body**

``` json
{
  "userId": 7
}
```

**Response --- 201 Created**

``` json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "postId": 1,
    "userId": 7,
    "totalLikes": 3
  }
}
```

**Response --- 409 Conflict**

``` json
{
  "success": false,
  "message": "User has already liked this post"
}
```

### 6.3 Unlike a post

**Request**

``` http
DELETE /api/posts/1/likes
Content-Type: application/json
```

**Request body**

``` json
{
  "userId": 7
}
```

**Response --- 200 OK**

``` json
{
  "success": true,
  "message": "Post unliked successfully",
  "data": {
    "postId": 1,
    "userId": 7,
    "totalLikes": 2
  }
}
```

**Response --- 404 Not Found**

``` json
{
  "success": false,
  "message": "Like not found"
}
```

## 7. HTTP status codes to understand

  ------------------------------------------------------------------------
                   Status code Name                  When to use it
  ---------------------------- --------------------- ---------------------
                           200 OK                    A request succeeded,
                                                     such as reading,
                                                     updating, or deleting
                                                     data

                           201 Created               A new resource was
                                                     successfully created

                           204 No Content            A request succeeded
                                                     and there is no
                                                     response body

                           400 Bad Request           The client sent
                                                     invalid or incomplete
                                                     data

                           401 Unauthorized          Authentication is
                                                     required or
                                                     credentials are
                                                     invalid

                           403 Forbidden             The user is
                                                     authenticated but
                                                     does not have
                                                     permission

                           404 Not Found             The requested
                                                     resource does not
                                                     exist

                           409 Conflict              The request conflicts
                                                     with the current
                                                     resource state, such
                                                     as a duplicate like

                           500 Internal Server Error An unexpected error
                                                     occurred on the
                                                     server
  ------------------------------------------------------------------------

For this exercise, use `200`, `201`, `400`, `404`, `409`, and `500`
first. Learn `401` and `403` when you add authentication and
authorization.

## 8. Beginner implementation checklist

Implement the API in this order:

-   [ ] Create an Express server on port `3000`.
-   [ ] Add `express.json()` middleware so Express can read JSON request
    bodies.
-   [ ] Create in-memory arrays for posts, comments, categories, and
    likes.
-   [ ] Implement `GET /api/posts`.
-   [ ] Implement `GET /api/posts/:id`.
-   [ ] Implement `POST /api/posts`.
-   [ ] Implement `PUT /api/posts/:id`.
-   [ ] Implement `DELETE /api/posts/:id`.
-   [ ] Implement the comments endpoints.
-   [ ] Implement the categories endpoints.
-   [ ] Implement the likes endpoints.
-   [ ] Return the correct status code for success and error cases.
-   [ ] Test every endpoint using Postman, Insomnia, or Thunder Client.

## 9. Suggested Express project structure

Start with a simple structure. You can introduce routers and controllers
after the first endpoints work.

``` text
blog-api/
├── package.json
├── server.js
├── data/
│   └── db.js
└── routes/
    ├── posts.js
    ├── comments.js
    ├── categories.js
    └── likes.js
```

A minimal `server.js` could look like this:

``` js
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Blog API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
```

## 10. Practice rules and hints

1.  Use `req.params` to read route parameters such as `:id` and
    `:postId`.
2.  Use `req.body` to read data sent by the client.
3.  Use `res.status(201).json(...)` when creating a resource.
4.  Check whether a resource exists before updating or deleting it.
5.  Validate required fields before creating or updating data.
6.  Use array methods such as `find()`, `filter()`, `push()`, and
    `splice()` to work with in-memory data.
7.  Keep response JSON consistent across endpoints.
8.  Do not worry about MongoDB, JWT, or advanced architecture yet. First
    make the API work with JavaScript arrays.

### Important note about DELETE

This exercise uses `200 OK` with a JSON message after deletion so
beginners can see the result. A REST API can also return
`204 No Content`, but then it should not send a response body.

### Challenge

After completing the required endpoints, try these improvements:

-   Add pagination to `GET /api/posts`, for example
    `GET /api/posts?page=1&limit=10`.
-   Add search, for example `GET /api/posts?search=express`.
-   Filter posts by category, for example `GET /api/posts?categoryId=1`.
-   Prevent two likes from the same user on the same post.
-   Return a post together with its comments.
-   Add a global error-handling middleware.
