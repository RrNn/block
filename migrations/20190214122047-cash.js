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

exports.up = function(db,callback) {
  db.createTable(
  'cash',
  {
    id:{
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    user_id:{
      type:'int',
      notNull:true,
      foreignKey:{
        name:'cash_users_id_fk',
        table:'users',
        rules:{},
        mapping:'id'       
      }
    },
    initial_amount:{
      type:'int',
      notNull:true
    },
    current_amount:{
      type:'int',
      notNull:false
    }
  },
    (error) => {
      if (error) return callback(error);
      return callback();
    }
  )
};

exports.down = function(db, callback) {
  db.dropTable('cash', callback);
};

exports._meta = {
  "version": 1
};
