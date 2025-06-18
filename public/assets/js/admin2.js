const firebaseConfig = {
    apiKey: "AIzaSyCo3wgNxCadkszkEP6ymnjFi4HIvVVktbU",
    authDomain: "kyyeu-phunhuan.firebaseapp.com",
    projectId: "kyyeu-phunhuan",
    storageBucket: "kyyeu-phunhuan.firebasestorage.app",
    messagingSenderId: "440890277287",
    appId: "1:440890277287:web:f00fcf9b017978f94c4a82",
    measurementId: "G-JVX3GKQ32P"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const phongBanMap = {
    "bch": "Ban Chỉ huy",
    "tm": "Ban Tham mưu",
    "ct": "Ban Chính Trị",
    "hckt": "Ban Hậu cần-Kỹ thuật",
    "dqtv": "Dân quân tự vệ",
    "khac": "Khác"
};

document.addEventListener("DOMContentLoaded", function () {
    loadDataTable();
});




function loadDataTable() {

    db.collection("thongtin").orderBy("thoigian", "desc").get().then((querySnapshot) => {
        const dataSet = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            const tenPhongBan = phongBanMap[data.phongban] || data.phongban;
            dataSet.push([
                data.hoten || '',
                data.noilam || '',
                data.capbac || 'N/A',
                tenPhongBan || '',
                data.chucvu || '',
                `
                    <button type="button" class="btn btn-sm btn-primary edit-btn" data-id="${docId}" data-toggle="modal" data-target="#exampleModal">
                        Sửa
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${docId}">Xóa</button>
                `,
            ]);
        });

        $('#dataTable').DataTable({
            data: dataSet,
            columns: [
                { title: "Họ tên" },
                { title: "Nơi làm" },
                { title: "Cấp bậc" },
                { title: "Phòng ban" },
                { title: "Chức vụ" },
                { title: "Hành động", orderable: false, searchable: false }
            ],
            destroy: true
        });
    }).catch(error => {
        console.error("Lỗi khi load dữ liệu:", error);
    });
}

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("edit-btn")) {
        const docId = event.target.getAttribute("data-id");
        document.getElementById("docIdEditing").value = docId;

        db.collection("thongtin").doc(docId).get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                document.getElementById("hoten").value = data.hoten || "";
                document.getElementById("noilam").value = data.noilam || "";
                document.getElementById("capbac").value = data.capbac || "";
                document.getElementById("chucvu").value = data.chucvu || "";
                document.getElementById("phongban").value = data.phongban || "";
                document.getElementById("tamtinh").value = data.tamtinh || "";

                if (data.hinhanh) {
                    document.getElementById("previewImage").src = data.hinhanh;
                    document.getElementById("previewImage").style.display = "block";

                } else {
                    document.getElementById("previewImage").style.display = "none";

                }
                // 👇 Hiển thị modal sau khi dữ liệu đã được gán
                $('#exampleModal').modal('show');
            }
            else {
                alert("Không tìm thấy dữ liệu.");
            }
        });
    }
});


//======================================================================================================
//=============================================ADD & UPDATE=============================================

const imageInput = document.getElementById('imageUpload');
const preview = document.getElementById('previewImage');

imageInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
});



function luuDuLieu() {
    const docId = document.getElementById("docIdEditing").value || null;
    const noilam = document.getElementById("noilam").value;
    const hoten = document.getElementById("hoten").value;
    const capbac = document.getElementById("capbac").value;
    const chucvu = document.getElementById("chucvu").value;
    const phongban = document.getElementById("phongban").value;
    const tamtinh = document.getElementById("tamtinh").value;

    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "KyYeuPN");
        let rawName = file.name.split('.').slice(0, -1).join('.');
        rawName = rawName
            .trim()
            .replace(/\s+/g, '-')

        const now = new Date();
        const ngay = String(now.getDate()).padStart(2, '0');
        const thang = String(now.getMonth() + 1).padStart(2, '0');
        const nam = now.getFullYear();

        const dateString = `${ngay}${thang}${nam}`;
        formData.append("public_id", `${rawName}-${dateString}`);
        // formData.append("public_id", rawName);
        // formData.append("overwrite", "true");

        fetch("https://api.cloudinary.com/v1_1/dn7svhgyv/image/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                const imageUrl = data.secure_url;
                luuVaoFirestore(docId, noilam, hoten, capbac, chucvu, phongban, tamtinh, imageUrl);
            })
            .catch(error => {
                console.error("❌ Upload ảnh thất bại:", error);
                alert("Upload ảnh thất bại, dữ liệu chưa được lưu.");
            });
    } else {
        const previewImage = document.getElementById("previewImage");
        // const imageUrl = previewImage && previewImage.src !== "#" ? previewImage.src : null;
        const imageUrl = (previewImage && previewImage.src && !previewImage.src.endsWith("#")) ? previewImage.src : null;
        luuVaoFirestore(docId, noilam, hoten, capbac, chucvu, phongban, tamtinh, imageUrl);
    }
}


function resetForm() {
    document.getElementById("imageUpload").value = "";
    const preview = document.getElementById("previewImage");
    preview.src = "#";
    preview.style.display = "none";
    document.getElementById("hoten").value = "";
    document.getElementById("capbac").value = "";
    document.getElementById("chucvu").value = "";
    document.getElementById("phongban").selectedIndex = 0;
    document.getElementById("noilam").selectedIndex = 0;
    document.getElementById("docIdEditing").value = "";
}

function luuVaoFirestore(docId, noilam, hoten, capbac, chucvu, phongban, tamtinh, imageUrl) {
    const data = {
        noilam,
        hoten,
        capbac: capbac || null,
        chucvu,
        phongban,
        tamtinh: tamtinh || null,
        hinhanh: imageUrl || null,
        thoigian: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!docId) {
        // Trường hợp thêm mới → kiểm tra trùng
        db.collection("thongtin")
            .where("hoten", "==", hoten)
            .where("noilam", "==", noilam)
            .where("capbac", "==", capbac)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    alert("❗Thành viên đã tồn tại (trùng họ tên, nơi làm và cấp bậc)!");
                    return;
                }

                // Không trùng → tiến hành thêm
                db.collection("thongtin")
                    .add(data)
                    .then(() => {
                        alert("✅ Thêm mới thành công!");
                        loadDataTable();
                        resetForm();
                    })
                    .catch(error => {
                        console.error("❌ Lỗi Firestore:", error);
                        alert("Thêm mới thất bại!");
                    });
            })
            .catch(error => {
                console.error("❌ Lỗi kiểm tra trùng:", error);
                alert("Lỗi khi kiểm tra dữ liệu trùng!");
            });
    } else {
        // Trường hợp cập nhật
        db.collection("thongtin")
            .doc(docId)
            .update(data)
            .then(() => {
                alert("✅ Cập nhật thành công!");
                loadDataTable();
                resetForm();
            })
            .catch(error => {
                console.error("❌ Lỗi Firestore:", error);
                alert("Cập nhật thất bại!");
            });
    }

    // const action = docId
    //     ? db.collection("thongtin").doc(docId).update(data)
    //     : db.collection("thongtin").add(data);

    // action
    //     .then(() => {
    //         alert(docId ? "✅ Cập nhật thành công!" : "✅ Thêm mới thành công!");
    //         loadDataTable();
    //         resetForm();
    //     })
    //     .catch(error => {
    //         console.error("❌ Lỗi Firestore:", error);
    //         alert(docId ? "Cập nhật thất bại!" : "Thêm mới thất bại!");
    //     });
}




//==========================================CN XÓA===========================================
//===========================================================================================

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("delete-btn")) {
        const docId = event.target.getAttribute("data-id");
        if (confirm("Bạn có chắc chắn muốn xóa không?")) {
            db.collection("thongtin").doc(docId).delete()
                .then(() => {
                    alert("Đã xóa thành công!");
                    location.reload(); // Hoặc gọi hàm load lại bảng nếu có
                })
                .catch((error) => {
                    console.error("Lỗi khi xóa tài liệu:", error);
                    alert("Có lỗi xảy ra khi xóa.");
                });
        }
    }
});



