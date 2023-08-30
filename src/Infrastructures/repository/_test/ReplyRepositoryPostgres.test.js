const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
    await RepliesTableTestHelper.addReply({});
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '222';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply({
        commentId: 'comment-123',
        content: 'sebuah reply',
        userId: 'user-123',
      });

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-222');
      expect(reply).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '333';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply({
        commentId: 'comment-123',
        content: 'sebuah reply',
        userId: 'user-123',
      });

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-333',
        content: 'sebuah reply',
        owner: 'user-123',
      }));
    });
  });

  describe('findByComment function', () => {
    it('should return reply entities correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const reply = await replyRepositoryPostgres.findByComment({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      expect(reply.length).toBeGreaterThan(0);
      expect(reply[0]).toBeInstanceOf(Reply);
      expect(reply[0].id).toEqual('reply-123');
      expect(reply[0].content).toEqual('content comment');
      expect(reply[0].date).not.toBeNull();
      expect(reply[0].username).toEqual('dicoding');
    });
  });
});
