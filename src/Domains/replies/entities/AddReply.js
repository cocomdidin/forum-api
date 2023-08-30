class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, commentId, userId, content,
    } = payload;

    this.id = id;
    this.commentId = commentId;
    this.userId = userId;
    this.content = content;
  }

  _verifyPayload({
    id, commentId, userId, content,
  }) {
    if (!id || !commentId || !userId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string'
      || typeof commentId !== 'string'
      || typeof userId !== 'string'
      || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
