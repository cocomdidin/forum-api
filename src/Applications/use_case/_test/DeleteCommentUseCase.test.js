const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should throw error if use case payload not contain any property', async () => {
    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(null))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ANY_PROPERTY');
  });

  it('should throw error if use case payload not contain commentId', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID');
  });

  it('should throw error if use case payload not contain threadId', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_ID');
  });

  it('should throw error if use case payload not contain owner', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    const useCasePayload = {
      commentId: 123,
      threadId: true,
      owner: {},
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread not found', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-XXX',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.commentId }));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should throw error if comment not found', async () => {
    const useCasePayload = {
      commentId: 'comment-XXX',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.threadId }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if comment not owned', async () => {
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-XXXX',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'comment-123', owner: 'user-123' }));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.threadId }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: useCasePayload.threadId }));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCasePayload.commentId, owner: useCasePayload.owner,
      }));
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.getCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
