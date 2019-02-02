const db = require('../config/database');
const helpers = require('./helpers');

console.log('DATABASE OBJECT:', db);

class User {
  constructor() {
    // this.all = this.all;
  }
  static all() {
    const query = db.query(`select * from users`);
    // this returns a promise
    return query.then((data) => data).catch((error) => {
      console.error(error);
      return error;
    });
  }

  async register(data) {
    const keys = Object.keys(data).toString();
    const dataValues = Object.values(data);

    let values = '';
    for (let value in dataValues) {
      dataValues[value] === dataValues[dataValues.length - 1]
        ? (values += "'" + dataValues[value] + "'")
        : (values += "'" + dataValues[value] + "',");
    }

    // check if the user referring the registrant exists in the DB.
    const userAvailable = await helpers.userExists(data.referrer_user_id);

    if (!userAvailable)
      return {
        error: `User with refferer id ${data.referrer_user_id} does not exist`,
        name: 'error',
      };
    // check whether the user referring the registrant has not hit
    // the maximun number of 4 referrals
    const numberOfRefferals = await helpers.referralMax(data.referrer_user_id);
    if (numberOfRefferals >= 4)
      return {
        error: `Maximum of 4 people already reached by ${
          data.full_name
        }'s referrer`,
        name: 'error',
      };

    return db
      .query(`insert into users (${keys}) values (${values})`)
      .then((resp) => 'Done')
      .catch((error) => {
        const errText = `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`;
        return errText.replace('=', ' ');
      });
  }

  async edit(data) {
    // check if the user we are editing exists.
    const userAvailable = await helpers.userExists(data.id);
    if (!userAvailable) return { error: 'User does not exist', name: 'error' };

    let fields = [];
    for (let datum in data) {
      if (datum == 'id') continue;
      fields.push(datum + "='" + data[datum] + "'");
    }

    return db
      .query(`update users set ${''.concat(fields)} where id=${data.id}`)
      .then((resp) => 'Successfully edited')
      .catch((error) => {
        console.log(error);
        const errText = error.detail
          ? `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`
          : 'An error occured!';
        return errText;
      });
  }
}

module.exports = User;
