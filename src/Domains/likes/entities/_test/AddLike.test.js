const AddLike = require('../AddLike');

describe('a AddLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 123,
      userId: {},
    };

    // Action and Assert
    expect(() => new AddLike(payload)).toThrowError('ADD_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addLike object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action
    const addedLike = new AddLike(payload);

    // Assert
    expect(addedLike.commentId).toEqual(payload.commentId);
    expect(addedLike.userId).toEqual(payload.userId);
  });
});
