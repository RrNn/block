### Multi-Level Block Marketing.

#### Requirements.

- Node
- Postgres or MySQL. Or any DB of your choice :grin:
- **db-migrate** This is a node_module for enabling migrations. You can install it globally on your machine with
  `npm install -g db-migrate` or just in this project with `npm install db-migrate`

###### To run the application.

- Clone it
- Create a `.env` file and set the following

###### These are .env vars but they are really not secret, but nevertheless, they suit to be in the env, because when you host the application, they will have to change and will be secret then.

- `HOST=localhost`
- `BASE_URL=http://localhost:3000`
- `DATABASE=block`
- `DB_PORT=5432`
- `DB_PASSWORD=password of your choice`
- `USER=the user`
- `JWT_CERT= a long hashed secret` This will be used in the generation of JWT tokens and verifying them to
  check for things like expired tokens and or broken tokens. Its for your protection baby :wink:
- You will need to set up your OATH2 client and redirect URIs. The redirect URI can be
  `https://developers.google.com/oauthplayground`

###### The Google Oath2 keys for auto sending emails are,

- `GOOGLE_OATH2_CLIENT_ID`
- `GOOGLE_OATH2_CLIENT_SECRET`
- `GOOGLE_OATH2_REDIRECT_URI`
- `GOOGLE_OATH2_REFRESH_TOKEN`

For more info you can visit the [Google Oath2](https://developers.google.com/identity/protocols/OAuth2)
and the [Google Playground](https://developers.google.com/oauthplayground/) to get accustomed to Oath2, if
you already havent.

- Install the packages `npm install`

- Run the migrations `db-migrate up` and this will run all the migrations. You can checkout the **db-migrate** docs [here](https://db-migrate.readthedocs.io/en/latest/)

###### The available end points are

- Welcome message `GET` `/` and the response is `Welcome to Block`

- Registration `POST` `/users/register` and the data format is,

```
{
  "full_name":"Nabaasa Richard",
  "dob":"12-09-1789",
  "email":"nabrrikk@@yahoo.com",
  "contact":"0703318890",
  "initial_amount":200000,
  "origin":"EastAfrica",
  "referrer_user_id":"1"
}
```

The `referrer_user_id` is optional because one might register without any referrer. Its only required when one gets referred by an already registered user.

On registration an email is sent to the user, with a link on which they will click. This activates their email in the DB. You can navigate to your DB to see the fields on the user table.

- Set the password `POST` `/users/setpassword` and the data format is,

```
{
  "user_id":1,
  "password":"12345"
}
```

For the `/users/setpassword` endpoint to work, the user email has to be verified.

- Login `POST` `/users/login` and the data format is,

```
{
  "email":"nabrrikk@@yahoo.com",
  "password":"12345"
}
```

- Edit a user, `POST` `/users/edit` and the data format is,

```
{
  "full_name":"Nabaasa Richard Cook",
  "dob":"12-09-1789",
  "email":"nabaasarichard@yahoo.com",
  "contact":"0771234567",
  "initial_amount":100000,
  "origin":"Uganda"
}
```

- Verify an email `GET` `/user/{wild-card}` and there is no data. Just an endpoint to verify the email.

- View all users `GET` `/users/` and there is no data.

- Make initial payment `POST` `/payments/` and the data format is,

```
{
  "user_id":1,
  "initial_amount":700000
}
```

To see the application, navigate to the heroku hosted application here https://block-i.herokuapp.com/
