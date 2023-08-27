class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._validatePayload(threadId);
    await this._threadRepository.verifyThreadAvailability(threadId);

    const thread = await this._threadRepository.getThreadById(threadId);
    const originComments = await this._commentRepository.getCommentsByThread(threadId);

    const comments = await Promise.all(originComments.map(async (comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.deleted_at ? '**komentar telah dihapus**' : comment.content,
      likeCount: parseInt(comment.like_count ?? 0, 10),
    })));

    return { ...thread, comments };
  }

  async _validatePayload(payload) {
    if (!payload) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload !== 'string') {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadDetailUseCase;
