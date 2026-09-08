import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getScreening } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import { CheckCircle2, XCircle, AlertTriangle, Fingerprint, Image as ImageIcon, FileText } from 'lucide-react';

const ScreeningDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchDetails();
    
    // Poll if still processing
    const interval = setInterval(() => {
      if (data && (data.status === 'PROCESSING' || data.status === 'UPLOADED')) {
        fetchDetails();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, data?.status]);

  if (loading && !data) return <Loading text="Fetching analysis results..." />;
  if (error) return <div className="text-red-500 p-6 text-center">{error}</div>;
  if (!data) return <div className="text-center p-6 text-slate-500">Screening not found</div>;

  const ResultRow = ({ label, passed, details }) => (
    <div className="flex items-start py-3 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 mr-3">
        {passed ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <div>
        <p className={`text-sm font-medium ${passed ? 'text-slate-800' : 'text-red-700'}`}>{label}</p>
        {details && <p className="text-xs text-slate-500 mt-0.5">{details}</p>}
      </div>
    </div>
  );

  const { extractedData = {}, validation = {}, aiAnalysis = {}, riskAssessment = {} } = data;
  const documentResults = data.documentResults || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Screening Report
            <StatusBadge status={data.status} />
          </h1>
          <p className="text-sm text-slate-500 mt-1">ID: {data._id || data.id} • {new Date(data.createdAt).toLocaleString()}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <RiskBadge level={data.riskLevel} />
        </div>
      </div>

      {(data.status === 'PROCESSING' || data.status === 'UPLOADED') ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
          <Loading text="AI is actively analyzing the documents. Please wait..." />
        </div>
      ) : (
        <>
        {documentResults.length > 0 && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Per-document OCR & forensic report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentResults.map((result, index) => (
                <article key={index} className="rounded-lg border border-slate-200 p-4">
                  <div className="flex justify-between gap-3"><h3 className="font-semibold text-slate-800">{result.documentType}</h3><span className="text-sm font-bold text-indigo-700">{result.confidenceScore}% confidence</span></div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-3">{result.ocr?.rawText || 'No readable text detected.'}</p>
                  <dl className="mt-3 space-y-1 text-sm text-slate-600">
                    <div className="flex justify-between"><dt>ELA</dt><dd>{result.forensics?.ela?.score ?? '—'} {result.forensics?.ela?.suspicious ? '(review)' : '(clear)'}</dd></div>
                    <div className="flex justify-between"><dt>SSIM</dt><dd>{result.forensics?.ssim?.available ? result.forensics.ssim.score : 'Template required'}</dd></div>
                  </dl>
                  {result.forensics?.flags?.length > 0 && <ul className="mt-3 list-disc pl-5 text-xs text-red-600">{result.forensics.flags.map((flag, flagIndex) => <li key={flagIndex}>{flag}</li>)}</ul>}
                </article>
              ))}
            </div>
          </section>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Risk Assessment */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><AlertTriangle className="mr-2 h-5 w-5 text-indigo-500"/> Risk Assessment</h2>
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative h-24 w-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={`${riskAssessment.score > 70 ? 'text-red-500' : riskAssessment.score > 40 ? 'text-yellow-500' : 'text-green-500'}`} strokeWidth="3" strokeDasharray={`${riskAssessment.score || 0}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{riskAssessment.score || 0}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Calculated Risk Level</p>
                <p className="text-2xl font-bold text-slate-900">{data.riskLevel || 'UNKNOWN'}</p>
              </div>
            </div>
            
            {riskAssessment.factors && riskAssessment.factors.length > 0 && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Contributing Factors:</h3>
                <ul className="space-y-2">
                  {riskAssessment.factors.map((f, i) => (
                    <li key={i} className="text-sm text-slate-600 flex justify-between">
                      <span>{f.description}</span>
                      <span className="font-medium text-red-500">+{f.weight} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* AI Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><Fingerprint className="mr-2 h-5 w-5 text-indigo-500"/> AI Analysis Results</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${aiAnalysis.tampered ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-slate-800">Tampering Detection</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${aiAnalysis.tampered ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                    {aiAnalysis.tampered ? 'SUSPICIOUS' : 'AUTHENTIC'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">Confidence: {(aiAnalysis.confidenceScore || 0).toFixed(1)}%</p>
                {aiAnalysis.flags && aiAnalysis.flags.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-xs text-red-600">
                    {aiAnalysis.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                  </ul>
                )}
              </div>

              {aiAnalysis.faceVerified !== undefined && (
                <div className={`p-4 rounded-lg border ${!aiAnalysis.faceVerified ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-800">Face Verification</h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${!aiAnalysis.faceVerified ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                      {aiAnalysis.faceVerified ? 'MATCHED' : 'MISMATCH'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Similarity: {(aiAnalysis.faceSimilarityScore || 0).toFixed(1)}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Validation Checks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><CheckCircle2 className="mr-2 h-5 w-5 text-indigo-500"/> Rule-based Validation</h2>
            <div>
              <ResultRow 
                label="Document Format & Integrity" 
                passed={validation.formatValid !== false} 
              />
              <ResultRow 
                label="Expiry Check" 
                passed={validation.isExpired === false} 
                details={validation.isExpired ? 'Document is expired' : 'Document is valid and active'}
              />
              <ResultRow 
                label="Data Cross-Validation" 
                passed={validation.crossCheckPassed !== false} 
                details="MRZ matches printed text"
              />
            </div>
          </div>

          {/* Extracted Data */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center"><FileText className="mr-2 h-5 w-5 text-indigo-500"/> Extracted Information</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {Object.entries(extractedData).length > 0 ? (
                Object.entries(extractedData).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{value?.toString() || '-'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 col-span-2">No data extracted</p>
              )}
            </div>
          </div>

        </div>
        </>
      )}
    </div>
  );
};

export default ScreeningDetails;
