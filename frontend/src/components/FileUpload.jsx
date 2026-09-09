import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ file, setFile, onFileSelect, label, acceptTypesText = 'PNG, JPG, JPEG, PDF • Max 10 MB' }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }

    const setter = setFile || onFileSelect;
    if (setter) setter(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [setFile, onFileSelect]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      const rej = fileRejections[0];
      if (rej.errors[0]?.code === 'file-too-large') {
        toast.error('File size exceeds the 10 MB limit.');
      } else {
        toast.error('Unsupported file format. Supported: JPG, JPEG, PNG, WEBP, PDF.');
      }
      return;
    }
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  }, [handleFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    const setter = setFile || onFileSelect;
    if (setter) setter(null);
    setPreviewUrl(null);
  };

  const currentFile = file;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}

      {!currentFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors flex flex-col items-center justify-center bg-white ${
            isDragActive
              ? 'border-blue-500 bg-blue-50/50 text-blue-600'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            {isDragActive ? 'Drop your document here' : 'Click to upload or drag & drop'}
          </p>
          <p className="text-xs text-slate-400 mt-1">{acceptTypesText}</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-lg border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <File className="h-7 w-7" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 truncate">{currentFile.name}</p>
                <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-3"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
