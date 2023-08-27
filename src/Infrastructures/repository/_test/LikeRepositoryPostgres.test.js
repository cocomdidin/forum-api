const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const AddedLike = require('../../../Domains/likes/entities/AddedLike');
const UpdateLike = require('../../../Domains/likes/entities/UpdateLike');
const UpdatedLike = require('../../../Domains/likes/entities/UpdatedLike');
const Like = require('../../../Domains/likes/entities/Like');

describe('LikeRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  beforeEach(async () => {
    await LikesTableTestHelper.addLike({});
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable({});
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  describe('addLike function', () => {
    it('should persist addLike and return addedLike correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '222';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await likeRepositoryPostgres.addLike({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const likes = await LikesTableTestHelper.findLikeById('like-222');
      expect(likes).toHaveLength(1);
    });

    it('should return added like correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '333';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedLike = await likeRepositoryPostgres.addLike({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      expect(addedLike.updatedAt).not.toBeNull();
      expect(addedLike).toStrictEqual(new AddedLike({
        id: 'like-333',
        commentId: 'comment-123',
        userId: 'user-123',
        isLiked: true,
        updatedAt: addedLike.updatedAt,
      }));
    });
  });

  describe('updateLike function', () => {
    it('should updateLike and return updatedLike correctly', async () => {
      // Arrange
      const updateLike = new UpdateLike({
        id: 'like-123', commentId: 'comment-123', userId: 'user-123', isLiked: false,
      });

      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const updatedLike = await likeRepositoryPostgres.updateLike(updateLike);

      // Assert
      const updatedLikeExpected = new UpdatedLike({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
        isLiked: false,
        updatedAt: updatedLike.updatedAt,
      });

      expect(updatedLike.updatedAt).not.toBeNull();
      expect(updatedLike).toStrictEqual(updatedLikeExpected);
    });
  });

  describe('exist function', () => {
    it('should return true if like exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isExist = await likeRepositoryPostgres.exist({ commentId: 'comment-123', userId: 'user-123' });

      // Assert
      expect(isExist).toEqual(true);
    });

    it('should return false if like not exist', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const isExist = await likeRepositoryPostgres.exist({ commentId: 'comment-xxx', userId: 'user-321' });

      // Assert
      expect(isExist).toEqual(false);
    });
  });

  describe('findByComment function', () => {
    it('should return like entities correctly', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const like = await likeRepositoryPostgres.findByComment({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const likeExpected = new Like({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
        isLiked: true,
        updatedAt: like.updatedAt,
      });

      expect(like).toEqual(likeExpected);
    });
  });

  describe('reverse function', () => {
    it('should update and return like entities correctly', async () => {
      // Arrange
      const idGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, idGenerator);

      // Action
      const like = await likeRepositoryPostgres.reverse({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const likeExpected = new Like({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
        isLiked: false,
        updatedAt: like.updatedAt,
      });

      expect(like).toStrictEqual(likeExpected);
    });

    it('should add and return like entities correctly', async () => {
      // Arrange
      await LikesTableTestHelper.cleanTable();

      const idGenerator = () => '123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, idGenerator);

      // Action
      const like = await likeRepositoryPostgres.reverse({
        commentId: 'comment-123',
        userId: 'user-123',
      });

      // Assert
      const likeExpected = new Like({
        id: 'like-123',
        commentId: 'comment-123',
        userId: 'user-123',
        isLiked: true,
        updatedAt: like.updatedAt,
      });

      expect(like).toStrictEqual(likeExpected);
    });
  });
});
