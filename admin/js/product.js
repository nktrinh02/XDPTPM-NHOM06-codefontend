async function loadProduct() {
    $('#example').DataTable().destroy();
    var id = document.getElementById("listdanhmuc").value;
    var url = 'http://localhost:8080/api/admin/allProduct-list';
    if(id != -1){
        url +='?id='+id
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td><img src="${list[i].image}" style="width: 100px;"></td>
                    <td>${list[i].category.name}</td>
                    <td>${list[i].name}</td>
                    <td>${formatmoney(list[i].price)}</td>
                    <td>${list[i].createdDate.split("T")[0]}</td>
                    <td>${list[i].productStatus}</td>
                    <td class="sticky-col">
                        ${list[i].productStatus=="DANG_HIEN_THI"?"":'<i onclick="deleteProduct('+list[i].id+')" class="fa fa-trash-alt iconaction"></i>'}
                        <a href="../detail.html?id=${list[i].id}"><i class="fa fa-eye iconaction"></i><br></a>
                    </td>
                </tr>`
    }
    document.getElementById("listproduct").innerHTML = main
    $('#example').DataTable();
}





async function deleteProduct(id) {
    var con = confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/deleteProduct?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa sản phẩm thành công!");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


