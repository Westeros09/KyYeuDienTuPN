export default async function handler(req, res) {
    const cloudName = 'dn7svhgyv';
    const { folder } = req.query;

    if (!folder) {
        return res.status(400).json({ error: 'Missing folder parameter' });
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folder}/&max_results=100`;
    // const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?prefix=${folder}/&max_results=100`;

    const auth = Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64');

    const response = await fetch(url, {
        headers: {
            Authorization: 'Basic ' + auth
        }
    });

    if (!response.ok) {
        const errText = await response.text(); // xem thông báo chi tiết
        console.error("Cloudinary fetch failed:", errText);
        return res.status(500).json({ error: 'Failed to fetch from Cloudinary' });
    }

    const data = await response.json();
    res.status(200).json(data.resources || []);
}
