import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, createScreening } from '../services/api';
import FileUpload from '../components/FileUpload';
import { Shield, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DOC_TYPES = ['Passport', 'Visa', 'National ID', 'Driving Licence', 'Permit'];

const NewScreening = () => {
  const [docType, setDocType] = useState('Passport');
  const [primaryDoc, setPrimaryDoc] = useState(null);
  const [additionalDoc, setAdditionalDoc] = useState(null);
  const [faceImage, setFaceImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!primaryDoc) {
      toast.error('Primary document is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const documentIds = [];
      let faceImageId = null;

      // Upload Primary Doc
      const fdPrimary = new FormData();
      fdPrimary.append('file', primaryDoc);
      fdPrimary.append('documentType', docType);
      fdPrimary.append('isPrimary', 'true');
      const resPrimary = await uploadDocument(fdPrimary);
      documentIds.push(resPrimary.data.id || resPrimary.data._id);

      // Upload Additional Doc if any
      if (additionalDoc) {
        const fdAdd = new FormData();
        fdAdd.append('file', additionalDoc);
        fdAdd.append('documentType', 'Supporting');
        const resAdd = await uploadDocument(fdAdd);
        documentIds.push(resAdd.data.id || resAdd.data._id);
      }

      // Upload Face Image if any
      if (faceImage) {
        const fdFace = new FormData();
        fdFace.append('file', faceImage);
        fdFace.append('documentType', 'Face Image');
        const resFace = await uploadDocument(fdFace);
        faceImageId = resFace.data.id || resFace.data._id;
      }

      // Create Screening
      const resScreening = await createScreening({ documentIds, faceImageId });
      toast.success('Screening initiated successfully');
      navigate(`/screening/${resScreening.data.id || resScreening.data._id}`);

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
          {/* Step 1: Document Type */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">1. Document Type</h3>
            <div className="w-full sm:w-1/2">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 border bg-white"
              >
                {DOC_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Step 2: Primary Document */}
          <section>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">2. Primary Document <span className="text-red-500">*</span></h3>
            <FileUpload 
              onFileSelect={setPrimaryDoc} 
              accept="image/*,application/pdf"
              label="Upload the main identification document (Image or PDF)"
              preview={true}
            />
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 3: Additional Document */}
            <section>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">3. Supporting Document <span className="text-slate-400 normal-case text-xs">(Optional)</span></h3>
              <FileUpload 
                onFileSelect={setAdditionalDoc} 
                accept="image/*,application/pdf"
                label="Upload back side or supporting doc"
                preview={true}
              />
            </section>

            {/* Step 4: Face Image */}
            <section>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">4. Presented Face <span className="text-slate-400 normal-case text-xs">(Optional)</span></h3>
              <FileUpload 
                onFileSelect={setFaceImage} 
                accept="image/*"
                label="Upload live face image for matching"
                preview={true}
              />
            </section>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !primaryDoc}
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
