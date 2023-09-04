const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class LikeRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(payload) {
    const {
      commentId, content, userId,
    } = payload;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, user_id) VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, commentId, userId],
    };

    const results = await this._pool.query(query);
    const result = results.rows[0];

    return new AddedReply({
      id: result.id,
      content: result.content,
      owner: result.user_id,
    });
  }

  async findByComment({ commentId, userId }) {
    const query = {
      text: 'SELECT a.id, a.content, a.created_at, a.deleted_at, b.username FROM replies a LEFT JOIN users b ON a.user_id = b.id WHERE a.comment_id = $1 AND a.user_id = $2',
      values: [commentId, userId],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new Reply({
      id: result.id,
      content: result.content,
      date: result.created_at.toISOString(),
      username: result.username,
      isDeleted: result.deleted_at != null,
    }));
  }

  async deleteReply({ id }) {
    const query = {
      text: 'UPDATE replies SET deleted_at = NOW() WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async verifyReplyAvailability(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE deleted_at IS NULL AND id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('reply tidak ditemukan');
    }
  }

  async verifyReplyOwner({ id, userId }) {
    const query = {
      text: 'SELECT id FROM replies WHERE deleted_at IS NULL AND id = $1 AND user_id = $2',
      values: [id, userId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('anda bukan pemilik reply ini');
    }
  }
}

module.exports = LikeRepositoryPostgres;
