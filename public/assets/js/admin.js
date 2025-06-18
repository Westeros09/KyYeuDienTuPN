const firebaseConfig = {
    apiKey: "AIzaSyCo3wgNxCadkszkEP6ymnjFi4HIvVVktbU",
    authDomain: "kyyeu-phunhuan.firebaseapp.com",
    projectId: "kyyeu-phunhuan",
    storageBucket: "kyyeu-phunhuan.firebasestorage.app",
    messagingSenderId: "440890277287",
    appId: "1:440890277287:web:f00fcf9b017978f94c4a82",
    measurementId: "G-JVX3GKQ32P"
};
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

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function luuDuLieu() {
    const noilam = document.getElementById("noilam").value;
    const hoten = document.getElementById("hoten").value;
    const capbac = document.getElementById("capbac").value;
    const chucvu = document.getElementById("chucvu").value;
    const phongban = document.getElementById("phongban").value;
    const tamtinh = document.getElementById("tamtinh").value;

    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];  // Lấy file ảnh

    if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "KyYeuPN");
        let rawName = file.name.split('.').slice(0, -1).join('.');
        rawName = rawName
            .trim()
            .replace(/\s+/g, '-')
        const publicId = `${noilam.trim().replace(/\s+/g, "-")}-${chucvu.trim().replace(/\s+/g, "-")}`;
        formData.append("public_id", rawName);

        fetch("https://api.cloudinary.com/v1_1/dn7svhgyv/image/upload", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                const imageUrl = data.secure_url;
                luuVaoFirestore(noilam, hoten, capbac, chucvu, phongban, tamtinh, imageUrl);
            })
            .catch(err => {
                console.error("❌ Upload ảnh thất bại:", err);
                alert("Upload ảnh thất bại, dữ liệu chưa được lưu.");
            });
    } else {
        luuVaoFirestore(noilam, hoten, capbac, chucvu, phongban, tamtinh, null);
    }
}

function resetForm() {
    document.getElementById("imageUpload").value = "";
    const preview = document.getElementById("previewImage");
    preview.src = "#";
    preview.style.display = "none";
}


function luuVaoFirestore(noilam, hoten, capbac, chucvu, phongban, tamtinh, imageUrl) {
    db.collection("thongtin").add({
        noilam: noilam,
        hoten: hoten,
        capbac: capbac || null,
        chucvu: chucvu,
        phongban: phongban,
        tamtinh: tamtinh || null,
        hinhanh: imageUrl,
        thoigian: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(() => {
            alert("Đã tạo và lưu thành công!");
            resetForm();
        })
        .catch(err => {
            console.error("Lỗi khi tạo:", err);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        });
}





