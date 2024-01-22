var token = localStorage.getItem("token");
const exceptionCode = 417;
async function loadMenu() {
    var dn = `<span class="nav-item dropdown pointermenu gvs">
                <i class="fa fa-user" class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Tài khoản</i>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li><a class="dropdown-item" href="account.html">Tài khoản</a></li>
                    <li onclick="logout()"><a class="dropdown-item" href="#">Đăng xuất</a></li>
                </ul>
            </span>
            <a href="cart.html" class="cartheader"><i class="fa fa-shopping-bag"></i></a>
            `
    var up = `<a href="upload.html" class="btn btn-danger pointermenu"><i class="fa fa-plus"></i> Đăng sản phẩm</a>`;
    if (token == null) {
        dn = `<a href="login.html" class="pointermenu gvs"><i class="fa fa-user"> Đăng ký/ Đăng nhập</i></a>
        <a href="login.html" class="cartheader"><i class="fa fa-shopping-bag"></i></a>`
        up = '';
    }
    var menu =
        ` <nav id="navbars" class="navbar navbar-expand-lg">
        <div class="container">
            <a href="index.html"><img class="logomenu" src="image/logo.png"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <span>
                <i style="border: none;" class="fa fa-shopping-bag navbar-toggler text-white"> <span class="slcartmenusm">0</span></i>
            </span>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item"><a class="nav-link menulink" href="index.html">Trang chủ</a></li>
                <li class="nav-item dropdown">
                    <a class="nav-link menulink dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Danh mục
                    </a>
                    <ul id="categoryheader" class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <li><a class="dropdown-item" href="#">danh mucj 1</a></li>
                    </ul>
                  </li>
            </ul>
            <div class="f-flex">
                <div class="divsearch">
                    <form action="product.html">
                        <input name="search" class="ipsearch" placeholder="Tìm kiếm">
                        <button class="btnsearch"><i class="fa fa-search"></i></button>
                    </form>
                </div>
            </div>
            <div class="d-flex">
                ${dn}
            </div>
            <div class="d-flex">
                ${up}
            </div>
        </div>
    </nav>`
    document.getElementById("menu").innerHTML = menu
    loadCategoryMenu();
    try { loadFooter(); } catch (error) {}
}


async function loadCategoryMenu() {
    var url = 'http://localhost:8080/api/public/allcategory';
    const response = await fetch(url, {});
    var list = await response.json();
    var main = ''
    for (i = 0; i < list.length; i++) {
        main += `<li><a class="dropdown-item" href="product.html?category=${list[i].id}&catename=${list[i].name}">${list[i].name}</a></li>`
    }
    document.getElementById("categoryheader").innerHTML = main;
}


function loadFooter() {
    var foo = ` <footer class="text-center text-lg-start text-muted">
    <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
      <div class="me-5 d-none d-lg-block"><span>Theo dõi chúng tôi tại:</span></div>
      <div>
        <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
        <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
      </div>
    </section>
    <section class="">
      <div class=" text-center text-md-start mt-5">
        <div class="row mt-3">
          <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            <p>
              Website là nơi trao đổi các sản phẩm cũ, thanh lý
            </p>
            <p><i class="fas fa-home me-3"></i> TRAO ĐỔI ĐỒ CŨ - HỌC VIỆN NÔNG NGHIỆP</p>
          </div>
          <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Sản phẩm</h6>
            <p><a href="#!" class="text-reset">Quần áo, giày dép</a></p>
            <p><a href="#!" class="text-reset">Sách, tài liệu</a></p>
          </div>
          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Giới thiệu</h6>
            <p><a href="#!" class="text-reset">Về chúng tôi</a></p>
            <p><a href="#!" class="text-reset">Dịch vụ</a></p>
            <p><a href="#!" class="text-reset">Hướng dẫn đăng tin</a></p>
            <p><a href="#!" class="text-reset">Liên hệ</a></p>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            <h6 class="text-uppercase fw-bold mb-4">Liên hệ</h6>
            <p><i class="fas fa-envelope me-3"></i> Địa chỉ : Trâu Quỳ, Gia Lâm, Hà Nội</p>
            <p><i class="fas fa-phone me-3"></i> Hotline: 0981 996 880 và 0339 898 882</p>
            <p><i class="fas fa-mail-bulk me-3"></i> muadocu@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  </footer>`
    document.getElementById("footer").innerHTML = foo;
}

async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('login.html')
}


function formatmoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}

