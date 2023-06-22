class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    await this._verifyThread(useCasePayload);
    await this._verifyCommentOwner(useCasePayload);
    await this._commentRepository.deleteCommentById(useCasePayload.commentId);
  }

  async _validatePayload(payload) {
    if (!payload) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ANY_PROPERTY');
    }

    const { commentId, threadId, owner } = payload;
    if (!commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
    }

    if (!threadId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_ID');
    }

    if (!owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async _verifyThread({ threadId }) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }
  }

  async _verifyCommentOwner({ commentId, owner }) {
    const comment = await this._commentRepository.getCommentById(commentId);

    if (!comment) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    if (comment.owner !== owner) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED');
    }
  }
}

module.exports = DeleteCommentUseCase;
