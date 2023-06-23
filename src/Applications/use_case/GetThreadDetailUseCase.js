class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._validatePayload(threadId);
    return this._getThreadDetail(threadId);
  }

  async _validatePayload(payload) {
    if (!payload) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload !== 'string') {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  async _getThreadDetail(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);

    if (!thread) {
      throw new Error('GET_THREAD_DETAIL_USE_CASE.THREAD_NOT_FOUND');
    }

    const originComments = await this._commentRepository.getCommentsByThread(threadId);

    const comments = await Promise.all(originComments.map(async (comment) => {
      const {
        id, username, date, content, deleted_at: deletedAt,
      } = comment;

      return {
        id, username, date, content: deletedAt ? '**komentar telah dihapus**' : content,
      };
    }));

    return { ...thread, comments };
  }
}

module.exports = GetThreadDetailUseCase;
