const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content comment',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      content: 'thread comment',
      commentId: null,
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddComment(payload);

    // Assert
    expect(addedComment.threadId).toEqual(payload.threadId);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.commentId).toEqual(payload.commentId);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
