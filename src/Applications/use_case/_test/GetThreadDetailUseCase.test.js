const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should throw error if use case payload not contain any property', async () => {
    // Arrange
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});
    // Action & Assert
    await expect(getThreadDetailUseCase.execute(null))
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const getThreadDetailUseCase = new GetThreadDetailUseCase({});
    // Action & Assert
    await expect(getThreadDetailUseCase.execute(123))
      .rejects
      .toThrowError('GET_THREAD_DETAIL_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error if thread not found', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => {
      throw new NotFoundError('Thread tidak ditemukan');
    });
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(null));
    mockCommentRepository.getCommentsByThread = jest.fn(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(getThreadDetailUseCase.execute(useCasePayload))
      .rejects
      .toThrowError(NotFoundError);
  });

  it('should orchestrating the get thread detail action correctly', async () => {
    // Arrange
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2021-08-08T07:22:53.000Z',
      username: 'dicoding',
    };

    const expectedComments = [{
      id: 'comment-123',
      content: 'content comment',
      date: '2021-08-08T07:22:53.000Z',
      username: 'dicoding',
    }];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThread = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(expectedThread.id);

    // Assert
    expect(threadDetail).toStrictEqual({
      ...expectedThread,
      comments: expectedComments,
    });

    expect(threadDetail.id).toBe(expectedThread.id);
    expect(threadDetail.title).toBe(expectedThread.title);
    expect(threadDetail.body).toBe(expectedThread.body);
    expect(threadDetail.date).toBe(expectedThread.date);
    expect(threadDetail.username).toBe(expectedThread.username);
    expect(threadDetail.comments).toStrictEqual(expectedComments);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(expectedThread.id);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(expectedThread.id);
  });

  it('should orchestrating the get thread detail action correctly when comment is empty', async () => {
    // Arrange
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2021-08-08T07:22:53.000Z',
      username: 'dicoding',
    };

    const expectedComments = [];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThread = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(expectedThread.id);

    // Assert
    expect(threadDetail).toStrictEqual({
      ...expectedThread,
      comments: expectedComments,
    });

    expect(threadDetail.id).toBe(expectedThread.id);
    expect(threadDetail.title).toBe(expectedThread.title);
    expect(threadDetail.body).toBe(expectedThread.body);
    expect(threadDetail.date).toBe(expectedThread.date);
    expect(threadDetail.username).toBe(expectedThread.username);
    expect(threadDetail.comments).toStrictEqual(expectedComments);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(expectedThread.id);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(expectedThread.id);
  });

  it('should orchestrating the get thread detail action correctly when comment is deleted', async () => {
    // Arrange
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread title',
      body: 'Thread body',
      date: '2021-08-08T07:22:53.000Z',
      username: 'dicoding',
    };

    const expectedComments = [{
      id: 'comment-123',
      content: '**komentar telah dihapus**',
      date: '2021-08-08T07:22:53.000Z',
      username: 'dicoding',
    }];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThread = jest.fn(expectedThread.id)
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          date: '2021-08-08T07:22:53.000Z',
          username: 'dicoding',
          content: 'sebuah komentar',
          deleted_at: new Date(),
        },
      ]));

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(expectedThread.id);

    // Assert
    expect(threadDetail).toStrictEqual({
      ...expectedThread,
      comments: expectedComments,
    });

    expect(threadDetail.id).toBe(expectedThread.id);
    expect(threadDetail.title).toBe(expectedThread.title);
    expect(threadDetail.body).toBe(expectedThread.body);
    expect(threadDetail.date).toBe(expectedThread.date);
    expect(threadDetail.username).toBe(expectedThread.username);
    expect(threadDetail.comments).toStrictEqual(expectedComments);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(expectedThread.id);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(expectedThread.id);
  });
});
