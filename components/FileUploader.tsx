'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { toast } from "sonner"
import { uploadFile } from '@/lib/actions/file.action';
import { usePathname } from 'next/navigation';

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}


const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const path = usePathname();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(acceptedFiles);
    const uploadPromises = acceptedFiles.map(async (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        return toast.custom((t) => (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-brand px-4 py-2 shadow-md">
            <p className="body-2 text-white">
              <span className="font-semibold">{file.name}</span> is too large. Max file size is 50MB
            </p>

            <button
              onClick={() => toast.dismiss(t)}
              className="ml-2 rounded px-2 text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        ));

      }

      return uploadFile({ file, ownerId, accountId, path }).then(
        (uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name),
            );
          }
        },
      );
    });

    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop })
  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }


  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn("!uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt='upload'
          width={24}
          height={24}

        />{" "}
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className='!uploader-preview-list'>
          <h4 className='h4 text-light-100'>
            Uploading
          </h4>
          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={index}
                className='!uploader-preview-item'
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className='!preview-item-name'>
                    {file.name}
                    <Image
                      src="/assets/icons/file-loader.gif"
                      alt='loader'
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <Image
                  src="/assets/icons/remove.svg"
                  alt='remove'
                  width={24}
                  height={24}
                  onClick={(e) => {
                    handleRemoveFile(e, file.name)
                  }}
                />
              </li>
            )
          })}
        </ul>
      )}

    </div>
  )
}

export default FileUploader