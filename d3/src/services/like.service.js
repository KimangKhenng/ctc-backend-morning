import { likes } from '../models/db.js'

export const countLikes = (postId) => likes.filter((like) => like.postId === postId).length

// Posts do not store a like count; it is calculated from the likes list
export const withLikes = (post) => ({ ...post, likes: countLikes(post.id) })
