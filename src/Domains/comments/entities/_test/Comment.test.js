const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: {},
      date: 123,
      username: 123,
      isDeleted: 123,
      likeCount: '123',
    };

    // Action and Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content comment',
      date: new Date(),
      username: 'johndoe',
      isDeleted: false,
      likeCount: 0,
    };

    // Action
    const reply = new Comment(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(expect.any(Date));
    expect(reply.username).toEqual(payload.username);
    expect(reply.likeCount).toEqual(payload.likeCount);
  });

  it('should create Comment object when deleted reply correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content comment',
      date: new Date(),
      username: 'johndoe',
      isDeleted: true,
      likeCount: 0,
    };

    // Action
    const reply = new Comment(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**komentar telah dihapus**');
    expect(reply.date).toEqual(expect.any(Date));
    expect(reply.username).toEqual(payload.username);
    expect(reply.likeCount).toEqual(payload.likeCount);
  });
});
