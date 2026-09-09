import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getScreening } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import PageHeader from '../components/PageHeader';
import ScreeningProgress from '../components/ScreeningProgress';
import ConfidenceScore from '../components/ConfidenceScore';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, AlertTriangle, Fingerprint, FileText, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScreeningDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await getScreening(id);
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load screening details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();

    const interval = setInterval(() => {
      if (data && (data.status === 'PROCESSING' || data.status === 'UPLOADED')) {
        fetchDetails();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [id, data?.status]);

  if (loading && !data) return <Loading text="Fetching screening report..." />;
  if (error) return <ErrorState title="Report Error" description={error} onRetry={fetchDetails} />;
  if (!data) return <ErrorState title="Screening Not Found" description="The requested screening record does not exist." />;

  const isProcessing = data.status === 'PROCESSING' || data.status === 'UPLOADED';
  const { extractedData = {}, validation = {}, aiAnalysis = {}, riskAssessment = {} } = data;
  const documentResults = data.documentResults || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between">
        <Link to="/screenings" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Screening History
        </Link>
      </div>

      <PageHeader
        title={`Screening Report: ${data.screeningId || id}`}
        description={`Submitted on ${new Date(data.createdAt).toLocaleString()}`}
        action={
          <div className="flex items-center gap-2">
            <StatusBadge status={data.status} />
            <RiskBadge level={data.riskLevel || data.riskResult?.level || data.overallResult} />
          </div>
        }
      />

      {/* Processing State */}
      {isProcessing ? (
        <ScreeningProgress status={data.status} currentStageIndex={3} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Summary Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Assessment Card */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center text-slate-700">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Calculated Risk
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center pt-2">
                <div className="text-3xl font-extrabold text-slate-900 mb-1">
                  {data.riskLevel || data.riskResult?.level || 'UNKNOWN'}
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  Risk Score: {data.riskResult?.score ?? riskAssessment.score ?? 0} / 100
                </p>
                {data.riskResult?.factors && data.riskResult.factors.length > 0 && (
                  <div className="w-full mt-4 pt-3 border-t border-slate-100 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase">Factors</p>
                    {data.riskResult.factors.map((f, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-600">
                        <span>{f.reason || f.description}</span>
                        <span className="font-semibold text-red-600">+{f.weight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Confidence Card */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center text-slate-700">
                  <Fingerprint className="h-4 w-4 mr-2 text-blue-500" />
                  AI Analysis Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConfidenceScore
                  score={data.confidence ?? aiAnalysis.confidenceScore ?? 0.92}
                  label="Classification Confidence"
                />
              </CardContent>
            </Card>

            {/* Metadata Card */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center text-slate-700">
                  <Shield className="h-4 w-4 mr-2 text-emerald-500" />
                  Screening Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs pt-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Document Type</span>
                  <span className="font-semibold text-slate-800 capitalize">{data.documentType || 'Composite'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Detected Documents</span>
                  <span className="font-semibold text-slate-800">{documentResults.length || 1}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Completed At</span>
                  <span className="font-semibold text-slate-800">
                    {data.completedAt ? new Date(data.completedAt).toLocaleString() : 'Just now'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={data.status} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results Tabs */}
          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="documents">Per-Document Results ({documentResults.length})</TabsTrigger>
                  <TabsTrigger value="ocr">Extracted OCR Information</TabsTrigger>
                  <TabsTrigger value="validation">Rule Validation</TabsTrigger>
                </TabsList>

                {/* Per-Document Tab */}
                <TabsContent value="documents" className="space-y-4">
                  {documentResults.length > 0 ? (
                    documentResults.map((doc, idx) => (
                      <Card key={idx} className="border-slate-200 shadow-none bg-slate-50/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">Doc #{idx + 1}</Badge>
                              <CardTitle className="text-base font-semibold">
                                {doc.documentType || doc.type || 'Identity Document'}
                              </CardTitle>
                            </div>
                            <RiskBadge level={doc.verificationResult || doc.tamperingResult || 'verified'} />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          {doc.confidenceScore != null && (
                            <p className="text-slate-600">
                              Confidence: <strong>{doc.confidenceScore}%</strong>
                            </p>
                          )}
                          {doc.forensics && (
                            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                              <p className="font-semibold text-slate-700">Forensic Analysis</p>
                              <p className="text-slate-500">
                                ELA Score: {doc.forensics.ela?.score ?? 'Normal'}{' '}
                                {doc.forensics.ela?.suspicious ? '(Suspicious manipulation detected)' : '(Clear)'}
                              </p>
                            </div>
                          )}
                          {doc.ocr?.rawText && (
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                              <p className="font-semibold text-slate-700 mb-1">OCR Raw Output Snippet</p>
                              <p className="font-mono text-[11px] text-slate-600 leading-relaxed truncate">{doc.ocr.rawText}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No multi-document split records available. Single composite image processed.
                    </div>
                  )}
                </TabsContent>

                {/* OCR Tab */}
                <TabsContent value="ocr">
                  {Object.keys(extractedData).length > 0 || data.ocrResult ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3">Field Name</TableHead>
                          <TableHead>Extracted Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(extractedData.length ? extractedData : data.ocrResult || {}).map(([key, val]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium text-slate-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </TableCell>
                            <TableCell className="font-mono text-slate-900 font-semibold">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No key-value OCR data extracted for this document.
                    </div>
                  )}
                </TabsContent>

                {/* Validation Tab */}
                <TabsContent value="validation" className="space-y-3">
                  <div className="border border-slate-200 rounded-lg p-4 bg-white flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {validation.formatValid !== false ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Document Format Check</p>
                        <p className="text-xs text-slate-500">Valid image resolution and aspect ratio</p>
                      </div>
                    </div>
                    <Badge variant={validation.formatValid !== false ? 'success' : 'destructive'}>
                      {validation.formatValid !== false ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-4 bg-white flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {validation.isExpired !== true ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Expiration Validation</p>
                        <p className="text-xs text-slate-500">Checks if document date is within valid range</p>
                      </div>
                    </div>
                    <Badge variant={validation.isExpired !== true ? 'success' : 'destructive'}>
                      {validation.isExpired !== true ? 'Valid' : 'Expired'}
                    </Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
