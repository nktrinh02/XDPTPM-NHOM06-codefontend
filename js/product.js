var listFile = [];
var token = localStorage.getItem("token");
function loadFiles() {
    var f = document.getElementById("listfileanhch")
    listFile = [];
    for(i=0; i<f.files.length; i++){
        listFile.push(f.files[i]);
    }
    var main = ''
    for(i=0; i<listFile.length; i++){
        var urs =  URL.createObjectURL(listFile[i])
        main += `<div id="divimg${i}" class="col-6 col-md-4 col-lg-3">
                    <div class="singleimg">
                        <img class="imganhch" src="${urs}">
                        <button onclick="deleteImgPreview(${i})" class="form-control btn btn-warning">xóa</button>
                    </div>
                </div>`
    }
    document.getElementById("listanhpre").innerHTML = main;
}

// xóa ảnh tạm thời
function deleteImgPreview(i){
    listFile.splice(i, 1);
    document.getElementById("divimg"+i).remove();
}

// load thông tin tài khoản ra trang account từ localstorage
function loadThongTinTaiKhoan(){
    var user = JSON.parse(window.localStorage.getItem('user'));
    document.getElementById("address").value = user.address
    document.getElementById("phone").value = user.phone
    document.getElementById("linkFace").value = user.linkFace
}

async function loadChiTietSanPham(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    await loadCategorySelect();
    if(id != null){
        var url = 'http://localhost:8080/api/public/productByID?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        console.log(result);
        document.getElementById("proname").value = result.name
        document.getElementById("price").value = result.price
        document.getElementById("linkanhnen").value = result.image
        document.getElementById("proimgpreview").src = result.image
        $("#category").val(result.category.id).change();
        document.getElementById("linkFace").value = result.linkFace
        document.getElementById("phone").value = result.phone
        document.getElementById("address").value = result.address
        document.getElementById("loaiSp").value = result.productType

        if(result.productImages.length > 0){
            document.getElementById("divanhdathem").style.display = "block"
            var main = ''
            for(i=0; i<result.productImages.length; i++){
                main += `<div id="anhdt${result.productImages[i].id}" class="col-6 col-md-3 col-lg-3">
                            <div class="singleimg">
                                <img class="imganhch" src="${result.productImages[i].linkImage}">
                                <button onclick="xoaAnh(${result.productImages[i].id})" class="form-control btn btn-warning">xóa</button>
                            </div>
                        </div>`
            }
            document.getElementById("listanhdathem").innerHTML = main
        }

        tinyMCE.get('editor').setContent(result.description)

    }
}


async function myProduct(){
    var url = 'http://localhost:8080/api/user/myProduct?loai=BAN';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td>${list[i].id}</td>
        <td><img src="${list[i].image}" style="width: 100px;"></td>
        <td>${list[i].name}</td>
        <td>${formatmoney(list[i].price)}</td>
        <td>${list[i].createdTime}, ${list[i].createdDate}</td>
        <td>${list[i].productStatus}</td>
        <td>${list[i].phone}<br>
        <a href="${list[i].linkFace}">facebook</a><br>
        ${list[i].address}<br></td>
        <td>${convertLoaiSp(list[i].productType)}</td>
        <td class="sticky-col">
            <i onclick="xoaSanPham(${list[i].id})" class="fa fa-trash iconaction"></i>
            <a href="upload.html?id=${list[i].id}"><i class="fa fa-edit iconaction"></i></a><br>
            <label class="checkbox-custom">Đã bán
                <input ${list[i].productStatus=="DANG_HIEN_THI"?"":"checked"} onclick="capNhatDaBan(${list[i].id})" type="checkbox">
                <span class="checkmark-checkbox"></span>
            </label><br>
        </td>
    </tr>`
    }
    document.getElementById("listproduct").innerHTML = main
}


async function myProductTraoDoi(){
    var url = 'http://localhost:8080/api/user/myProduct?loai=TRAO_DOI';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
        <td>${list[i].id}</td>
        <td><img src="${list[i].image}" style="width: 100px;"></td>
        <td>${list[i].name}</td>
        <td>${formatmoney(list[i].price)}</td>
        <td>${list[i].createdTime}, ${list[i].createdDate}</td>
        <td>${list[i].productStatus}</td>
        <td>${list[i].phone}<br>
        <a href="${list[i].linkFace}">facebook</a><br>
        ${list[i].address}<br></td>
        <td>${convertLoaiSp(list[i].productType)}</td>
        <td class="sticky-col">
            <i onclick="xoaSanPham(${list[i].id})" class="fa fa-trash iconaction"></i>
            <a href="upload.html?id=${list[i].id}"><i class="fa fa-edit iconaction"></i></a><br>
            <label class="checkbox-custom">Đã đổi
                <input ${list[i].productStatus=="DANG_HIEN_THI"?"":"checked"} onclick="capNhatDaBan(${list[i].id})" type="checkbox">
                <span class="checkmark-checkbox"></span>
            </label><br>
            <button onclick="loadExchangeByPro(${list[i].id})" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary">Ds trao đổi</button><br>
        </td>
    </tr>`
    }
    document.getElementById("listproductTraoDoi").innerHTML = main
}

function convertLoaiSp(loai){
    if(loai == "TRAO_DOI"){
        return "Trao đổi";
    }
    return "Bán";
}

async function addOrUpdateProduct(){
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");

    
    var proname = document.getElementById("proname").value
    var price = document.getElementById("price").value
    var category = document.getElementById("category").value
    var linkanhnen = document.getElementById("linkanhnen").value
    var linkFace = document.getElementById("linkFace").value
    var phone = document.getElementById("phone").value
    var address = document.getElementById("address").value
    var loaiSp = document.getElementById("loaiSp").value
    var description = tinyMCE.get('editor').getContent();


    const filePath = document.getElementById('anhnen')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        linkanhnen = await res.text();
    }

    var listLink = [];
    if(listFile.length > 0){
        const formData = new FormData()
        for(i=0; i<listFile.length; i++){
            formData.append("file", listFile[i])
        }
        var urlUpload = 'http://localhost:8080/api/public/upload-multiple-file';
        const res = await fetch(urlUpload, { 
            method: 'POST', 
            body: formData
        });
        if(res.status < 300){
            listLink = await res.json();
        }
    }
    console.log(listLink)

    var obj = {
        "product":{
            "id":id,
            "name":proname,
            "image":linkanhnen,
            "price":price,
            "description":description,
            "productType":loaiSp,
            "phone":phone,
            "linkFace":linkFace,
            "address":address,
            "category":{
                "id":category
            },
        },
        "linkImage":listLink
    }
    var url = 'http://localhost:8080/api/user/addOrUpdateproduct';
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(obj)
    });
    if(response.status < 300){
        swal({
            title: "", 
            text: "thành công!", 
            type: "success"
          },
        function(){ 
            window.location.replace("account.html#myproduct")
        });
    }
    else{
        toastr.error("Có lỗi xảy ra");
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.error(result.defaultMessage);
    }
    document.getElementById("loading").style.display = 'none'
}


async function xoaAnh(id) {
    var con = confirm("Bạn muốn xóa ảnh này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/delete-product-image?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        document.getElementById("anhdt"+id).remove();
    }
}

async function capNhatDaBan(id) {
    var url = 'http://localhost:8080/api/user/updateTrangThaiDaBan?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Thành công");
        myProduct();
    }
}

async function xoaSanPham(id) {
    var con = confirm("Bạn muốn xóa sản phẩm này?");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/deleteProduct?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        myProduct();
    }
}


var size = 10;
async function sanPhamTrangChu(page){
    var url = 'http://localhost:8080/api/public/allProduct?size='+size+'&page='+page+'&sort=id,desc';    
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var listimg = '';
        for(j=0; j<list[i].productImages.length; j++){
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        var td = '';
        if(list[i].productType == "TRAO_DOI"){
            td = `<div class="traodoiid">Trao đổi</div>`
        }
        var trangthai = '';
        if(list[i].productStatus=="DA_BAN"){
            if(list[i].productType=="BAN"){
                trangthai = '<div class="productsold"><span class="reviewsp">Đã bán</span></div>';
            }
            if(list[i].productType=="TRAO_DOI"){
                trangthai = '<div class="productsold"><span class="reviewsp">Hết hàng</span></div>';
            }
        }
        main += `<div class="col-lg-20p col-md-3 col-sm-6 col-6 colsp ${list[i].productStatus=='DA_BAN'?'spdaban':""}">
        <div class="singlepro">
            ${trangthai}
            <a ${list[i].productStatus=="DANG_HIEN_THI"?'href="detail.html?id='+list[i].id+'"':''} class="linkpro"><img src="${list[i].image}" class="imgpro"></a>
            <a ${list[i].productStatus=="DANG_HIEN_THI"?'href="detail.html?id='+list[i].id+'"':''} class="tenspindex"><span class="proname">${list[i].name}</span></a>
            <span class="proprice">Giá: ${formatmoney(list[i].price)}</span>
            <span class="carticon" onclick="saveCart(${list[i].id})"><i class="fa fa-shopping-cart"></i></span>
            ${td}
            <div class="listimgpro">
                ${listimg}
            </div>
        </div>
    </div>`
    }
    document.getElementById("listproductindex").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="sanPhamTrangChu(${Number(i)-1},'${sortb}',null)" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("listpage").innerHTML = mainpage
}


async function loadCTSanPhamTrangDetail(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    if(id != null){
        var url = 'http://localhost:8080/api/public/productByID?id='+id;
        const response = await fetch(url, {
            method: 'GET'
        });
        var result = await response.json();
        console.log(result);
        document.getElementById("imgdetailpro").src = result.image
        document.getElementById("detailnamepro").innerHTML = result.name
        document.getElementById("pricedetail").innerHTML = formatmoney(result.price)
        document.getElementById("detailnamepro").innerHTML = result.name
        document.getElementById("tendanhmuc").innerHTML = result.category.name
        document.getElementById("descriptiondetail").innerHTML = result.description
        document.getElementById("btnthemgiohang").onclick = function(){
            saveCart(result.id);
        }
        document.getElementById("listlienhe").innerHTML = 
        `<li><a href="${result.linkFace}"><i class="fa fa-facebook-official"></i> Xem facebook người bán</a></li>
        <li><a href="tel:${result.phone}"><i class="fa fa-phone"></i> Liên lạc với người bán</a></li>
        <li><i class="fa fa-map-marker"></i> ${result.address}n</li>
        `
        var main = ''
        for(i=0; i<result.productImages.length; i++){
            main += `<div class="col-lg-2 col-md-2 col-sm-2 col-2 singdimg">
            <img onclick="clickImgdetail(this)" src="${result.productImages[i].linkImage}" class="imgldetail imgactive">
        </div>`
        }
        document.getElementById("listimgdetail").innerHTML = main
    }
    else{
        window.location.href = 'index.html'
    }
}

async function clickImgdetail(e) {
    var img = document.getElementsByClassName("imgldetail");
    for (i = 0; i < img.length; i++) {
        document.getElementsByClassName("imgldetail")[i].classList.remove('imgactive');
    }
    e.classList.add('imgactive')
    document.getElementById("imgdetailpro").src = e.src
}


async function sanPhamLienQuan(){
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var url = 'http://localhost:8080/api/public/san-pham-lien-quan?size='+size+'&page=0&sort=id,desc&id='+id;    
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    var list = result.content;
    var main = '';
    for (i = 0; i < list.length; i++) {
        var listimg = '';
        for(j=0; j<list[i].productImages.length; j++){
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        main += `<div class="col-lg-6 col-md-6 col-sm-6 col-6 colsp ${list[i].productStatus=='DA_BAN'?'spdaban':""}">
        <a ${list[i].productStatus=="DANG_HIEN_THI"?'href="detail.html?id='+list[i].id+'"':''} class="linkpro">
            <div class="singlepro">
                ${list[i].productStatus=="DANG_HIEN_THI"?"":'<div class="productsold"><span class="reviewsp">Đã bán</span></div>'}
                <img src="${list[i].image}" class="imgpro">
                <span class="proname">${list[i].name}</span>
                <span class="proprice">Giá: ${formatmoney(list[i].price)}</span>
                <div class="listimgpro">
                    ${listimg}
                </div>
            </div>
        </a>
    </div>`
    }
    document.getElementById("listProductGy").innerHTML = main
}


async function sanPhamTrangProduct(page){
    var uls = new URL(document.URL)
    var search = uls.searchParams.get("search");
    var category = uls.searchParams.get("category");
    var name = uls.searchParams.get("catename");

    var url = 'http://localhost:8080/api/public/allProduct?size='+size+'&page='+page+'&sort=id,desc';    
    if(search != null){
        url = 'http://localhost:8080/api/public/product-by-param?size='+size+'&page='+page+'&sort=id,desc&search='+search;    
        document.getElementById("tieudetimkiem").innerHTML="<span>Sản phẩm theo từ khóa: "+search+"</span>"
    }
    if(category != null){
        url = 'http://localhost:8080/api/public/product-by-category-id?size='+size+'&page='+page+'&sort=id,desc&id='+category;    
        document.getElementById("tieudetimkiem").innerHTML="<span>Sản phẩm theo danh mục: "+name+"</span>"
    }
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages 
    var totalElements = result.totalElements
    var main = '';
    for (i = 0; i < list.length; i++) {
        var listimg = '';
        for(j=0; j<list[i].productImages.length; j++){
            listimg += `<div class="divimgsmpro"><img class="imgsmpro" src="${list[i].productImages[j].linkImage}"></div>`
        }
        main += `<div class="col-lg-20p col-md-3 col-sm-6 col-6 colsp ${list[i].productStatus=='DA_BAN'?'spdaban':""}">
        <a ${list[i].productStatus=="DANG_HIEN_THI"?'href="detail.html?id='+list[i].id+'"':''} class="linkpro">
            <div class="singlepro">
                ${list[i].productStatus=="DANG_HIEN_THI"?"":'<div class="productsold"><span class="reviewsp">Đã bán</span></div>'}
                <img src="${list[i].image}" class="imgpro">
                <span class="proname">${list[i].name}</span>
                <span class="proprice">Giá: ${formatmoney(list[i].price)}</span>
                <div class="listimgpro">
                    ${listimg}
                </div>
            </div>
        </a>
    </div>`
    }
    document.getElementById("listproduct").innerHTML = main

    var mainpage = ''
    for(i=1; i<= totalPage; i++){
        mainpage += `<li onclick="sanPhamTrangProduct(${Number(i)-1},'${sortb}',null)" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("listpage").innerHTML = mainpage
}


function checkLoai(){
    var loai = document.getElementById("loaiSp").value;
    if(loai == "TRAO_DOI"){
        document.getElementById("price").value = 0;
        document.getElementById("price").style.display = "none";
        document.getElementById("lbgiatien").style.display = "none";
    } 
    else{
        document.getElementById("price").value = 0;
        document.getElementById("price").style.display = "";
        document.getElementById("lbgiatien").style.display = "";
    }
}