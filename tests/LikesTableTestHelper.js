/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({
    id = 'like-123', userId = 'user-123', commentId = 'comment-123', isliked = true,
  }) {
    const query = {
      text: 'INSERT INTO likes (id, user_id, comment_id, is_liked) VALUES($1, $2, $3, $4)',
      values: [id, userId, commentId, isliked],
    };

    await pool.query(query);
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
