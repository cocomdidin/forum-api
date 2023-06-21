const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
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
});
