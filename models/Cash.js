const db = require('../config/database');
const helpers = require('./helpers');

class Cash{
  constructor(){}
  async pay(data){
    
    // For now fake the current amount to 1000000
    data.current_amount = 1000000

    try {
      // Check if the user exists in the system.
      const userExists = await helpers.userExists(data.user_id)

      if(!userExists) return { message: `User doesnt exist` }

      // Check if the user has already paid the inital amount
      // or if its their first time then proceed and save the payment.
      const user = await db.query(`select * from cash where user_id = '${data.user_id}'`)
      
      if(user.length != 0){
        return { message: 'Initial payment already made' }
      }
      else{
        // this is where the Logic goes before inserting the cash into the DB.


        // Prepare the vaues and keys for inserting the data into the DB.
        // This is becasue we cannot just rely on the query structured as 
        // ***insert into tablename (col1,col2) values (val1,val2)*** because we
        // dont know the order of the data object that will be sent by the user.
        // it might be data = { key1:val1,key2:val2 } or { key2:val2,key1:val1 }
        const keys = Object.keys(data).toString();
        const dataValues = Object.values(data);
        let values = '';
        for (let value in dataValues) {
          dataValues[value] === dataValues[dataValues.length - 1]
            ? (values += "'" + dataValues[value] + "'")
            : (values += "'" + dataValues[value] + "',");
        }

        const payment = await db.query(`insert into cash (${keys}) values (${values}) returning *`)
        
        return { message: 'Payment has been recorded' }
      }
      
    } catch(error) {
      console.error(error);
      return { message:'Some thing went wrong' }
    }

  }

}


module.exports = Cash