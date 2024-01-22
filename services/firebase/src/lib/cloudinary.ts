import { v2 as cloudinary } from 'cloudinary'

export async function getUploadedImage(url: string) {
  if (!url) {
    return ''
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
  })

  const result = await cloudinary.uploader.upload(url)

  return result.secure_url
}
