const LikeRepository = require('../../../Domains/likes/LikeRepository');
const ReverseLikeOfCommentUseCase = require('../ReverseLikeOfCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Like = require('../../../Domains/likes/entities/Like');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('ReverseLikeOfCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.reverse = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const reverseLikeOfCommentUseCase = new ReverseLikeOfCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(reverseLikeOfCommentUseCase.execute(useCasePayload)).rejects.toThrowError('REVERSE_LIKE_OF_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 123,
      commentId: 123,
      userId: {},
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.reverse = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const reverseLikeOfCommentUseCase = new ReverseLikeOfCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(reverseLikeOfCommentUseCase.execute(useCasePayload)).rejects.toThrowError('REVERSE_LIKE_OF_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the add like action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    const mockLike = new Like({
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      isLiked: false,
      updatedAt: '2021-08-08T07:22:53.000Z',
    });

    const expectedLike = new Like({
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      isLiked: false,
      updatedAt: '2021-08-08T07:22:53.000Z',
    });

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockLikeRepository.reverse = jest.fn(() => Promise.resolve(mockLike));

    /** creating use case instance */
    const reverseLikeOfCommentUseCase = new ReverseLikeOfCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const reversed = await reverseLikeOfCommentUseCase.execute(useCasePayload);

    // Assert
    expect(reversed).toStrictEqual(expectedLike);
    expect(mockLikeRepository.reverse).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalled();
  });
});
