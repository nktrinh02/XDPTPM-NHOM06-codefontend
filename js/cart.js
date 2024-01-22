async function saveCart(id) {
    if(token == null){
        toastr.warning("Bạn chưa đăng nhập");
    }
    var url = 'http://localhost:8080/api/user/add-cart?id='+id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Thêm giỏ hàng thành công!");
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}


async function gioHangCuaToi(){
    if(token == null){
        window.location.href = 'login.html';
    }
    var url = 'http://localhost:8080/api/user/cart-by-user';    
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        })
    });
    var list = await response.json();
    var main = '';
    var totalAmount = 0;
    var totalSp = 0;
    for (i = 0; i < list.length; i++) {
        totalAmount = Number(totalAmount) + list[i].product.price
        totalSp = Number(totalSp) + 1;
        var trangthai = '';
        var sty = '';
        var btndoi = '';
        var btnmua = '';
        if(list[i].product.productStatus == "DANG_HIEN_THI"){
            trangthai = 'Còn hàng';
            if(list[i].product.productType == "TRAO_DOI"){
                btndoi = `<a href="thongtin.html?id=${list[i].product.id}" class="btn btn-primary">Đổi</a>`
            }
            if(list[i].product.productType == "BAN"){
                btnmua = `<button class="btn btn-primary" disabled>Mua</button>`
            }
        }
        if(list[i].product.productStatus == "DA_BAN"){
            sty = 'style="background-color:#ededed;"'
            if(list[i].product.productType == "BAN"){
                trangthai = "Đã bán";
            }
            if(list[i].product.productType == "TRAO_DOI"){
                trangthai = "Hết hàng";
            }
        }
        main +=
        `<tr ${sty}>
            <td><a class="tenprocart" href="detail.html?id=${list[i].product.id}"><img class="img-cart" src="${list[i].product.image}"></a></td>
            <td><a class="tenprocart" href="detail.html?id=${list[i].product.id}">${list[i].product.name}</a></td>
            <td>${convertLoaiSp(list[i].product.productType)}</td>
            <td>${formatmoney(list[i].product.price)}</td>
            <td>${trangthai}</td>
            <td>
                <i onclick="deleteCart(${list[i].id})" class="fa fa-times"></i><br>
                ${btnmua}<br>
                ${btndoi}
            </td>
        </tr>`
    }
    document.getElementById("listcart").innerHTML = main
    document.getElementById("tongtien").innerHTML = formatmoney(totalAmount)
    document.getElementById("tongsl").innerHTML = totalSp +" sản phẩm";
}


function convertLoaiSp(loai){
    if(loai == "TRAO_DOI"){
        return "Trao đổi";
    }
    return "Bán";
}

async function deleteCart(id) {
    var con = confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng");
    if(con == false){
        return;
    }
    var url = 'http://localhost:8080/api/user/delete-cart?id='+id;    
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("Xóa thành công!");
        gioHangCuaToi();
    }
    else {
        toastr.error("Xóa thất bại!");
    }
}

