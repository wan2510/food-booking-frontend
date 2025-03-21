import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { resize, fill } from "@cloudinary/url-gen/actions/resize";
import { format } from "@cloudinary/url-gen/actions/delivery";

const DisplayImage = ({ imageId }) => {
  const cld = new Cloudinary({
    cloud: {
      cloudName: "dlutzlpvz",
    },
  });

  const img = cld.image(imageId)
    .resize(fill().width(500).height(500))
    .delivery(format("auto"));

  return <AdvancedImage cldImg={img} />;
};

export default DisplayImage;