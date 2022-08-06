import imageCompression from "browser-image-compression";
import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { MultiLang } from "./widget";

export default function ProfileUpload({ avatar, handleChangeImages }) {
  const [images, setImages] = useState(avatar);
  const maxNumber = 1;

  const imageDrop = async (imageList, addUpdateIndex) => {
    setImages(imageList);
    let compressorImages = [];
    await Promise.all(
      imageList.map(async (image) => {
        if (typeof image === "string") {
          compressorImages = [...compressorImages, image];
        } else {
          const compressImage = await imageCompression(image.file, {
            initialQuality: 0.8,
            maxWidthOrHeight: 150,
          });
          compressorImages = [...compressorImages, compressImage];
        }
      })
    );
    handleChangeImages(compressorImages);
  };

  useEffect(() => {
    setImages(avatar);
    // eslint-disable-next-line
  }, [avatar.length]);

  return (
    <div>
      <ImageUploading
        multiple
        value={images}
        onChange={imageDrop}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              className="btn btn btn-outline-success cu-radius mb-10"
              style={isDragging ? { color: "red" } : null}
              onClick={onImageUpload}
              {...dragProps}
            >
              <MultiLang text="click_drop_here" />
            </button>
            &nbsp;
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img
                  src={typeof image === "string" ? image : image.data_url}
                  alt=""
                  className="preview-images"
                />
                <div className="image-item__btn-wrapper">
                  <button
                    onClick={() => onImageUpdate(index)}
                    className="icon-button icon-update"
                    title="Update Image"
                  >
                    <i className="la la-refresh"></i>
                  </button>
                  <br />
                  <button
                    onClick={() => onImageRemove(index)}
                    className="icon-button icon-remove"
                    title="Remove Image"
                  >
                    <i className="la la-remove"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
