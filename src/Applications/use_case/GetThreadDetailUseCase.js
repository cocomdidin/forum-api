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

    const comments = await this._commentRepository.getCommentsByThread(threadId);

    return { ...thread, comments };
  }
}

module.exports = GetThreadDetailUseCase;