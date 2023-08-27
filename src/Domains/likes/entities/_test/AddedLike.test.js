const AddedLike = require('../AddedLike');

describe('a AddedLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddedLike(payload)).toThrowError('ADDED_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      commentId: 123,
      userId: {},
      isLiked: 'true',
      updatedAt: '2021-08-08T07:22:53.000Z',
    };

    // Action and Assert
    expect(() => new AddedLike(payload)).toThrowError('ADDED_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      id: 'like-123',
      commentId: 'comment-123',
      userId: 'user-123',
      isLiked: true,
      updatedAt: '2021-08-08T07:22:53.000Z',
    };

    // Action
    const addedLike = new AddedLike(payload);

    // Assert
    expect(addedLike.id).toEqual(payload.id);
    expect(addedLike.commentId).toEqual(payload.commentId);
    expect(addedLike.userId).toEqual(payload.userId);
    expect(addedLike.isLiked).toEqual(payload.isLiked);
    expect(addedLike.updatedAt).toEqual(payload.updatedAt);
  });
});
