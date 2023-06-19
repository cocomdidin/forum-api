const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const addThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThread);
  }

  _validatePayload(payload) {
    if (!payload) {
      throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  }
}

module.exports = AddThreadUseCase;
