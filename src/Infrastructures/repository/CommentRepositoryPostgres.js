const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

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
      text: 'SELECT comments.id, users.username, comments.date, comments.content FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.deleted_at IS NULL AND comments.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getCommentsByThread(threadId) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.deleted_at IS NULL AND comments.thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
