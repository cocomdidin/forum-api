class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      threadId, content, commentId, owner,
    } = payload;

    this.threadId = threadId;
    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({
    threadId, content, commentId, owner,
  }) {
    if (!threadId || !content || !owner || commentId === undefined) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string'
    || typeof content !== 'string'
    || typeof owner !== 'string'
    || (commentId !== null && typeof commentId !== 'string')) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
