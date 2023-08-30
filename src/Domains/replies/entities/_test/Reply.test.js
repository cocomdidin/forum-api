const Reply = require('../Reply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: {},
      date: 123,
      username: 123,
      isDeleted: 123,
    };

    // Action and Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: 'content balasan',
      date: '2021-08-08T07:59:48.766Z',
      username: 'johndoe',
      isDeleted: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });

  it('should create Reply object when deleted reply correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-BErOXUSefjwWGW1Z10Ihk',
      content: 'content balasan',
      date: '2021-08-08T07:59:48.766Z',
      username: 'johndoe',
      isDeleted: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.date).toEqual(payload.date);
    expect(reply.username).toEqual(payload.username);
  });
});
