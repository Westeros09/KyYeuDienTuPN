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
    // loadDataTable();
    if (document.getElementById("dataTable")) {
        loadDataTable();
    }

    if (document.getElementById("dataTableEvents")) {
        loadEventsTable();
    }
});

function loadDataTable() {

    db.collection("thongtin").orderBy("stt", "asc").get().then((querySnapshot) => {
        const dataSet = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;
            const tenPhongBan = phongBanMap[data.phongban] || data.phongban;
            dataSet.push([
                data.stt || '',
                data.hoten || '',
                data.noilam || '',
                data.capbac || 'N/A',
                tenPhongBan || 'N/A',
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
                { title: "Số thứ tự" },
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
                document.getElementById("stt").value = data.stt || "";
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

async function compressImage(file) {
    const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 2048,
        useWebWorker: true,
        initialQuality: 0.9
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log("Ảnh gốc:", (file.size / 1024 / 1024).toFixed(2), "MB");
        console.log("Ảnh nén:", (compressedFile.size / 1024 / 1024).toFixed(2), "MB");
        return compressedFile;
    } catch (error) {
        console.error("❌ Lỗi nén ảnh:", error);
        return file; // fallback
    }
}

async function luuDuLieu() {
    const docId = document.getElementById("docIdEditing").value || null;
    const stt = parseInt(document.getElementById("stt").value) || 0;
    const noilam = document.getElementById("noilam").value;
    const hoten = document.getElementById("hoten").value;
    const capbac = document.getElementById("capbac").value;
    const chucvu = document.getElementById("chucvu").value;
    const phongban = document.getElementById("phongban").value;
    const tamtinh = document.getElementById("tamtinh").value;

    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    if (file) {
        const compressed = await compressImage(file);

        const formData = new FormData();
        formData.append("file", compressed);
        formData.append("upload_preset", "KyYeuPN");


        // const now = new Date();
        // const ngay = String(now.getDate()).padStart(2, '0');
        // const thang = String(now.getMonth() + 1).padStart(2, '0');
        // const nam = now.getFullYear();
        // const dateString = `${ngay}${thang}${nam}`;
        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const rawName = file.name.split('.').slice(0, -1).join('.').trim().replace(/\s+/g, "-");
        formData.append("public_id", `${rawName}-${timestamp}`);


        // formData.append("public_id", `${rawName}-${dateString}`);


        fetch("https://api.cloudinary.com/v1_1/dn7svhgyv/image/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                const imageUrl = data.secure_url;
                luuVaoFirestore(docId, noilam, stt, hoten, capbac, chucvu, phongban, tamtinh, imageUrl);
            })
            .catch(error => {
                console.error("❌ Upload ảnh thất bại:", error);
                alert("Upload ảnh thất bại, dữ liệu chưa được lưu.");
            });
    } else {
        const previewImage = document.getElementById("previewImage");
        // const imageUrl = previewImage && previewImage.src !== "#" ? previewImage.src : null;
        const imageUrl = (previewImage && previewImage.src && !previewImage.src.endsWith("#")) ? previewImage.src : null;
        luuVaoFirestore(docId, noilam, stt, hoten, capbac, chucvu, phongban, tamtinh, imageUrl);
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

function luuVaoFirestore(docId, noilam, stt, hoten, capbac, chucvu, phongban, tamtinh, imageUrl) {
    const data = {
        noilam,
        stt,
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

}

//==========================================CN XÓA===========================================

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

//===========================================================================================
//==========================================TRANG AD_EVENT======================================
//===========================================================================================


const uploadPreset = "KyYeuPN";
document.getElementById("eventGroup").addEventListener("change", updateFolderName);
document.getElementById("displayName").addEventListener("input", updateFolderName);

function loadEventsTable() {
    db.collection("events").orderBy("thoigian", "desc").get().then((querySnapshot) => {
        const dataSet = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const docId = doc.id;

            dataSet.push([
                data.nhom || '',                      // Nhóm sự kiện
                data.title || '',                     // Tên sự kiện
                data.folder || '',                    // Đường dẫn thư mục

                data.total || 0,                      // Số lượng ảnh
                data.thoigian?.toDate().toLocaleString("vi-VN") || '', // Thời gian tạo
                `
                     <button type="button" class="btn btn-sm btn-primary edit-btn-event" data-id="${docId}" data-toggle="modal" data-target="#exampleModal">
                        Thêm ảnh
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="xoaSuKien('${docId}', '${data.title}')">Xóa</button>
                    
                `,
            ]);
        });

        $('#dataTableEvents').DataTable({
            data: dataSet,
            columns: [
                { title: "Nhóm" },
                { title: "Tên sự kiện" },
                { title: "Thư mục" },

                { title: "Số ảnh" },
                { title: "Thời gian tạo" },
                { title: "Hành động", orderable: false, searchable: false }
            ],
            destroy: true
        });
    }).catch(error => {
        console.error("Lỗi khi load dữ liệu:", error);
    });
}

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("edit-btn-event")) {
        const docId = event.target.getAttribute("data-id");
        document.getElementById("docIdEditing").value = docId;

        db.collection("events").doc(docId).get().then((doc) => {
            if (doc.exists) {
                const groupEl = document.getElementById("eventGroup");
                const nameEl = document.getElementById("displayName");
                const data = doc.data();
                document.getElementById("eventGroup").value = data.nhom || "";
                document.getElementById("displayName").value = data.title || "";
                document.getElementById("folderName").value = data.folder || "";
                document.getElementById("totalImages").value = data.total || "";
                // 👇 Hiển thị modal sau khi dữ liệu đã được gán
                // groupEl.setAttribute("disabled", true);
                // nameEl.setAttribute("readonly", true);
                $('#exampleModal1').modal('show');
            }
            else {
                alert("Không tìm thấy dữ liệu.");
            }
        });
    }
});

function updateFolderName() {
    const group = document.getElementById("eventGroup").value.trim();
    const folderRaw = document.getElementById("displayName").value.trim();
    if (group && folderRaw) {
        const formatted = folderRaw.replace(/\s+/g, "");
        document.getElementById("folderName").value = `${group}/${formatted}`;
    } else {
        document.getElementById("folderName").value = "";
    }
}

// Cập nhật số lượng ảnh
document.getElementById("imageUpload").addEventListener("change", () => {
    const total = document.getElementById("imageUpload").files.length;
    document.getElementById("totalImages").value = total;
});

async function uploadAndSave() {
    const group = document.getElementById("eventGroup").value;
    const title = document.getElementById("displayName").value.trim();
    const folder = document.getElementById("folderName").value.trim();
    const files = document.getElementById("imageUpload").files;
    const imageUrls = [];

    if (!group || !title || !folder) {
        alert("❗ Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (files.length === 0) {
        alert("❗ Bạn chưa chọn ảnh hoặc video.");
        return;
    }

    // Upload tất cả ảnh/video lên Cloudinary
    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", folder);

        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        const rawName = file.name.split('.').slice(0, -1).join('.').trim().replace(/\s+/g, "-");
        formData.append("public_id", `${rawName}-${timestamp}`);

        const fileType = file.type.startsWith("video/") ? "video" : "image";
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/dn7svhgyv/${fileType}/upload`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            imageUrls.push(data.secure_url);
            console.log("✅ Uploaded:", data.secure_url);
        } catch (err) {
            console.error("❌ Upload thất bại:", file.name, err);
        }
    }

    // Lưu sự kiện vào Firestore
    try {
        // 2. Tìm tài liệu sự kiện theo `folder`
        const query = await db.collection("events").where("folder", "==", folder).limit(1).get();

        if (!query.empty) {
            // 🔄 Nếu sự kiện đã tồn tại → cập nhật ảnh và tổng số
            const docId = query.docs[0].id;
            await db.collection("events").doc(docId).update({
                images: firebase.firestore.FieldValue.arrayUnion(...imageUrls),
                total: firebase.firestore.FieldValue.increment(files.length),
                thoigian: firebase.firestore.FieldValue.serverTimestamp(), // cập nhật thời gian
            });

            alert("✅ Đã thêm ảnh vào sự kiện cũ!");
            loadEventsTable();
        } else {
            // 🆕 Nếu chưa có → tạo mới
            await db.collection("events").add({
                folder: folder,
                title: title,
                total: files.length,
                nhom: group,
                images: imageUrls,
                thoigian: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert("✅ Đã tạo sự kiện mới!");
            loadEventsTable();
        }

        document.querySelector("form").reset();
        document.getElementById("folderName").value = "";
        document.getElementById("totalImages").value = "";
    } catch (error) {
        alert("❌ Lỗi khi lưu sự kiện: " + error.message);
    }
}

function xoaSuKien(id, title) {
    if (confirm(`Bạn có chắc chắn muốn xóa "${title}" không?`)) {
        db.collection("events").doc(id).delete()
            .then(() => {
                alert("✅ Đã xóa thành công!");
                location.reload();
            })
            .catch((error) => {
                console.error("❌ Lỗi khi xóa tài liệu:", error);
                alert("Có lỗi xảy ra khi xóa.");
            });
    }
}




