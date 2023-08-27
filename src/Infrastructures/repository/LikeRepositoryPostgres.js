const LikeRepository = require('../../Domains/likes/LikeRepository');
const AddedLike = require('../../Domains/likes/entities/AddedLike');
const UpdatedLike = require('../../Domains/likes/entities/UpdatedLike');
const Like = require('../../Domains/likes/entities/Like');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(payload) {
    const {
      commentId, userId,
    } = payload;
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO likes (id, comment_id, user_id) VALUES($1, $2, $3) RETURNING id, comment_id, user_id, is_liked, updated_at',
      values: [id, commentId, userId],
    };

    const results = await this._pool.query(query);
    const result = results.rows[0];

    return new AddedLike({
      id: result.id,
      commentId: result.comment_id,
      userId: result.user_id,
      isLiked: result.is_liked,
      updatedAt: result.updated_at.toISOString(),
    });
  }

  async updateLike(payload) {
    const {
      id, commentId, userId, isLiked,
    } = payload;
    const currentTime = new Date();

    const query = {
      text: 'UPDATE likes SET comment_id = $2, user_id = $3, is_liked = $4, updated_at = $5 WHERE id = $1 RETURNING id, comment_id, user_id, is_liked, updated_at',
      values: [id, commentId, userId, isLiked, currentTime.toISOString()],
    };

    const results = await this._pool.query(query);
    const result = results.rows[0];

    return new UpdatedLike({
      id: result.id,
      commentId: result.comment_id,
      userId: result.user_id,
      isLiked: result.is_liked,
      updatedAt: result.updated_at.toISOString(),
    });
  }

  async exist({ commentId, userId }) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    return result.rowCount > 0;
  }

  async findByComment({ commentId, userId }) {
    const query = {
      text: 'SELECT id, comment_id, user_id, is_liked, updated_at FROM likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    };

    const results = await this._pool.query(query);
    const result = results.rows[0];

    return new Like({
      id: result.id,
      commentId: result.comment_id,
      userId: result.user_id,
      isLiked: result.is_liked,
      updatedAt: result.updated_at.toISOString(),
    });
  }

  async reverse({ commentId, userId }) {
    let results = [];

    const updated = await this._pool.query({
      text: 'UPDATE likes SET is_liked = NOT is_liked, updated_at = now() WHERE comment_id = $1 AND user_id = $2 RETURNING id, comment_id, user_id, is_liked, updated_at',
      values: [commentId, userId],
    });

    if (updated.rowCount === 0) {
      const id = `like-${this._idGenerator()}`;
      const inserted = await this._pool.query({
        text: 'INSERT INTO likes (id, comment_id, user_id) VALUES($1, $2, $3) RETURNING id, comment_id, user_id, is_liked, updated_at',
        values: [id, commentId, userId],
      });
      results = inserted.rows;
    } else {
      results = updated.rows;
    }

    const result = results[0];

    return new Like({
      id: result.id,
      commentId: result.comment_id,
      userId: result.user_id,
      isLiked: result.is_liked,
      updatedAt: result.updated_at.toISOString(),
    });
  }
}

module.exports = LikeRepositoryPostgres;
