const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      commentId: 123,
      userId: {},
      content: {},
    };

    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      commentId: 'comment-123',
      userId: 'user-123',
      content: 'content reply',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.id).toEqual(payload.id);
    expect(addReply.commentId).toEqual(payload.commentId);
    expect(addReply.userId).toEqual(payload.userId);
    expect(addReply.content).toEqual(payload.content);
  });
});
