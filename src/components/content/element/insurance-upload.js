import "react-pdf/dist/umd/Page/AnnotationLayer.css";

import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import FontAwesome from "react-fontawesome";
import { Document, Page, pdfjs } from "react-pdf";
import { useDispatch } from "react-redux";
import toastr from "toastr";

import { corsAnywhere } from "../../../config.js";
import * as Actions from "../../../Store/action/auth";
import { MultiLang } from "./widget.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// let t = corsAnywhere

function FileUpload(props) {
  const dispatch = useDispatch();
  const [insuranceInfo, setInsuranceInfo] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [insuranceUrl, setInsuranceUrl] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState("");
  const [load, setLoad] = useState(false);
  const [showFile, setShowFile] = useState("");

  useEffect(() => {
    const advertiser = JSON.parse(sessionStorage.getItem("user"));
    const insurances = advertiser.insurances;
    if (insurances === undefined) {
      setInsuranceInfo([]);
    } else {
      setInsuranceInfo(insurances);
    }
  }, []);

  /*When document gets loaded successfully*/
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const uploadInsuranceFile = async () => {
    const advertiser = JSON.parse(sessionStorage.getItem("user"));
    if (file === "") {
      toastr.info("Select your insurance file!");
      return false;
    }
    setLoad(true);
    dispatch(Actions.setInsuranceInfo(advertiser, file, props.history)).then(
      (res) => {
        setInsuranceInfo(res);
        setLoad(false);
      }
    );
  };

  const deleteInsurance = (key) => {
    toastr.info("Just seconds.");
    const deletedData = insuranceInfo.splice(key, 1)?.[0];
    dispatch(Actions.deleteInsuranceInfo(insuranceInfo, deletedData)).then(
      (res) => {
        if (res) {
          setInsuranceInfo([
            ...insuranceInfo.slice(0, key),
            ...insuranceInfo.slice(key + 1),
          ]);
          if (deletedData?.insuranceUrl === insuranceUrl) {
            setInsuranceUrl("");
          }
          toastr.success("Insurance file deleted successfully");
        }
      }
    );
  };

  const setUrl = (key) => {
    setInsuranceUrl(insuranceInfo[key].insuranceUrl);
  };

  useEffect(() => {
    setShowFile(file);
  }, [file]);
  useEffect(() => {
    if (Boolean(insuranceUrl?.length)) {
      setShowFile(corsAnywhere + insuranceUrl);
    }
  }, [insuranceUrl]);

  return (
    <div id="upload-box">
      <div className="row insurance-box">
        <div className="col-md-12">
          {insuranceInfo && insuranceInfo.length === 0 ? (
            <Alert className="m-bottom-15" variant="filled" severity="warning">
              <MultiLang text="send_insurance_file" />
            </Alert>
          ) : (
            <Alert className="m-bottom-15" variant="filled" severity="success">
              <MultiLang text="insurance_receive" />
            </Alert>
          )}
        </div>
        <div className="col-md-12">
          <label className="btn btn-xs btn-gradient btn-gradient-two">
            <FontAwesome name="upload" />
            <MultiLang text="select_insurance_file" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              hidden={true}
              accept="application/pdf"
            />
          </label>
          <button
            className="btn btn-xs btn-gradient btn-gradient-two"
            style={{ float: "right" }}
            onClick={uploadInsuranceFile}
            disabled={file === "" ? true : false}
          >
            <FontAwesome name="save" />
            <MultiLang text="save" />
          </button>
          {load && (
            <CircularProgress
              color="secondary"
              size={24}
              className="save-spin"
            />
          )}
        </div>
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              {insuranceInfo &&
                insuranceInfo.length > 0 &&
                insuranceInfo.map((item, key) => {
                  return (
                    <div className="insurance-info" key={key}>
                      <h5 onClick={(e) => setUrl(key)}>
                        <FontAwesome name="file-alt" />
                        &nbsp; {item.date}
                      </h5>
                      <h5 onClick={(e) => deleteInsurance(key)}>
                        <i className="la la-trash la-2x"></i>
                      </h5>
                    </div>
                  );
                })}
            </div>
            <div className="col-md-6 col-sm-12">
              {/* <img
                src={Boolean(showFile) ? showFile : ''}
                alt=""
                width="100%"
              ></img> */}
              <Document
                className="text-center"
                file={Boolean(showFile) ? showFile : ""}
                onLoadSuccess={onDocumentLoadSuccess}
                noData={
                  <h4>
                    <MultiLang text="select_a_file_or_insurance" />
                  </h4>
                }
              >
                <Page pageNumber={pageNumber} />
              </Document>

              {numPages > 1 && (file || props.url) ? (
                <div className="text-center p-top-10">
                  <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={previousPage}
                    className="Pre"
                  >
                    <MultiLang text="previous" />
                  </button>
                  <button
                    type="button"
                    disabled={pageNumber >= numPages}
                    onClick={nextPage}
                  >
                    <MultiLang text="next" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12"></div>
    </div>
  );
}

export default FileUpload;
