# Project : NEWSPAPER
# @Author: Trần Trung Tín, Nguyễn Nhật An, Nguyễn Mai Huy Hoàng, Mai Đức Kiên

# 1. Setup library
**Create npm project**
```
npm init
```
**Setup library npm express**
```
npm install express
```
**Setup library npm express handle-bars**
```
npm install express-handlebars
```

# 2. Setup API for Google and Github

**Google**

Go to `https://console.cloud.google.com/` and then choose Credentials section.

Then create OAuth client ID

Copy value of `Client ID` and `Client secret`

**Github**

Go to `https://github.com/settings/profile` and then choose Developer Settings.

After that, we choose OAuth Apps and create new one.

Copy value of `Client ID` and `Client secret`

**Create file .env**

Create file `.env` and paste all the value

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```