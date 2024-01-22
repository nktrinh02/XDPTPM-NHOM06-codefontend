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


async function sendExchange(){
    document.getElementById("loading").style.display = 'block'
    var uls = new URL(document.URL)

    var id = uls.searchParams.get("id");
    var hoten = document.getElementById("hoten").value
    var sdt = document.getElementById("sdt").value
    var diachi = document.getElementById("diachi").value
    var spdoi = document.getElementById("spdoi").value
    var description = tinyMCE.get('editor').getContent();

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
        "exchange":{
            "fullname":hoten,
            "phone":sdt,
            "address":diachi,
            "productName":spdoi,
            "description":description,
            "product":{
                "id":id
            },
        },
        "linkImage":listLink
    }
    var url = 'http://localhost:8080/api/user/send-exchange';
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
            title: "Thành công", 
            text: "Vui lòng chờ phản hồi từ phía người bán!", 
            type: "success"
          },
        function(){ 
            window.location.replace("cart.html")
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

async function loadExchangeByPro(id){
    document.getElementById("divdetail").style.display = "none";
    var url = 'http://localhost:8080/api/user/exchange-by-product?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr class="trpointer" onclick="loadDetalExchange(${list[i].id})">
        <td>${list[i].productName}</td>
        <td>${list[i].createdTime}, ${list[i].createdDate} </td>
        <td>${list[i].fullname}</td>
        <td>${list[i].phone}</td>
        <td>${list[i].address}</td>
    </tr>`
    }
    document.getElementById("listexchange").innerHTML = main
}


async function loadDetalExchange(id){
    var url = 'http://localhost:8080/api/user/exchange-by-id?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var obj = await response.json();
    document.getElementById("divdetail").style.display = "";
    var main = '';
    for(i=0; i<obj.exchangeImages.length; i++){
        main += `<div class="col-6">
        <div class="divdimageex"><img onclick="setAnh('${obj.exchangeImages[i].linkImage}')" data-bs-toggle="modal" data-bs-target="#modalimage" src="${obj.exchangeImages[i].linkImage}" class="anhexchange"></div>
    </div>`
    }
    document.getElementById("dsanhexchange").innerHTML = main
    document.getElementById("motaexchange").innerHTML = obj.description
}

function setAnh(el){
    document.getElementById("anhpre").src = el
}