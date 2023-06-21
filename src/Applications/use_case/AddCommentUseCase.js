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

  async _validatePayload(payload) {
    if (!payload) {
      throw new Error('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    const thread = await this._threadRepository.getThreadById(payload.threadId);
    if (!thread) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_ID_IS_NOT_FOUND');
    }
  }
}

module.exports = AddCommentUseCase;
