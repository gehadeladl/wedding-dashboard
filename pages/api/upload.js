import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        message: "Method Not Allowed",
      });
    }

    const { image } = req.body;

    const result = await cloudinary.uploader.upload(image, {
      folder: "designer-products",
    });

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Upload Failed",
    });
  }
}
