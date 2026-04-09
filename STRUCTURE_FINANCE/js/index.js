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
const monthlyCategories = [
    {
        id:1,
        month:"2025-09-30",
        userId:1,
        categories: [
            {
                id:1,
                categoriesId: 1,
                budget: 300000
            },
            {
                id:2,
                categoriesId: 2,
                budget: 500000
            }
        ]
    }
]

const defaultCategories = [
    {
        id:1,
        userId:1,
        name:"tiền đi học",
        limitPrice:200000,
    },
    {
        id:2,
        userId:1,
        name:"tiền đi chơi",
        limitPrice:150000,
    }
];

const transactions = [
    {
        id: 1,
        userId: 1,
        createdDate: "2025-10-01",
        total: 150000,
        description :"Tiền đi chơi",
        categoryId: 1,
        monthlycategoryId:1
    }
];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let transactionsData = JSON.parse(localStorage.getItem("transactions")) || [];

let indexEdit = -1;
let keyword = "";
let sortType = "";

const logoutElement = document.querySelector("#btn-logout");
const accountNameElement = document.querySelector("#accountName");

const monthInputElement = document.querySelector("#monthSpend");
const budgetInputElement = document.querySelector("#budgetInput");
const saveBudgetElement = document.querySelector("#btn-budget");

const categoryForm = document.querySelector("#categoryForm");
const categoryNameInput = document.querySelector("#categoryName");
const categoryPriceInput = document.querySelector("#categoryPrice");
const categoryList = document.querySelector(".categoryList");
const addCategoryElement = document.querySelector("#addCategory");

const remainingPrice = document.querySelector("#price");

const expenseForm = document.querySelector(".formExpense");
const expenseAmount = document.querySelector("#expenseAmount");
const expenseCategory = document.querySelector("#expenseCategory");
const expenseNote = document.querySelector("#expenseNote");

const searchBtn = document.querySelector("#btn-search");
const searchInput = document.querySelector(".toolbar input");

const sortSelect = document.querySelector("#sortSelect");

const paginationContainer = document.querySelector(".pagination");

const warningElement = document.querySelector(".warning");

const transactionList = document.querySelector("#transactionList");

logoutElement.addEventListener("click", () => {
    swal("Bạn có chắc muốn đăng xuất không?", {
        buttons: ["Hủy", "Đăng xuất"],
    }).then((isLogout) => {
        if (isLogout) {
            localStorage.removeItem("logged");
            window.location.href = "../pages/login.html"; 
        }
    });
});

const userLogin = JSON.parse(localStorage.getItem("logged"));

if (!userLogin) {
    window.location.href = "../pages/login.html";
} else {
    accountNameElement.innerText = userLogin.email;
}

saveBudgetElement.addEventListener("click", () => {
    const month = monthInputElement.value;
    const budget = budgetInputElement.value;

    if (!month) {
        swal("Lỗi", "Bạn chưa chọn tháng", "warning");
        return;
    }
    if (budget === "") {
        swal("Lỗi", "Bạn chưa nhập ngân sách", "warning");
        return;
    }

    let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const isDuplicate = budgets.find(item => item.month === month && item.userId === userLogin.id);

    if (isDuplicate) {
        isDuplicate.budget = budget;
        remainingPrice.textContent = `${Number(budget)} VND`;
    } else {
        const newBudget = {
            month,
            budget,
            userId: userLogin.id
        };
        budgets.push(newBudget);
        remainingPrice.textContent = `${Number(budget)} VND`;
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));
});
//render danh mục
const renderCategories = () => {
    let html = "";

    const userCategories = categories.filter(c => c.userId === userLogin.id);

    userCategories.forEach((element) => {
        html += `
            <div class="categoryCard">
                <div>
                    <p>${element.name} - Giới hạn: ${element.limitPrice} VND</p>
                </div>
                <div>
                    <button onclick="handleUpdate(${element.id})">Sửa</button>
                    <button onclick="handleDelete(${element.id})">Xoá</button>
                </div>
            </div>
            <hr>
        `;
    });

    categoryList.innerHTML = html;
};

//thêm / submit sửa
categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = categoryNameInput.value;
    const price = categoryPriceInput.value;

    if (!name || !price) {
        swal("Lỗi", "Bạn cần phải nhập đầy đủ thông tin", "warning");
        return;
    }

    if (indexEdit !== -1) {
        categories[indexEdit].name = name;
        categories[indexEdit].limitPrice = price;

        indexEdit = -1;
        addCategoryElement.textContent = "Thêm danh mục";
    } else {
        const newCategory = {
            id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
            userId: userLogin.id,
            name,
            limitPrice: price,
            status: true
        };
        categories.unshift(newCategory);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    renderCategoryOptions();
    categoryForm.reset();
});

// xoá danh mục
const handleDelete = (id) => {
    const index = categories.findIndex(category => category.id === id);

    swal(`Bạn có chắc muốn xoá "${categories[index].name}" không?`, {
        buttons: ["Hủy", "Xoá"], 
    }).then((willDelete) => { 
        if (willDelete) {
            categories.splice(index, 1);
            localStorage.setItem("categories", JSON.stringify(categories));
            renderCategories();
            renderCategoryOptions();
        }
    });
};

//sửa danh mục
const handleUpdate = (id) => {
    const index = categories.findIndex(category => category.id === id);
    const category = categories[index];

    indexEdit = index;

    categoryNameInput.value = category.name;
    categoryPriceInput.value = category.limitPrice;

    addCategoryElement.textContent = "Cập nhật";
};

//phần option danh mục
const renderCategoryOptions = () => {
    let html = `<option value="">Chọn danh mục</option>`;

    const userCategories = categories.filter(c => c.userId === userLogin.id);

    userCategories.forEach(item => {
        html += `<option value="${item.id}">${item.name}</option>`;
    });

    expenseCategory.innerHTML = html;
};
let currentPage = 1;
const elementPage = 3; 
//hiện thị giao dịch
const renderTransactions = () => {

    let html = "";

    let userTransactions = transactionsData.filter(t => t.userId === userLogin.id);

    // tìm kiếm
    if (keyword) {
        userTransactions = userTransactions.filter(item =>
            item.description.toLowerCase().includes(keyword.toLowerCase())
        );
    }
    
    // sắp xếp
    if (sortType === "increase") {
        userTransactions.sort((a, b) => a.total - b.total);
    } else if (sortType === "decrease") {
        userTransactions.sort((a, b) => b.total - a.total);
    } 

    //phân trang
    const totalPages = Math.ceil(userTransactions.length / elementPage);
    const start = (currentPage - 1) * elementPage;
    const end = start + elementPage;

    const paginatedData = userTransactions.slice(start, end);

    paginatedData.forEach((element) => {
        const category = categories.find(c => c.id === element.categoryId);

        html += `
            <div class="item">
                ${category?.name || "Không xác định"} - ${element.description}: ${element.total.toLocaleString()} VND
                <button onclick="deleteTransaction(${element.id})">Xoá</button>
            </div>
        `;
    });
    transactionList.innerHTML = html;

    renderPagination(totalPages);
};
//thêm giao dịch
expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const amount = Number(expenseAmount.value);
    const categoryId = Number(expenseCategory.value);
    const note = expenseNote.value;
    const month = monthInputElement.value;
    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const currentBudget = budgets.find(
        b => b.month === month && b.userId === userLogin.id
    );
    if (!currentBudget) {
        swal("Lỗi", "Bạn phải lưu ngân sách trước khi thêm giao dịch", "warning");
        return; 
    }
    if (!amount || !categoryId) {
        swal("Lỗi", "Bạn phải nhập đủ thông tin", "warning");
        return;
    }
    const newTransaction = {
        id: transactionsData.length > 0 ? transactionsData[transactionsData.length - 1].id + 1 : 1,
        userId: userLogin.id,
        total: amount,
        description: note,
        categoryId,
    };

    transactionsData.unshift(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactionsData));

    renderTransactions();
    checkWarning();
    expenseForm.reset();
});

//xoá giao dịch
const deleteTransaction = (id) => {
    const index = transactionsData.findIndex(t => t.id === id);

    swal("Bạn có chắc muốn xoá giao dịch này không?", {
        buttons: ["Hủy", "Xoá"],
    }).then((willDelete) => {
        if (willDelete) {
            transactionsData.splice(index, 1);
            localStorage.setItem("transactions", JSON.stringify(transactionsData));

            renderTransactions();
            checkWarning();
        }
    });
};
//Tìm kiếm
searchBtn.addEventListener("click", () => {
    keyword = searchInput.value.trim();
    currentPage = 1;
    renderTransactions();
});
//Sắp xếp
sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;

    if (value === "Tăng dần") {
        sortType = "increase";
    } else if (value === "Giảm dần") {
        sortType = "decrease";
    } else {
        sortType = "";
    }
    currentPage = 1;
    renderTransactions();
});
//render nút
const renderPagination = (totalPages) => {
    let html = "";
    // nút previous
    html += `<button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">Previous</button>`;
    // trang hiện tại
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class= "${i === currentPage ? "active" : ""}" onclick="changePage(${i})">${i}</button>
        `;
    }
    // nút next
    html += `<button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">Next</button>`;

    paginationContainer.innerHTML = html;
};
//chuyển trang
const changePage = (page) => {
    currentPage = page;
    renderTransactions();
};
//Cảnh báo nếu vượt quá giới hạn
const checkWarning = () => {
    let warningText = "";

    const userCategories = categories.filter(c => c.userId === userLogin.id);
    const userTransactions = transactionsData.filter(t => t.userId === userLogin.id);

    userCategories.forEach(category => {
        const totalSpent = userTransactions
            .filter(item => item.categoryId === category.id)
            .reduce((sum, item) => sum + item.total, 0);
        if (totalSpent > category.limitPrice) {
            warningText += `Danh mục "${category.name}" đã vượt giới hạn: ${totalSpent} / ${category.limitPrice} VND<br>`;
        }
    });
    
    if (warningText) {
        warningElement.style.display = "block";
        warningElement.innerHTML = warningText;
    } else {
        warningElement.style.display = "none";
    }
};

renderCategories();
renderCategoryOptions();
renderTransactions();
checkWarning();
