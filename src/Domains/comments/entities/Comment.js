class Comment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, isDeleted, likeCount, replies,
    } = payload;

    this.id = id;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
    this.date = date;
    this.username = username;
    this.likeCount = likeCount;
    this.replies = replies || [];
  }

  _verifyPayload({
    id, content, date, username, isDeleted, likeCount,
  }) {
    if (!id || !content || !date || !username || isDeleted === undefined || likeCount === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof content !== 'string'
      || !(date instanceof Date)
      || typeof username !== 'string'
      || typeof isDeleted !== 'boolean'
      || typeof likeCount !== 'number') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
