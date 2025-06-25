# Các bước cần chuẩn bị để chạy chương trình

## Database
Tải và cài đặt MySQL.  
Tạo tài khoản root cho database.  
Thêm tài khoản, mật khẩu database vừa tạo vào file `/backend/backend/settings.py`.

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'project_db',
        'USER': 'root', # Replace with your MySQL username
        'PASSWORD': 'root',  # Replace with your MySQL password
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```
Tạo schema tên `project_db` (mặc định - thay đổi nếu muốn).

## Backend
### Setup python venv (Python Virtual Environment)
Tìm và chạy file `activate`:  
`$ source /path/to/activate`  
**NOTE:** *Nếu sử dụng Windows thì chạy file `activate.bat`*

Tiếp tục cài các python package cần thiết:  
`pip install -r requirements.txt`

### Chạy backend
Chạy lệnh `python manage.py makemigrations` và `python manage.py migrate` để khởi tạo csdl.  
Chạy lệnh `python manage.py runserver`, nếu thành công thì có thể bắt đầu chạy frontend.

## Frontend
Tải và cài đặt NodeJS.  
Vào folder `/frontend` và chạy `npm install` để tải các package cần thiết.  
Xong thì chạy `npm start`. Nếu thành công thì có thể bắt đầu thử sử dụng chương trình.