const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain any property', async () => {
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute({}))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    const useCasePayload = {
      id: 123,
      userId: {},
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({});

    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockReplyRepository.verifyReplyAvailability = jest.fn(useCasePayload.id)
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(useCasePayload)
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(useCasePayload)
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReplyAvailability).toHaveBeenCalledWith(useCasePayload.id);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.deleteReply).toHaveBeenCalledWith(useCasePayload);
  });
});
