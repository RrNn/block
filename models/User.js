const db = require('../config/database');
const helpers = require('./helpers');
const bcrypt = require('bcrypt');


console.log('DATABASE OBJECT:', db);

class User {
  constructor() {
    // this.all = this.all;
  }
  static all() {
    const query = db.query(`select 
      id,
      full_name,
      origin,
      dob,
      contact,
      email,
      verified
      from users`);
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

    // check whether the referring user exists.
    // If the "referrer_user_id" was not passed, just equate userExists to true.
    const userExists = data.referrer_user_id ? await helpers.userExists(data.referrer_user_id) : true;
    
    if(!userExists) return `User with refferer id ${data.referrer_user_id} does not exist`;
    
    // Delete the "referrer_user_id" key from the data because we shall use
    // it on the user_refs table instead. If we dont delete it, we shall have
    // errors while inserting data in the users table. We shall sve it in a 
    // constant and delete it from the received "data" object.
    const referrer_user_id = data.referrer_user_id;
    delete data.referrer_user_id
    
    const keys = Object.keys(data).toString();

    const dataValues = Object.values(data);

    let values = '';

    for (let value in dataValues) {

      dataValues[value] === dataValues[dataValues.length - 1]

      ? (values += "'" + dataValues[value] + "'")

      : (values += "'" + dataValues[value] + "',");

    }

    

    // check whether the user referring the registrant has not hit
    // the maximun number of 4 referrals.
    const numberOfRefferals = await helpers.referralMax(referrer_user_id);

    if (numberOfRefferals >= 4)
      return {

        message: `Maximum of 4 people already reached by ${data.full_name}'s referrer`

      };

      try {

        const resp = await db.query(`insert into users (${keys}) values (${values}) returning *`);

        // check if there is any response
        if(resp.length > 0){
          // check if the referrer_user_id constant is not undefined, because its optional.
          if(referrer_user_id){

            await db.query(`insert into user_refs (referrer_user_id,referred_user_id) values(${referrer_user_id},${resp[0].id})`);

          }
        // Send an email to the user that just signed up
        // for them to confirm the email with the random Str.
        helpers.mailer(data.email,data.full_name,randomStr);

        return `Done, an email was sent to ${data.email}. Click on the link in the email to confirm your email`;

      }

      return `Something went wrong, try again later`;


    } catch(error) {
      console.error(error);

      const errText = `The${error.detail.replace(/\(|\)|(Key)/gi, '')}`;

      return errText.replace('=', ' ');

    }

  }

  async edit(data) {
    console.log(data);
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

  async setPassword(userData){
    
    try {
      // Check for user existence before updating the password
      const data = await db.query(`select * from users where id=${userData.user_id}`)
      if(data.length === 0) return { message: 'User not found' };
      if(data[0].verified != 'true') return { message:'Your email is not verified' };
      // hash the password.
      const hash = await bcrypt.hash(userData.password,10)
      // Insert the password and user id in the passwords table.
      const resp = await db.query(`insert into passwords(user_id,password) values ('${userData.user_id}','${hash}')`);
      
      if(Array.isArray(resp)) return { message: 'Password set sucessfully' };
      return { message: 'Something went wrong and password wasnt updated' }
      
    } catch(error) {
      console.error('SET_PASSWORD_ERROR',error);
      return { message: 'Something went wrong and password wasnt updated' }
    }
  }

  static async login(email,password){
    try {
      // check whether the user exisst in the users table
      user = await db.query(`select * from users where email='${email}'`)
      // No user ? then return immediatel with the message
      if(user.length === 0) return { message: 'User does not exist' };
      // Email not verified ? then return immediately with the message.
      if(user[0].verified != 'true') return { message: 'Your email is not verified' };
      // All good ? check the passwords table for the user id and get the hashed password.
      const checkUserPassword = await db.query(`select password from passwords where user_id = ${user[0].id}`);
      // User not found in the passowrds table ? then return immediately.
      if(checkUserPassword.length === 0) return { message : 'User has not set the password yet' };
      // Carry on, if all is good. Check the hashed password.
      const response = await bcrypt.compare(password, checkUserPassword[0].password);
      
      // We delete the password on the user object because we dont want to
      // return it. We also dont want to use it to generate the JWT token.
      delete user[0].password

      // Prepare the JSON object to return.
      const resp = {
        message: 'Login successful',
        token: await helpers.generateJwtToken(user[0]),
        user: user[0]
      }
      // According to the result of the "bcrypt.compare", return accordingly.
      return response ? resp : { message:'Invalid login credentials' }
      
    } catch(error) {
      console.error('LOGIN_ERROR',error)
      return { message:'Invalid login credentials' }
    } 
  }

  static verifyEmail(sha){
    return db.query(`update users set verified=true where verified='${sha}' returning *`,[true, 1111])
    .then(data=>{
      return data.length === 0 ?
      {error:`Your email has not been verified. Either it's verified already or the link you clicked on is broken`} : 
      {success:'Email has been verified'}
    })
    .catch(error=>{
      console.error('VERIFY_EMAIL_ERROR',error)
      return {error:'An error occured'}
    })
  }

}

module.exports = User;
