# Project : NEWSPAPER
# @Author: Trần Trung Tín, Nguyễn Nhật An, Nguyễn Mai Huy Hoàng, Mai Đức Kiên

# 1. Setup library

**Create all library**
```
npm install
```

# 2. Setup API for Project (Optional if we do not have file .env)

**Google**

Go to `https://console.cloud.google.com/` and then choose Credentials section.

Then create OAuth client ID

Copy value of `Client ID` and `Client secret`

**Github**

Go to `https://github.com/settings/profile` and then choose Developer Settings.

After that, we choose OAuth Apps and create new one.

Copy value of `Client ID` and `Client secret`

**Capcha**

Go to `https://developers.google.com/recaptcha/intro` to create new capcha and then copy its keys.

**Database (local host)**

**Create file .env**

Create file `.env` and paste all the value

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CAPCHA_SECRET=
GOOGLE_CAPCHA_CLIENT=
DB_HOST=
DB_DBNAME=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
```

# 3. Set up Database (local host)

1. Open XAMPP Control Panel and turn on Module `MySQL`

![image](https://github.com/user-attachments/assets/a16f9c9d-4a2b-43bd-88e7-ab364035ac8b)

2. Open Navicat and create a new database with name `onlinenewspaperdb`

4. After that, right click on the database name and choose execute sql file

![image](https://github.com/user-attachments/assets/07177588-dde4-4ab9-91ac-4c9845441eb8)

5. In the EXECUTE SQL File window, click on `...` and choose `onlinenewspaperdb.sql` in db.zip

![image](https://github.com/user-attachments/assets/1fd6ce1e-fc96-49e6-bc29-258767c1b7a8)

6. click start button

![image](https://github.com/user-attachments/assets/91f27145-a2e1-4026-b2a5-18c2950c9c2e)

=> successfully deploy database

# 4. Start the project

Run the code below to run the app

```
npm run start
```

# 5. Additional information

In this project, we use `render.com` for hosting web app and `aiven.io` for MySQL database.

However, database in `aiven` works at However, aiven's database operates in the French time zone and is 7 hours behind Vietnam time. Therefore, some time-related functions will be affected, such as loading the most recent news, news publication time, etc.
