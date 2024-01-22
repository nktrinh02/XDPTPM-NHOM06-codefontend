var token = localStorage.getItem("token");
var size = 10;
async function loadCategory() {
    $('#example').DataTable().destroy();
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td><img src="${list[i].image}" style="width:100px"></td>
                    <td>${list[i].name}</td>
                    <td class="sticky-col">
                        <i onclick="deleteCategory(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a onclick="loadACategory(${list[i].id})" data-bs-toggle="modal" data-bs-target="#themdanhmuc"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listcategory").innerHTML = main;
    $('#example').DataTable();
}

function clearInput(){
    document.getElementById("idcate").value = ''
    document.getElementById("catename").value = ''
    document.getElementById("imgbannerip").value = ''
    document.getElementById("preview").src = ''
}

async function loadACategory(id) {
    var url = 'http://localhost:8080/api/public/categoryById?id='+id;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
        })
    });
    var obj = await response.json();
    document.getElementById("idcate").value = obj.id
    document.getElementById("catename").value = obj.name
    document.getElementById("imgbannerip").value = obj.image
    document.getElementById("preview").src = obj.image
}


async function saveCategory() {
    var idcate = document.getElementById("idcate").value
    var catename = document.getElementById("catename").value
    var image = document.getElementById("imgbannerip").value

    const filePath = document.getElementById('imgbanner')
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        image = await res.text();
    }

    var url = 'http://localhost:8080/api/admin/addOrUpdateCategory';
    var category = {
        "id": idcate,
        "name": catename,
        "image": image
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(category)
    });
    if (response.status < 300) {
        toastr.success("Thành công!");
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteCategory(id) {
    var con = confirm("Bạn chắc chắn muốn xóa danh mục này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/deleteCategory?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa danh mục thành công!");
        loadCategory();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function loadCategorySelect() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '<option value="-1">Tất cả danh mục</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("listdanhmuc").innerHTML = main;
}
