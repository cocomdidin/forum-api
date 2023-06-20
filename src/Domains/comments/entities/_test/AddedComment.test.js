const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'content comment',
    };

    // Action and Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should create addedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      threadId: 'thread-123',
      content: 'thread comment',
      commentId: null,
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.threadId).toEqual(payload.threadId);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.commentId).toEqual(payload.commentId);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
