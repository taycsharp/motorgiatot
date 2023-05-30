import { Trash, Upload } from "@styled-icons/bootstrap";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImageLoader from "../Image";
import classes from "./fileUpload.module.css";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import customId from "custom-id-new";
import { storage } from "~/firebaseConfig";

const FileUpload = ({
  label,
  updateFilesCb,
  maxFileSizeInBytes,
  preSelectedFiles,
  resetCb,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState(preSelectedFiles || []);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (resetCb === "reset") {
      setFiles([]);
    }
  }, [resetCb]);

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFilesFirebase = async (file) => {
    try {
      setStatus("Uploading...");
      let fileUrl = "";
      if (file) {
        const name = `${customId({ randomLength: 7, lowerCase: true })}${
          file.name
        }`;
        const storageRef = ref(storage, `upload/${name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        await getDownloadURL(uploadTask.ref).then((url) => {
          fileUrl = url;
        });
        if (fileUrl.length) {
          setStatus("");
          return {
            name,
            url: fileUrl,
          };
        }
        return null;
      } else {
        throw new Error("File not found");
      }
    } catch (err) {
      setStatus(err.message);
      console.log(err);
    }
  };

  const callUpdateFilesCb = (files) => {
    updateFilesCb(files);
  };

  const handleNewFileUpload = async (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      if (newFiles[0].size <= maxFileSizeInBytes) {
        let uploadedFile = await addNewFilesFirebase(newFiles[0]);
        if (uploadedFile) {
          if (!otherProps.multiple) {
            setFiles([uploadedFile]);
            callUpdateFilesCb([uploadedFile]);
          } else {
            setFiles([...files, uploadedFile]);
            callUpdateFilesCb([...files, uploadedFile]);
          }
        }
      } else {
        toast.warning("File size is too large (Max 2mb)");
      }
    }
  };

  const removeFileFirebase = async (fileName) => {
    try {
      setStatus("Deleting...");
      const desertRef = ref(storage, `upload/${fileName}`);
      await deleteObject(desertRef).then(() => {
        const filteredItem = files.filter((item) => item.name !== fileName);
        setFiles(filteredItem);
        callUpdateFilesCb(filteredItem);
        setStatus("");
      });
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <>
      <div className={classes.fileUploadContainer}>
        <label className={classes.inputLabel}>{label}</label>
        <p className={classes.dragDropText}>
          Drag and drop your files anywhere or
        </p>
        <button
          className={classes.uploadFileBtn}
          type="button"
          onClick={handleUploadBtnClick}
        >
          <div>
            <Upload width={22} height={22} />
          </div>
          <span> Upload {otherProps.multiple ? "files" : "a file"}</span>
        </button>
        <input
          className={classes.formField}
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </div>
      {status.length > 0 && <div className="text-danger my-2">{status}</div>}
      <div className={classes.filePreviewContainer}>
        <span>To Upload</span>
        <div className={classes.previewList}>
          {files.map((file, index) => {
            return (
              <div className={classes.previewContainer} key={file.name + index}>
                <div className={classes.previewItem}>
                  <ImageLoader
                    className={classes.imagePreview}
                    src={file.url}
                    alt={file.name}
                    width={100}
                    height={100}
                  />
                  <aside>
                    <Trash
                      width={18}
                      height={18}
                      className={classes.removeFileIcon}
                      onClick={() => removeFileFirebase(file.name)}
                    />
                  </aside>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
