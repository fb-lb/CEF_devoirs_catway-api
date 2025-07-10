# Russell harbor API - Express Application

This project is an API to manage reservations on catways. You can use this API by an API client like Postman or through a browser with a friendly interface.

---

## Main features

- Login page
- Dashboard
    - Create, Update, Delete users
    - CRUD interface for catways
    - CRUD interface for reservations
- Display all catways list with links to individual catway details
- Display all reservations list with links to individual reservation details
- API documentation explaining how to use each route

The login page and API documentation are accessible to everyone.  
The dashboard and detailed pages (catways or reservations) are protected by authentication via a token stored in cookies, delivered upon login.

---

## Technologies

- IDE : [VSCode](https://code.visualstudio.com/)
- [NodeJs](https://nodejs.org/en/download)

- Express : 4.21.2
- HTML / CSS for EJS templates
- JavaScript
- MongoDB free cluster : [create an account](https://account.mongodb.com/account/login)
- MongoDB local interface : [MongoDB Compass (GUI)](https://www.mongodb.com/try/download/compass)

---

## Local installation

1. **Download project**

Go [here](https://github.com/fb-lb/CEF_devoirs_catway-api).  
Click on green button 'Code' and 'Download ZIP'.  
Extract files.

2. **Create database in Compass**

In Compass, ceate a new database.  
Open the shell and create a new user :

```shell
use database_name
db.createUser({
  user: "username",
  pwd: "password",
  roles: [
    { role: "readWrite", db: "database-name" }
  ]
})
```

3. **Import data in the database**

In compass click on the database you've just created.  
Create three collections : `users`, `catways`, `reservations`.  

Then import the JSON files from the `data/` folder:
- In `users` collection → import `users.json`
- In `catways` collection → import `catways.json`
- In `reservations` collection → import `reservations.json`

4. **Environment variables**

At the root project create a folder 'env'.  
Inside this folder create a file '.env.dev' put :  

```.env.dev
PORT = your_front_end_port
URL_FRONT = your_front_url
URL_MONGO = 'mongodb://username:password@database_URI/database-name'
SECRET_KEY = your_jwt_secret_key
SECURE_COOKIE = false
```

5. **Install packages**

At the root project run :  

```.bash
npm install
```

6. **Start the app**

At the root project run :  

```.bash
npm run dev
```
It will start mocha tests and then start the app.

### Users password to login

> Here are the two users in the database with their password.

Mail : jean.dupont@gmail.com
Password : 1234

Mail : jean-dupont@gmail.com
Password : 1234