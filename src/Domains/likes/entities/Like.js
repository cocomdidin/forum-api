class Like {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, commentId, userId, isLiked, updatedAt,
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.userId = userId;
    this.isLiked = isLiked;
    this.updatedAt = updatedAt;
  }

  _verifyPayload({
    id, commentId, userId, isLiked, updatedAt,
  }) {
    if (!id || !commentId || !userId || !updatedAt || typeof isLiked === 'undefined') {
      throw new Error('LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof commentId !== 'string'
      || typeof userId !== 'string'
      || typeof isLiked !== 'boolean'
      || typeof updatedAt !== 'string') {
      throw new Error('LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Like;
