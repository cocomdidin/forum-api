const AuthorizationError = require('./AuthorizationError');
const InvariantError = require('./InvariantError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak lengkap'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),

  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'ADD_COMMENT_USE_CASE.THREAD_ID_IS_NOT_FOUND': new NotFoundError('tidak dapat membuat comment baru karena threadId tidak ditemukan'),

  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_ANY_PROPERTY': new InvariantError('tidak dapat menghapus comment karena tidak ada properti yang dikirimkan'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_COMMENT_ID': new InvariantError('tidak dapat menghapus comment karena tidak ada properti commentId'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_THREAD_ID': new InvariantError('tidak dapat menghapus comment karena tidak ada properti threadId'),
  'DELETE_COMMENT_USE_CASE.NOT_CONTAIN_OWNER': new InvariantError('tidak dapat menghapus comment karena tidak ada properti owner'),
  'DELETE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat menghapus comment karena tipe data tidak sesuai'),
  'DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena thread tidak ditemukan'),
  'DELETE_COMMENT_USE_CASE.COMMENT_NOT_OWNED': new AuthorizationError('tidak dapat menghapus comment karena tidak memiliki akses'),
  'DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena comment tidak ditemukan'),
};

module.exports = DomainErrorTranslator;
