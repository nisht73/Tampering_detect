import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = ({ onFileSelect, accept = '*/*', maxSize = 10485760, label = 'Upload File', preview = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      toast.error(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);

    if (preview && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      
      {!file ? (
        <div 
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <Upload className="h-10 w-10 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-500 mt-1">
            Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 w-full">
            {previewUrl ? (
              <div className="h-16 w-16 rounded overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                {file.type.startsWith('image/') ? <ImageIcon className="h-6 w-6 text-slate-500" /> : <File className="h-6 w-6 text-slate-500" />}
              </div>
            )}
            <div className="flex-1 min-w-0 pr-4">
              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={removeFile}
            className="p-1.5 mt-3 sm:mt-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
