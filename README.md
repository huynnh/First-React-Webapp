-- Các bước cần chuẩn bị để chạy chương trình --

+ Mysql
1. Tải và cài đặt mysql
2. Tạo tài khoản root
3. Thêm tài khoản, mật khẩu vừa tạo vào dòng 91,92 của file Web3\backend\backend\settings.py
4. Tạo schema thủ công bằng bash với tên project_db (mặc định - thay đổi nếu muốn)
5. Kiểm tra Service của Mysql đã chạy hay chưa

! Backend
1. Chạy lệnh python manage.py makemigrations và python manage.py migrate để khởi tạo csdl
2. Chạy thử python manage.py runserver, nếu thành công thì chạy tiếp frontend.
3. Nếu báo lỗi thì chạy các câu lệnh sau:

cd Web3/venv
.\Scripts\activate
cd ..
pip install -r requirements.txt
cd ..
cd backend
python mange.py runserver
Tùy vị trí file mà đường dẫn vào venv có thể sẽ khác
Nếu không chạy được câu lệnh activate venv thì search google cách chạy venv python cho OS của mình
Nếu vẫn còn báo lỗi khi runserver thì chương trình báo lỗi thiếu module nào pip install module đó

! Frontend
1. Chạy thử npm start, nếu thành công thì bắt đầu thử chương trình
2. Nếu báo lỗi thì npm install rồi thử lại.

+ Các task đã hoàn thành
1. Thêm Task, Event vào chương trình, hiển thị theo lịch ngày, tuần, tháng
2. Có thể liên kết đến Google Calendar và Outlook Calendar, sử dụng mail sinh viên để đăng nhập
3. Đồng bộ được các sự kiện và lịch trình từ Google Calendar và Outlook Calendar.
4. Có hệ thống frontend để người dùng tương tác.

- Các lưu ý khi sử dụng chương trình
1. Lần đầu tiên sử dụng chương trình hãy tạo tài khoản và mật khẩu.
2. Chương trình hiện tại vẫn chưa ổn định, có thể có lỗi, nếu mọi người fix được thì tạo branch riêng và fix lỗi tìm được
3. AI và giọng nói vẫn chưa hoạt động, mình vẫn đang phát triển thêm, tuy nhiên task này sắp hoàn thành.
3.5 Mình và Xuân Mai đang cùng tạo task AI Assisstant này, mọi người có thể làm chung cho vui :v
4. Nếu mọi người thấy frontend không đẹp có thể chỉnh sửa, tạo branch riêng
5. Các file frontend và backend còn dư khá nhiều, khi nào final thì mình sẽ lượt bỏ sau.
6. Để có thể hiểu code nhanh chóng thì phần backend nên tập trung các file Models, Views (API_View), URLS (API_URLS) để hiểu chức năng
7. Phần frontend thì chịu khó đọc các đường dẫn thêm vào để biết các hook và props được sử dụng
8. Nếu thấy lằng nhằng thì cứ thêm console.log ở frontend và print ở backend để biết được workflow của chương trình mà không cần tìm code.

