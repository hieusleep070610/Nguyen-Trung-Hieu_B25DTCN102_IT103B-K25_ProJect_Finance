
const form = document.querySelector("#formContent");
const registerName = document.querySelector("#registerName");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#passwordConfirm");
const textRegister = document.querySelector("#btn-register");
const eyeIconElement1 = document.querySelector(".eyeIcon-1");
const eyeIconElement2 = document.querySelector(".eyeIcon-2");
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
form.addEventListener("submit",(event) => {
    event.preventDefault(); // chặn reload
    
    if (registerName.value === ""){
        swal ( "Lỗi" ,"Tài khoản không được để trống" ,  "error" )
        return;
    }
    if (!regexEmail.test(registerName.value))
    {
        swal ( "Lỗi" ,"Email phải đúng định dạng" ,  "error" )
        return ;
    }
    if(password.value === ""){
        swal("Lỗi", "Mật khẩu không được để trống", "error");
        return;
    }
    if(password.value.length < 6){
        swal("Lỗi","Mật khẩu tối thiểu 6 ký tự trở lên");
        return;
    }
    if(confirmPassword.value === ""){
        swal( "Lỗi" ,"Mật khẩu xác nhận không được để trống");
        return;
    }
    if(password.value !== confirmPassword.value){
        swal("Lỗi","Mật khẩu xác nhận không khớp", "error");
        return;
    }
    //Lấy dữ liệu từ  local
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const newUser = {
        "id": users.length > 0 ? users[users.length - 1].id + 1 : 1,
        "fullname": "", 
        "email": registerName.value, 
        "password": password.value,
        "phone": "",
        "gender": "",
        "status": "true"
    };
    users.push(newUser);
    //Đẩy dữ liệu lên local
    localStorage.setItem("users", JSON.stringify(users));

    window.location.href = "./login.html"
});

//Chức năng hiện thị mật khẩu 
eyeIconElement1.addEventListener("click",()=>{
    if(password.type === "password") {
        password.type = "text";
    }else {
        password.type = "password";
    }
});

eyeIconElement2.addEventListener("click",()=>{
    if(confirmPassword.type === "password") {
        confirmPassword.type = "text";
    }else {
        confirmPassword.type = "password";
    }
});
