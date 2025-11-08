import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Hash } from 'lucide-react';

interface ForensicUploadProps {
  onComplete: () => void;
}

export function ForensicUpload({ onComplete }: ForensicUploadProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'preparing' | 'uploading' | 'verifying' | 'complete'>('preparing');
  const [sha256] = useState('a3f5e9d2c1b4e8f7a6d3c2b1e9f8d7c6b5a4e3d2c1b9f8e7d6c5b4a3e2d1c9f8');

  useEffect(() => {
    // Simulate preparation
    const prepTimer = setTimeout(() => {
      setStage('uploading');
    }, 2000);

    return () => clearTimeout(prepTimer);
  }, []);

  useEffect(() => {
    if (stage === 'uploading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('verifying');
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'verifying') {
      const verifyTimer = setTimeout(() => {
        setStage('complete');
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 2000);

      return () => clearTimeout(verifyTimer);
    }
  }, [stage, onComplete]);

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-sm ${
              stage === 'complete' ? 'bg-emerald-500' : 'bg-red-500/80'
            }`}>
              {stage === 'complete' ? (
                <CheckCircle2 className="w-12 h-12" />
              ) : (
                <Upload className="w-12 h-12" />
              )}
            </div>
          </div>
          <h2 className="text-white mb-2">Forensic Upload</h2>
          <p className="text-emerald-100">
            {stage === 'preparing' && 'Preparing PCAP chunk files'}
            {stage === 'uploading' && 'Uploading to dev endpoint'}
            {stage === 'verifying' && 'Verifying SHA-256 checksum'}
            {stage === 'complete' && 'Upload complete'}
          </p>
        </div>

        {/* File Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-emerald-300 mt-1" />
              <div className="flex-1">
                <p className="text-emerald-100">PCAP Chunks</p>
                <p className="text-white">3 files (12.8 MB total)</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white">capture_chunk_001.pcap</p>
                <p className="text-emerald-200">4.2 MB</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white">capture_chunk_002.pcap</p>
                <p className="text-emerald-200">5.1 MB</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white">capture_chunk_003.pcap</p>
                <p className="text-emerald-200">3.5 MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {(stage === 'uploading' || stage === 'verifying') && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-emerald-100">
                {stage === 'uploading' ? 'Upload Progress' : 'Verifying'}
              </span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-3 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {stage === 'uploading' && (
              <p className="text-emerald-100 mt-2">
                Chunked HTTPS POST to dev endpoint
              </p>
            )}
          </div>
        )}

        {/* SHA-256 Verification */}
        {(stage === 'verifying' || stage === 'complete') && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <Hash className="w-5 h-5 text-emerald-300 mt-1" />
              <div className="flex-1">
                <p className="text-emerald-100 mb-1">SHA-256 Checksum</p>
                <p className="text-white font-mono break-all">{sha256}</p>
              </div>
            </div>
            {stage === 'complete' && (
              <div className="flex items-center gap-2 bg-emerald-500/30 rounded-lg p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span className="text-white">Server verification successful</span>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="text-center">
          {stage === 'preparing' && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="text-emerald-100">Preparing files...</span>
            </div>
          )}
          {stage === 'uploading' && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span className="text-emerald-100">Uploading via HTTPS...</span>
            </div>
          )}
          {stage === 'verifying' && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="text-emerald-100">Server verifying checksum...</span>
            </div>
          )}
          {stage === 'complete' && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/30 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <span className="text-white">Token receipt received</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}