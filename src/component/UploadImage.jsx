import React, { useState } from "react";

const UploadImage = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const response = await fetch("https://api.cloudinary.com/v1_1/dlutzlpvz/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setImageUrl(data.secure_url);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ width: "300px", marginTop: "10px" }} />}
    </div>
  );
};

export default UploadImage;
