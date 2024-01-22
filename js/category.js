async function loadCategoryIndex() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {});
    var list = await response.json();
    var main = `<div class="listdmindex owl-2-style">
    <div class="owl-carousel owl-2" id="listcategoryindex">`
    for (i = 0; i < list.length; i++) {
        main += `<div class="media-29101">
        <a href="product.html?category=${list[i].id}&catename=${list[i].name}"><img src="${list[i].image}" alt="Image" class="img-fluid"></a>
        <h3><a href="product.html?category=${list[i].id}&catename=${list[i].name}">${list[i].name}</a></h3>
    </div>`
    }
    main += `</div>
    </div>`
    document.getElementById("dsmh_index").innerHTML = main;
    loadCou();
}

// load thông tin tài khoản ra trang account từ localstorage
function loadThongTin(){
    var user = JSON.parse(window.localStorage.getItem('user'));
    document.getElementById("fullname").value = user.fullname
    document.getElementById("address").value = user.address
    document.getElementById("phone").value = user.phone
    document.getElementById("linkFace").value = user.linkFace
    document.getElementById("linkInstagram").value = user.linkInstagram
    document.getElementById("avatarbn").src = user.avatar
    document.getElementById("linkavatar").value = user.avatar
}

async function loadCategorySelect() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {});
    var list = await response.json();
    var main = ``
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("category").innerHTML = main;
    const ser = $("#category");
    ser.select2({
        placeholder: "Chọn danh mục cho sản phẩm",
    });
}

