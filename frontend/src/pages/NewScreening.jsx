import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDocument, createScreening } from '../services/api';
import FileUpload from '../components/FileUpload';
import PageHeader from '../components/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function NewScreening() {
  const [compositeImage, setCompositeImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!compositeImage) {
      toast.error('Please upload an image containing document(s) to screen');
      return;
    }

    setIsSubmitting(true);
    try {
      const documentIds = [];
      const formData = new FormData();
      formData.append('file', compositeImage);
      formData.append('documentType', 'composite');

      const uploadResponse = await uploadDocument(formData);
      documentIds.push(uploadResponse.data.data._id);

      const resScreening = await createScreening({
        documentIds,
        faceImageId: null,
        documentType: 'composite',
      });

      toast.success('Document screening initiated successfully');
      navigate(`/screening/${resScreening.data.data.screeningId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to initiate screening');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="New Document Screening"
        description="Upload document image(s) for automated AI tampering detection and verification"
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="border-slate-200/80 shadow-md">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Document Upload</CardTitle>
                <CardDescription>
                  Supports JPG, JPEG, PNG or WebP images containing identity cards or documents.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <FileUpload
              file={compositeImage}
              setFile={setCompositeImage}
              label="Select or Drop Document Image"
              acceptTypesText="JPG, JPEG, PNG • Max 10 MB"
            />

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">What happens next?</p>
              <ul className="list-disc list-inside space-y-1 text-slate-500">
                <li>Automated AI document detection separates cards in the image</li>
                <li>OCR extracts text fields (name, document numbers, DOB, expiry dates)</li>
                <li>Error Level Analysis (ELA) and Structural Similarity checks detect tampering</li>
                <li>Comprehensive risk assessment score and report generated</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end border-t border-slate-100 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !compositeImage}
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-6 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Start Screening
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
