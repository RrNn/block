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
  'user_refs',{
        referrer_user_id:{
          type: 'int',
          autoIncrement: true,
      },
        referred_user_id:{
          type: 'int',
          primaryKey: true,
          autoIncrement: true,
          unique:true
      }
    },
    (error) => {
      if (error) return callback(error);
      return callback();
    })
};

exports.down = function(db, callback) {
  db.dropTable('user_refs', callback);
};

exports._meta = {
  "version": 1
};
