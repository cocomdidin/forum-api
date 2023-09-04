const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

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

  describe('verifyReplyAvailability function', () => {
    it('should not throw NotFoundError when reply available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert & action
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply not available', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert & action
      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-xxx'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should not throw AuthorizationError when reply owner', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert & action
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: 'reply-123', userId: 'user-123' }))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when not reply owner', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Assert & action
      await expect(replyRepositoryPostgres.verifyReplyOwner({ id: 'reply-123', userId: 'user-xxx' }))
        .rejects.toThrowError(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply({ id: 'reply-123' });

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
      expect(reply[0].deleted_at).toEqual(expect.any(Date));
    });
  });
});
