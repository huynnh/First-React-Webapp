# Giới thiệu

Đây là một hệ thống đặt lịch và thời gian biểu thông minh dựa trên todo list cá nhân và công nghệ AI thời gian thực.  
Chức năng cơ bản:

- Thêm công việc, sự kiện cần làm.
- Đồng bộ lịch Google, Outlook.
- Nhắc nhở công việc đến hạn.

# Các bước setup

## Database
Tải và cài đặt MySQL.  
Tạo tài khoản root cho database.  
Thêm tài khoản, mật khẩu database vừa tạo vào file `/backend/backend/settings.py`.

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'project_db',
        'USER': 'root',         # Replace with your MySQL username
        'PASSWORD': 'root',     # Replace with your MySQL password
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

>**NOTE:** Nếu sử dụng Windows thì chạy file `activate.bat`

Tiếp tục cài các python package cần thiết:  
`pip install -r requirements.txt`

### Chạy backend
Chạy lệnh `python manage.py makemigrations` và `python manage.py migrate` để khởi tạo CSDL.  
Chạy lệnh `python manage.py runserver` để chạy backend, nếu thành công thì có thể bắt đầu chạy frontend.

## Frontend
Tải và cài đặt NodeJS.  
Vào folder `/frontend` và chạy lệnh `npm install` để tải các package cần thiết.  
Xong thì chạy `npm start`. Nếu thành công thì có thể bắt đầu thử sử dụng chương trình.