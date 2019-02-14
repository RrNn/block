const db = require('../config/database');

// mailing packages
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

/*
  Check whther the user exists.
 */
async function userExists(id) {
  // return true here because we are using this to check
  // for the availability of the user but if one is registering
  // by them selves, the referrer_user_id is not sent so its undefined
  // but we use this fn: to check, we should return true here.
  if (id === undefined) return true;
  try {
    const user = await db.any(`SELECT * FROM users where id = ${id}`, [true]);
    if (user.length < 1) return false;
    return true;
  } catch (e) {
    console.error(e);
    return e;
  }
}
/*
  Check whether the user has reached their max referrals of 4
  people
 */
async function referralMax(referrer_id) {
  // we return 0 here because the referrer_id was not passed
  // and so we should go ahead and register with a null
  // referrer_user_id. We could return anything like 0,1,2 or 3
  if (referrer_id === undefined) return 0;
  try {
    const users = await db.any(
      `select * from users where referrer_user_id=${referrer_id}`,
      [true]
    );
    return users.length;
  } catch (e) {
    console.error(e);
    return e;
  }
}

// Function tha is used to send emails.
  async function mailer(receiver_email,user_name,secret_sha=''){
    
    const oauth2Client = new OAuth2(
     process.env.GOOGLE_OATH2_CLIENT_ID, // ClientID
     process.env.GOOGLE_OATH2_CLIENT_SECRET, // Client Secret
     process.env.GOOGLE_OATH2_REDIRECT_URI // Redirect URL
    );
    oauth2Client.setCredentials({refresh_token: process.env.GOOGLE_OATH2_REFRESH_TOKEN});
    const tokens = await oauth2Client.refreshAccessToken()
    // get the access token, expires in about 3000ms
    const accessToken = tokens.credentials.access_token
    
    const smtpTransport = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          type: 'OAuth2',
          user: 'nabaasarichard@gmail.com', 
          clientId: process.env.GOOGLE_OATH2_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OATH2_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_OATH2_REFRESH_TOKEN,
          accessToken: accessToken
     }
    });
    
    // The html content of the email.
    const mailContent = `
    <head>
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css?family=Open+Sans:300i')
        @import url('https://fonts.googleapis.com/css?family=Tangerine')
      </style>
    </head>
    <body>
      <div style="background-color: #008dfd; color:#fff; padding-top: 0.01%;
          margin:auto; width:100%;">

        <h1 style="font-family: 'Tangerine', serif; font-size: 35px; 
        text-shadow: 4px 4px 4px #395776; text-align: center;">
          Welcome to Multi Level Block Marketing.
        </h1>

        <div class="details" style="background-color: #e8f5fd; color:maroon; 
          font-family: 'Open Sans', sans-serif; padding-top:1%; padding-bottom: 2%;
          padding-left: 2%;">
            <p>Thanks for signing up ${user_name}. You're welcome.</p>
            <p>Please click the link below to confirm your email address</p>
          <a href="${process.env.BASE_URL}/users/${secret_sha}">Click here to verify your email addrress.</a>
        </div>
      </div>
    </body>
    `

    const mailOptions = {
     from: '"Multi Level Marketing" <nabaasarichard@gmail.com>',
     to: receiver_email,
     subject: "Welcome to Block-i",
     generateTextFromHTML: true,
     html: mailContent
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
     error ? console.log('ERROR!',error) : console.log('SUCCESS!',response);
     smtpTransport.close();
    });
  }

module.exports.userExists = userExists;
module.exports.referralMax = referralMax;
module.exports.mailer = mailer;
