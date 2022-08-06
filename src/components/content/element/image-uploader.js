import React, { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import imageCompression from "browser-image-compression";
import { MultiLang } from "./widget";

export default function ImageUploader({ url = [], handleChangeImages }) {
  const [images, setImages] = useState(url);
  const maxNumber = 69;

  const imageDrop = async (imageList, addUpdateIndex) => {
    setImages(imageList);
    let compressorImages = [];
    await Promise.all(
      imageList.map(async (image) => {
        if (typeof image === "string") {
          compressorImages = [...compressorImages, image];
        } else {
          const compressImage = await imageCompression(image.file, {
            initialQuality: 0.6,
            maxWidthOrHeight: 800,
          });
          compressorImages = [...compressorImages, compressImage];
        }
      })
    );
    handleChangeImages(compressorImages);
  };

  useEffect(() => {
    if (images?.length !== url?.length) setImages(url);
    //eslint-disable-next-line
  }, [url.length]);
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
          onImageRemoveAll,
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
            <button
              className="btn btn-outline-primary m-right-10 mb-10"
              onClick={onImageRemoveAll}
            >
              <MultiLang text="remove_all_images" />
            </button>
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
