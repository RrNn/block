const db = require('../config/database');

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

module.exports.userExists = userExists;
module.exports.referralMax = referralMax;
