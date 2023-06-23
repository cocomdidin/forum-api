const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    const addComment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(addComment);
  }

  async _validatePayload({
    threadId,
    content,
    commentId,
    owner,
  }) {
    if (!threadId || !content || !owner) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_ID_IS_NOT_FOUND');
    }
  }
}

module.exports = AddCommentUseCase;
