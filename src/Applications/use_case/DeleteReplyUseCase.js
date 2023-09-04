class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this.replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._validatePayload(useCasePayload);
    await this.replyRepository.verifyReplyAvailability(useCasePayload.id);
    await this.replyRepository.verifyReplyOwner(useCasePayload);
    await this.replyRepository.deleteReply(useCasePayload);
  }

  async _validatePayload({ id, userId }) {
    if (!id || !userId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof userId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
