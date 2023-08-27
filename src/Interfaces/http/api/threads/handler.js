const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const ReverseLikeOfCommentUseCase = require('../../../../Applications/use_case/ReverseLikeOfCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.getThreadHandler = this.getThreadHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async getThreadHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance('GetThreadDetailUseCase');
    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id } = request.auth.credentials;

    const addedThread = await addThreadUseCase.execute({ ...request.payload, owner: id });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId } = request.params;
    const addComment = {
      ...request.payload, owner: id, threadId, commentId: null,
    };

    const addedComment = await addCommentUseCase.execute(addComment);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const payload = { owner: id, threadId, commentId };

    await deleteCommentUseCase.execute(payload);

    return {
      status: 'success',
    };
  }

  async putLikeHandler(request) {
    const reverseLikeOfCommentUseCase = this._container.getInstance(ReverseLikeOfCommentUseCase.name);
    const { id } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const payload = { threadId, commentId, userId: id };

    await reverseLikeOfCommentUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = ThreadsHandler;
