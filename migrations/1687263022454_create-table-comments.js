/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    threadId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads',
      onDelete: 'CASCADE',
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    commentId: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: 'comments',
      onDelete: 'CASCADE',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('comments');
};
