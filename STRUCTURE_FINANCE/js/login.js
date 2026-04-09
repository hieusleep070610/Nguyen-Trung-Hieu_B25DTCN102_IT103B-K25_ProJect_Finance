const usersBasic = [
    {
        "id": 1,
        "fullname":"Nguyễn Văn A",
        "email":"nguyenvana@gmail.com",
        "password": "123456",
        "phone":"0987654321",
        "gender":"true",
        "status":"true"
    },
    {
        "id": 2,
        "fullname":"Nguyễn Thị B",
        "email":"nguyenthib@gmail.com",
        "password": "123456",
        "phone":"0987654321",
        "gender":"false",
        "status":"true"
    }
]

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(usersBasic));
}
const form = document.querySelector("#formContent");
const loginName = document.querySelector("#loginName");
const password = document.querySelector("#password");
const eyeIconElement = document.querySelector(".eyeIcon");

const currentUserString = localStorage.getItem("logged");

// Ngăn chặn quay lại trang khi mà đã đang nhập (nút back)
if (currentUserString) {
    window.location.replace("../index.html");
}
//Chức năng đăng nhập
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (loginName.value === "") {
        swal("Lỗi", "Email không được để trống", "error");
        return;
    }
    if (password.value === "") {
        swal("Lỗi", "Mật khẩu không được để trống", "error");
        return;
    }
    // Lấy dữ liệu từ local
    let users = JSON.parse(localStorage.getItem("users")) || [];
    // Tìm user 
    let found = users.find(user => user.email.toLowerCase() === loginName.value.toLowerCase() && user.password === password.value);
    if (!found) {
        swal("Lỗi", "Email hoặc mật khẩu không đúng", "error");
        return;
    }
    localStorage.setItem("logged", JSON.stringify(found));

    window.location.href = "../index.html";
});

//Chức năng ẩn/hiện mật khẩu

eyeIconElement.addEventListener("click",()=>{
    if(password.type === "password") {
        password.type = "text";
    }else {
        password.type = "password";
    }
});

