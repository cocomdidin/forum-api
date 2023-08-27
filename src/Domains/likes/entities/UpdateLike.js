class UpdateLike {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, commentId, userId, isLiked,
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.userId = userId;
    this.isLiked = isLiked;
  }

  _verifyPayload({
    id, commentId, userId, isLiked,
  }) {
    if (!id || !commentId || !userId || isLiked === null) {
      throw new Error('UPDATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof commentId !== 'string'
      || typeof userId !== 'string'
      || typeof isLiked !== 'boolean') {
      throw new Error('UPDATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UpdateLike;
