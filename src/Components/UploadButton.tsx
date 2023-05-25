import React, { useState } from 'react';

interface UploadButtonInterface {
  onChange: (file : File) => void;
}

function UploadButton({ onChange } : UploadButtonInterface): React.ReactElement {
  const [filename, setFilename] = useState<string>("");
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if(event && event.target && event.target.files) {
      onChange(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  }
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-primary rounded-lg shadow-lg tracking-wide uppercase border-2 border-primary transition duration-300 ease-in-out bg-opacity-40 cursor-pointer hover:bg-primary hover:text-white">
        <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 leading-normal">Upload an Image</span>
        <input type='file' accept="image/*" className="hidden" onChange={handleChange} />
      </label>
      <span className="self-end">{filename}</span>
    </div>
  );
}

export default UploadButton;