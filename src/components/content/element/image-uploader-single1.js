import React from "react";
import ImageUploading from "react-images-uploading";
import { connect } from "react-redux";
import { ImageUploadData } from "../../../Store/action/imageUpload";

class ImageUploaderSingle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
    this.imageDrop = this.imageDrop.bind(this);
  }
  imageDrop = (imageList, addUpdateIndex) => {
    this.setState({
      images: imageList,
    });
    this.props.imageUpload(imageList);
  };

  componentDidMount() {
    if (typeof this.props.url === "string") {
      if (this.props.url !== "") {
        this.setState({ images: [this.props.url] });
      }
    } else {
      this.setState({ images: this.props.url });
    }
  }

  render() {
    const maxNumber = 1;
    return (
      <div>
        <ImageUploading
          value={this.state.images}
          onChange={this.imageDrop}
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
              <div className="single-image-droper"
                onClick={onImageUpload}
                style={isDragging ? { borderColor: "red" } : null}
                {...dragProps}
              >
                <p>Click or Drop here</p>
              </div>
              {imageList.length > 0 &&
                imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img
                      src={typeof image === "string" ? image : image.data_url}
                      alt=""
                      className="preview-images preview-images-sigle"
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
}
const mapDispatchToProps = (dispatch) => {
  return {
    ImageUploadData: (data) => dispatch(ImageUploadData(data)),
  };
};
export default connect(null, mapDispatchToProps)(ImageUploaderSingle);
