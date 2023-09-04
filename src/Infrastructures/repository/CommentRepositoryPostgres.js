const Comment = require('../../Domains/comments/entities/Comment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Reply = require('../../Domains/replies/entities/Reply');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const {
      threadId, content, commentId, owner,
    } = payload;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, commentId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT comments.id, comments.date, comments.content, comments.owner, users.username '
        + 'FROM comments LEFT JOIN users ON users.id = comments.owner '
        + 'WHERE comments.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentsByThread(threadId) {
    const queryComment = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.deleted_at, '
            + '(SELECT COUNT(*) FROM likes WHERE likes.comment_id = comments.id AND likes.is_liked = true) AS like_count '
            + 'FROM comments LEFT JOIN users ON users.id = comments.owner '
            + 'WHERE comments.thread_id = $1',
      values: [threadId],
    };

    const resultComments = await this._pool.query(queryComment);

    if (resultComments.rowCount === 0) {
      return resultComments.rows;
    }

    const commentIds = resultComments.rows.map((row) => row.id);
    const placeholders = commentIds.map((_, index) => `$${index + 1}`).join(', ');
    const queryReply = {
      text: 'SELECT replies.id, replies.content, replies.created_at, users.username, replies.deleted_at, replies.comment_id '
            + 'FROM replies LEFT JOIN users ON users.id = replies.user_id '
            + `WHERE replies.comment_id IN (${placeholders}) `
            + 'ORDER BY replies.created_at ASC',
      values: commentIds,
    };

    const resultReplies = await this._pool.query(queryReply);

    return resultComments.rows.map((row) => {
      const repliesByComment = resultReplies.rows.filter((reply) => reply.comment_id === row.id);

      const replies = repliesByComment.map((rowReply) => new Reply({
        id: rowReply.id,
        content: rowReply.content,
        date: rowReply.created_at.toISOString(),
        username: rowReply.username,
        isDeleted: rowReply.deleted_at !== null,
      }));

      return new Comment({
        id: row.id,
        content: row.content,
        date: row.date,
        username: row.username,
        isDeleted: row.deleted_at !== null,
        likeCount: parseInt(row.like_count, 10),
        replies,
      });
    });
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE deleted_at IS NULL AND id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('anda bukan pemilik comment ini');
    }
  }
}

module.exports = CommentRepositoryPostgres;
