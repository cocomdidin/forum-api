const Like = require('../../Domains/likes/entities/Like');
const UpdateLike = require('../../Domains/likes/entities/UpdateLike');

class ReverseLikeOfCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);
    await this._commentRepository.verifyCommentAvailability(useCasePayload.commentId);
    return this._likeRepository.reverse(useCasePayload);
  }

  async _validatePayload({ threadId, commentId, userId }) {
    if (!threadId || !commentId || !userId) {
      throw new Error('REVERSE_LIKE_OF_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
      throw new Error('REVERSE_LIKE_OF_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ReverseLikeOfCommentUseCase;
