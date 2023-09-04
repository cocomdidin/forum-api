class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, commentId, userId, content,
    } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.userId = userId;
    this.content = content;
  }

  _verifyPayload({
    threadId, commentId, userId, content,
  }) {
    if (!threadId || !commentId || !userId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof userId !== 'string'
      || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
