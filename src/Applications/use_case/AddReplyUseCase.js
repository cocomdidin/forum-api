class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);
    return this._replyRepository.addReply(useCasePayload);
  }

  async _validatePayload({
    threadId,
    commentId,
    content,
    userId,
  }) {
    if (!threadId || !content || !userId || !commentId) {
      throw new Error('ADD_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string'
      || typeof commentId !== 'string'
      || typeof content !== 'string'
      || typeof userId !== 'string') {
      throw new Error('ADD_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReplyUseCase;
