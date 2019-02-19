'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable(
    'users',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
      },
      referrer_user_id: {
        type: 'int',
        notNull: false,
      },
      full_name: {
        type: 'string',
        length: 40,
        notNull: true,
      },
      origin: {
        type: 'string',
        notNull: true,
      },
      dob: {
        type: 'date',
      },
      contact: {
        type: 'string',
        length: 10,
        unique: true,
        notNull: true,
      },
      email: {
        type: 'string',
        length: 50,
        unique: true,
        notNull: true,
      },
      password:{
        type:'string',
        notNull:false,
        length:200
      },
      verified:{
        type:'string',
        length:150,
      }
    },
    (error) => {
      if (error) return callback(error);
      return callback();
    }
  );
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};

exports._meta = {
  version: 1,
};
