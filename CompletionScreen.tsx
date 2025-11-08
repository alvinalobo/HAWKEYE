import { CheckCircle2, FileText, Trash2, Home } from 'lucide-react';
import { Button } from './ui/button';

interface CompletionScreenProps {
  resolved: boolean;
  onReturnHome: () => void;
}

export function CompletionScreen({ resolved, onReturnHome }: CompletionScreenProps) {
  const receiptToken = 'RCP-' + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-20 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-white mb-2">
            {resolved ? 'Threat Resolved' : 'Analysis Complete'}
          </h2>
          <p className="text-emerald-100">
            {resolved 
              ? 'Threat was resolved during live triage' 
              : 'Forensic data uploaded successfully'}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <h3 className="text-white mb-4">Session Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-emerald-100">Session Duration</span>
              <span className="text-white">00:08:42</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-emerald-100">Packets Captured</span>
              <span className="text-white">2,847</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-emerald-100">Threats Detected</span>
              <span className="text-white">1</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <span className="text-emerald-100">Status</span>
              <span className="text-emerald-300">
                {resolved ? 'Resolved Live' : 'Forensic Upload Complete'}
              </span>
            </div>

            {!resolved && (
              <div className="flex justify-between items-center">
                <span className="text-emerald-100">Data Uploaded</span>
                <span className="text-white">12.8 MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Token */}
        {!resolved && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-emerald-300 mt-1" />
              <div className="flex-1">
                <p className="text-emerald-100 mb-1">Token Receipt</p>
                <p className="text-white font-mono">{receiptToken}</p>
              </div>
            </div>
            <p className="text-emerald-100">Receipt stored for audit trail</p>
          </div>
        )}

        {/* Final Report */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-300" />
              <div>
                <p className="text-white">Final Report Generated</p>
                <p className="text-emerald-100">
                  {resolved ? 'Lightweight summary saved' : 'Full forensic report sent'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Local Data Cleanup */}
        {!resolved && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-emerald-300" />
              <div>
                <p className="text-white">Local Data Cleanup</p>
                <p className="text-emerald-100">PCAP files deleted from device</p>
              </div>
            </div>
          </div>
        )}

        {/* Return Home */}
        <Button
          onClick={onReturnHome}
          className="w-full bg-white text-emerald-600 hover:bg-emerald-50 h-12 rounded-xl flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}