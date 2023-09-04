const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

describe('/threads/thread-123/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const getAccessToken = async () => {
    const server = await createServer(container);

    // add user
    const userResponse = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    const { data: { addedUser } } = JSON.parse(userResponse.payload);

    // login user
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    return {
      server,
      accessToken,
      user: addedUser,
    };
  };

  describe('when POST /threads/thread-123/comments', () => {
    it('should response 201 and persisted thread comment', async () => {
      // Arrange
      const { server, accessToken } = await getAccessToken();

      const threadPayload = {
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: 'user-123',
      };

      await ThreadsTableTestHelper.addThread(threadPayload);

      const requestPayload = {
        content: 'thread comment',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const { server, accessToken } = await getAccessToken();

      const threadPayload = {
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: 'user-123',
      };

      await ThreadsTableTestHelper.addThread(threadPayload);

      const requestPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const { server, accessToken } = await getAccessToken();

      const threadPayload = {
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: 'user-123',
      };

      await ThreadsTableTestHelper.addThread(threadPayload);

      const requestPayload = {
        content: {},
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const { server, accessToken } = await getAccessToken();

      const requestPayload = {
        content: 'thread comment',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
    });
  });

  describe('when DELETE /threads/thread-123/comments/comment-123', () => {
    it('should response 403 when thread comment deleted not by owner', async () => {
      // Arrange
      const { server, accessToken } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 when thread comment deleted successfully', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when POST /threads/thread-123/comments/comment-123/replies', () => {
    it('should response 201 and persisted comment reply', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      const requestPayload = {
        content: 'content reply',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when DELETE /threads/thread-123/comments/comment-123/replies/reply-123', () => {
    it('should response 404 when reply not found', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-xxx',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(expect.any(String));
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 403 when reply delete not by owner', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      await UsersTableTestHelper.addUser({
        id: 'user-12x',
        username: '12x',
        password: 'secret',
        fullname: 'Anonymous',
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-12x',
        content: 'reply comment',
        commentId: 'comment-123',
        userId: 'user-12x',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-12x',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(expect.any(String));
      expect(responseJson.message).not.toEqual('');
    });

    it('should response 200 when reply deleted successfully', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-123',
        content: 'reply comment',
        commentId: 'comment-123',
        userId: user.id,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });

  describe('when PUT /threads/thread-123/comments/comment-123/likes', () => {
    it('should response 200 when thread comment liked', async () => {
      // Arrange
      const { server, accessToken, user } = await getAccessToken();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread title',
        body: 'body thread',
        owner: user.id,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'thread comment',
        threadId: 'thread-123',
        owner: user.id,
      });

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-123/comments/comment-123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
