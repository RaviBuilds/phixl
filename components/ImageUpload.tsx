import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles:File[])=>{
        if(acceptedFiles.length > 0)
        {
          const currentFile = acceptedFiles[0];
          setFile(currentFile);

          //create e temprorary file preview url:
          const objectUrl = URL.createObjectURL(currentFile);
          setPreviewUrl(objectUrl);
        }
    },[])
    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: {
                "image.jpeg": [],
                "image/png": [],
                "image/webp": [],
            },
            maxFiles: 1,
            maxSize: 5 * 1024 * 1024, // this sets the 5mb limit
        });

    return (
        <div className="w-full mt-4">
            {!previewUrl ? (
                <></>
            ) : (
                <>
                    <h2>Hello</h2>
                </>
            )}
        </div>
    );
}
