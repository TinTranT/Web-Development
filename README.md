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

**Database**

Copy values related to host, name, username, password

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
