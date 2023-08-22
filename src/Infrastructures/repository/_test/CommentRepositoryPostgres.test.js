const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable({});
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});

      const addComment = {
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'content comment',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById('comment-123');

      // Assert
      expect(comment).toStrictEqual({
        id: 'comment-123',
        content: 'content comment',
        owner: 'user-123',
        username: 'dicoding',
        date: expect.any(Date),
      });
    });
  });

  describe('getCommentsByThread function', () => {
    it('should return comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThread(addComment.threadId);

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].date).toEqual(expect.any(Date));
      expect(comments[0].content).toEqual('content comment');
      expect(comments[0].deleted_at).toBeNull();
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].deleted_at).toEqual(expect.any(Date));
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Assert & action
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Assert & action
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-456'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw AuthorizationError when comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Assert & action
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when not comment owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const addComment = new AddComment({
        threadId: 'thread-123',
        content: 'content comment',
        commentId: null,
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Assert & action
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-xxx'))
        .rejects.toThrowError(AuthorizationError);
    });
  });
});
