```
# Design Blog Endpoint

GET /posts
Get all blog posts

GET /posts/{id}
Get post by Id

POST /posts
Create a post

PATCH /posts/{id}
Edit a post by ID

DELETE /posts/{id}
Delete a post by ID

## Comments

GET /posts/{postId}/comments
Get all comments from a post

GET /posts/{postID}/comments/{commentId}
Get a comment from a post Id

POST /posts/{postID}/comments
Create a comment on a post by ID

PATCH /posts/{postID}/comments/{commentId}
Edit comment on a post by post ID

DELETE /posts/{postId}/comments/{commentID}
Delete a comment on a post by post ID

## Categories

GET /categories
Get all categoreis

GET /categories/{id}
Get a category by ID

....

## Post likes

GET /posts/{id}/likes

POST /posts/{id}/likes

DELETE /posts/{id}/likes

## Filter by category

GET /posts?search="..."

GET /posts?category="..."

GET /posts?page="..."&limit="..."
```