import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, createScreening } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Shield, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const NewScreening = () => {
  const [compositeImage, setCompositeImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!compositeImage) {
      toast.error('Please upload one image containing the documents to screen');
      return;
    }

    setIsSubmitting(true);
    try {
      const documentIds = [];
      let faceImageId = null;

      const formData = new FormData();
      formData.append('file', compositeImage);
      formData.append('documentType', 'composite');
      const uploadResponse = await uploadDocument(formData);
      documentIds.push(uploadResponse.data.data._id);

      // Create Screening
      const resScreening = await createScreening({ documentIds, faceImageId, documentType: 'composite' });
      toast.success('Screening initiated successfully');
      navigate(`/screening/${resScreening.data.data.screeningId}`);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit screening');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-100">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">New Document Screening</h2>
            <p className="text-sm text-slate-500">Upload documents for AI tampering detection and verification</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">Document image <span className="text-red-500">*</span></h3>
            <FileUpload 
              onFileSelect={setCompositeImage}
              accept="image/jpeg,image/png,image/webp"
              label="Upload one clear image containing all documents (for example, PAN and Aadhaar)"
              preview={true}
            />
            <p className="mt-2 text-xs text-slate-500">The system separates visible documents, identifies likely PAN/Aadhaar cards, and runs OCR plus image-forensics checks on each one.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !compositeImage}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Start Screening
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewScreening;
