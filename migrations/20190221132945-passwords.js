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
    'passwords',
    {
      user_id:{
          type: 'int',
          primaryKey: true,
          autoIncrement: true,
      },
      password:{
          type:'string',
          notNull:false,
          length:200
      }
    },
    (error) => {
      if (error) return callback(error);
      return callback();
    })
};

exports.down = function(db, callback) {
  db.dropTable('passwords', callback);
};

exports._meta = {
  "version": 1
};
