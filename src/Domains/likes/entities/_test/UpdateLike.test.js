const UpdateLike = require('../UpdateLike');

describe('a UpdateLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new UpdateLike(payload)).toThrowError('UPDATE_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      commentId: 123,
      userId: {},
      isLiked: 'true',
    };

    // Action and Assert
    expect(() => new UpdateLike(payload)).toThrowError('UPDATE_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      isLiked: true,
    };

    // Action
    const addedLike = new UpdateLike(payload);

    // Assert
    expect(addedLike.id).toEqual(payload.id);
    expect(addedLike.commentId).toEqual(payload.commentId);
    expect(addedLike.userId).toEqual(payload.userId);
    expect(addedLike.isLiked).toEqual(payload.isLiked);
  });
});
