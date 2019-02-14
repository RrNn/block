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

    // Generate a random string for verifying the email later
    let randomStr = ''
    for(let i=1;i<10;i++){
      randomStr = randomStr+''+Math.random().toString(36).replace('0.','')
    }
    // Add the random string to the data object that is sent by the user.
    data.verified = randomStr
    
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
      .then((resp) => {
        // Send an email to the user that just signed up
        // for them to confirm the email with the random Str.
        helpers.mailer(data.email,data.full_name,randomStr);

        return `Done, an email was sent to ${data.email}. Click on the link in the email to confirm your email`;
      })
      .catch((error) => {
        const errText = `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`;
        return errText.replace('=', ' ');
      });
  }

  async edit(data) {
    console.log(data)
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
        console.error(error);
        const errText = error.detail
          ? `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`
          : 'An error occured!';
        return errText;
      });
  }

  static verifyEmail(sha){
    return db.query(`update users set verified='true' where verified='${sha}' returning *`,[true, 1111])
    .then(data=>{
      console.log(data)
      return data.length === 0 ?
       {error:`Your email has not been verified. Either it's verified already or the link you clicked on is broken`} : 
       {success:'Email has been verified'}
    })
    .catch(error=>{
      console.error(error)
      return {error:'AN error occured'}
    })
  }

}

module.exports = User;
