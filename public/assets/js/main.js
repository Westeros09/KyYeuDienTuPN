/**
* Template Name: Dewi
* Template URL: https://bootstrapmade.com/dewi-free-multi-purpose-html-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);


  // ========================= FILTER (TRANG LIST) =======================================================
  // =====================================================================================================
  // =====================================================================================================
  const firebaseConfig = {
    apiKey: "AIzaSyCo3wgNxCadkszkEP6ymnjFi4HIvVVktbU",
    authDomain: "kyyeu-phunhuan.firebaseapp.com",
    projectId: "kyyeu-phunhuan",
    storageBucket: "kyyeu-phunhuan.firebasestorage.app",
    messagingSenderId: "440890277287",
    appId: "1:440890277287:web:f00fcf9b017978f94c4a82",
    measurementId: "G-JVX3GKQ32P"
  };

  // Khởi tạo Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  let iso; // Khai báo toàn cục
  function getNoiLamFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("noilam");
  }

  // document.querySelector(".search-input").addEventListener("input", function () {
  //   const searchTerm = this.value.trim().toLowerCase();
  //   console.log("Tên tìm kiếm: " + searchTerm)
  //   timTheoTen(searchTerm);
  // });

  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.trim().toLowerCase();
      console.log("Tên tìm kiếm: " + searchTerm);
      timTheoTen(searchTerm);
    });
  }


  function timTheoTen(tuKhoa) {
    if (!tuKhoa) {
      napDuLieuVaoHTML();
      return;
    }
    const noilamFilter = getNoiLamFromURL();
    let query = db.collection("thongtin");

    if (noilamFilter) {
      query = query.where("noilam", "==", noilamFilter).orderBy("thoigian", "desc");
    } else {
      query = query.orderBy("thoigian", "desc");
    }

    query.get().then((querySnapshot) => {
      const container = document.querySelector(".isotope-container");
      container.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const hoTen = data.hoten.toLowerCase();
        const key = tuKhoa.toLowerCase();

        if (hoTen.includes(key)) {
          const docId = doc.id;
          const memberHTML = `
          <div class="col-lg-3 col-6 portfolio-item isotope-item filter-${data.phongban}" data-aos-delay="100">
            <div class="member">
              <a href="portfolio-details.html?id=${docId}">
                <div class="pic">
                  <img src="${data.hinhanh || './assets/img/NoAvatar.jpg'}" class="img-fluid" alt="Ảnh đại diện">
                </div>
                <div class="member-info">
                  <h4>${data.hoten}</h4>
                  <span>${data.capbac || 'N/A'}</span>
                  <div class="social">
                    <span>${data.chucvu}</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        `;
          container.insertAdjacentHTML("beforeend", memberHTML);
        }
      });

      imagesLoaded(container, function () {
        if (iso) iso.destroy();
        iso = new Isotope(container, {
          itemSelector: '.portfolio-item',
          layoutMode: 'masonry'
        });
      });
    });
  }


  function napDuLieuVaoHTML() {
    const noilamFilter = getNoiLamFromURL();
    console.log(noilamFilter)

    let query = db.collection("thongtin")
    if (noilamFilter) {
      query = query.where("noilam", "==", noilamFilter).orderBy("thoigian", "desc");
    } else {
      query = query.orderBy("thoigian", "desc");
    }
    query.get()
      .then((querySnapshot) => {
        const container = document.querySelector(".isotope-container");
        container.innerHTML = "";

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;
          const memberHTML = `
        <div class="col-lg-3 col-6 portfolio-item isotope-item filter-${data.phongban}" data-aos-delay="100">
          <div class="member">
            <a href="portfolio-details.html?id=${docId}">
              <div class="pic">
               
                <img src="${data.hinhanh ? data.hinhanh : './assets/img/NoAvatar.jpg'}" class="img-fluid" alt="Ảnh đại diện">
              </div>
              <div class="member-info">
                <h4>${data.hoten}</h4>
                <span>${data.capbac ? data.capbac : 'N/A'}</span>              
                <div class="social">
                 <span>${data.chucvu}</span>                 
                </div>
              </div>
            </a>
          </div>
        </div>
        
      `;
          container.insertAdjacentHTML("beforeend", memberHTML);
        });

        // Sau khi ảnh đã load hết
        imagesLoaded(container, function () {
          if (iso) iso.destroy(); // Nếu đã có Isotope, xóa trước
          iso = new Isotope(container, {
            itemSelector: '.portfolio-item',
            layoutMode: 'masonry'
          });
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }

  document.addEventListener("DOMContentLoaded", () => {
    AOS.init({ duration: 1000, once: true });

    // Lọc dữ liệu khi nhấn filter
    document.querySelectorAll('.nav-link[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        let filterValue = btn.getAttribute('data-filter');
        if (iso) {
          iso.arrange({ filter: filterValue });
        }

        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    napDuLieuVaoHTML(); // Load dữ liệu ban đầu
  });


  // ========================= LOAD THONG TIN (TRANG DETAIL) =============================================
  // =====================================================================================================
  // =====================================================================================================

  const phongBanMap = {
    "bch": "Ban Chỉ huy",
    "tm": "Ban Tham mưu",
    "ct": "Ban Chính Trị",
    "hckt": "Ban Hậu cần-Kỹ thuật",
    "dqtv": "Dân quân tự vệ",
    // thêm các phòng ban khác nếu có
  };

  function getIDFromURL() {
    const params = new URLSearchParams(window.location.search);
    console.log(params.get("id"))
    return params.get("id");
  }

  function hienThiChiTietNguoiDung() {
    const id = getIDFromURL();
    if (!id) {
      console.error("❌ Không tìm thấy ID trên URL.");
      return;
    }

    db.collection("thongtin").doc(id).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          document.querySelector(".portfolio-info h3").innerText = data.hoten;
          const tenPhongBan = phongBanMap[data.phongban] || data.phongban;
          const ul = document.querySelector(".portfolio-info ul");
          ul.innerHTML = `
          <li><strong>Nơi làm</strong>: ${data.noilam}</li>
          <li><strong>Cấp bậc</strong>: ${data.capbac}</li>
          <li><strong>Phòng ban</strong>: ${tenPhongBan}</li>
          <li><strong>Chức vụ</strong>: ${data.chucvu}</li>
        `;

          document.querySelector(".portfolio-description p").innerText = data.tamtinh ?? "Chưa có.";
          document.querySelector(".swiper-wrapper").innerHTML = `
            <div class="swiper-slide">
              <img src="${data.hinhanh}" alt="Hình ảnh cá nhân">
            </div> `;

        } else {
          console.log("Không tìm thấy dữ liệu.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy chi tiết:", err);
      });
  }

  document.addEventListener("DOMContentLoaded", hienThiChiTietNguoiDung);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });



  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();






