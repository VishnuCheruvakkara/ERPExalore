import cloudinary.uploader


class CloudinaryService:

    @staticmethod
    def upload_image(file, folder="items"):
        result = cloudinary.uploader.upload(
            file,
            folder=folder
        )

        return result["secure_url"]