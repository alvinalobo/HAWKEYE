import { useState } from 'react';
import { ArrowLeft, ArrowRight, Play, FileText, AlertCircle, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { NetworkRequest } from './InterceptionMode';
import { toast } from 'sonner@2.0.3';

interface RequestEditorProps {
  request: NetworkRequest;
  onForward: (modified: boolean, changes?: ModificationDetails) => void;
  onBack: () => void;
}

export interface ModificationDetails {
  timestamp: string;
  requestId: string;
  originalRequest: string;
  modifiedRequest: string;
  originalResponse: string;
  modifiedResponse: string;
  changes: string[];
  reason: string;
}

export function RequestEditor({ request, onForward, onBack }: RequestEditorProps) {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [requestData, setRequestData] = useState({
    method: request.method,
    url: request.url,
    headers: JSON.stringify({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      'User-Agent': 'NetworkGuardian/1.0'
    }, null, 2),
    body: JSON.stringify({
      userId: '12345',
      action: 'getData',
      timestamp: new Date().toISOString()
    }, null, 2)
  });

  const [originalRequestData] = useState(requestData);

  const [responseData, setResponseData] = useState({
    status: 200,
    headers: JSON.stringify({
      'Content-Type': 'application/json',
      'X-Response-Time': '45ms',
      'Cache-Control': 'no-cache'
    }, null, 2),
    body: JSON.stringify({
      success: true,
      data: {
        id: '12345',
        name: 'Test User',
        email: 'user@example.com',
        role: 'admin'
      },
      timestamp: new Date().toISOString()
    }, null, 2)
  });

  const [originalResponseData] = useState(responseData);
  const [modificationReason, setModificationReason] = useState('');

  const hasRequestChanges = 
    requestData.method !== originalRequestData.method ||
    requestData.url !== originalRequestData.url ||
    requestData.headers !== originalRequestData.headers ||
    requestData.body !== originalRequestData.body;

  const hasResponseChanges =
    responseData.status !== originalResponseData.status ||
    responseData.headers !== originalResponseData.headers ||
    responseData.body !== originalResponseData.body;

  const hasChanges = hasRequestChanges || hasResponseChanges;

  const getChangeSummary = () => {
    const changes: string[] = [];
    if (requestData.method !== originalRequestData.method) {
      changes.push(`Method: ${originalRequestData.method} → ${requestData.method}`);
    }
    if (requestData.url !== originalRequestData.url) {
      changes.push('URL modified');
    }
    if (requestData.headers !== originalRequestData.headers) {
      changes.push('Request headers modified');
    }
    if (requestData.body !== originalRequestData.body) {
      changes.push('Request body modified');
    }
    if (responseData.status !== originalResponseData.status) {
      changes.push(`Status: ${originalResponseData.status} → ${responseData.status}`);
    }
    if (responseData.headers !== originalResponseData.headers) {
      changes.push('Response headers modified');
    }
    if (responseData.body !== originalResponseData.body) {
      changes.push('Response body modified');
    }
    return changes;
  };

  const handleForward = () => {
    if (hasChanges && !modificationReason.trim()) {
      toast.error('Please provide a reason for the modification');
      return;
    }

    if (hasChanges) {
      const modifications: ModificationDetails = {
        timestamp: new Date().toISOString(),
        requestId: request.id,
        originalRequest: JSON.stringify(originalRequestData, null, 2),
        modifiedRequest: JSON.stringify(requestData, null, 2),
        originalResponse: JSON.stringify(originalResponseData, null, 2),
        modifiedResponse: JSON.stringify(responseData, null, 2),
        changes: getChangeSummary(),
        reason: modificationReason
      };
      
      toast.success('Request modified and forwarded');
      onForward(true, modifications);
    } else {
      toast.success('Request forwarded without modifications');
      onForward(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-600 text-white p-6 pt-16">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={onBack}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2 className="text-white">Edit Request</h2>
            <p className="text-emerald-100">{request.host}</p>
          </div>
        </div>

        {/* Request Info */}
        <div className="bg-yellow-500/30 backdrop-blur-sm rounded-xl p-4 mb-4 border-2 border-yellow-400">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-100" />
            <span className="text-white">Request Paused</span>
          </div>
          <p className="text-yellow-100">
            This request has been intercepted. You can modify and forward it, or forward unchanged.
          </p>
        </div>

        {/* Request Details */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-emerald-100">Method</span>
              <span className="text-white">{request.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Protocol</span>
              <span className="text-white">{request.protocol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Size</span>
              <span className="text-white">{request.size}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Time</span>
              <span className="text-white">{request.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Editor Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'request' | 'response')} className="mb-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="request" className="data-[state=active]:bg-white/20 text-white">
              Request
            </TabsTrigger>
            <TabsTrigger value="response" className="data-[state=active]:bg-white/20 text-white">
              Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="request" className="mt-4 space-y-4">
            {/* Method & URL */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Method</label>
              <select
                value={requestData.method}
                onChange={(e) => setRequestData(prev => ({ ...prev, method: e.target.value }))}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>

              <label className="text-white mb-2 block">URL</label>
              <input
                type="text"
                value={requestData.url}
                onChange={(e) => setRequestData(prev => ({ ...prev, url: e.target.value }))}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Headers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Headers (JSON)</label>
              <textarea
                value={requestData.headers}
                onChange={(e) => setRequestData(prev => ({ ...prev, headers: e.target.value }))}
                rows={6}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Body */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Body (JSON)</label>
              <textarea
                value={requestData.body}
                onChange={(e) => setRequestData(prev => ({ ...prev, body: e.target.value }))}
                rows={8}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </TabsContent>

          <TabsContent value="response" className="mt-4 space-y-4">
            {/* Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Status Code</label>
              <input
                type="number"
                value={responseData.status}
                onChange={(e) => setResponseData(prev => ({ ...prev, status: parseInt(e.target.value) }))}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Headers */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Headers (JSON)</label>
              <textarea
                value={responseData.headers}
                onChange={(e) => setResponseData(prev => ({ ...prev, headers: e.target.value }))}
                rows={6}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Body */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <label className="text-white mb-2 block">Body (JSON)</label>
              <textarea
                value={responseData.body}
                onChange={(e) => setResponseData(prev => ({ ...prev, body: e.target.value }))}
                rows={8}
                className="w-full bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Modification Reason */}
        {hasChanges && (
          <div className="bg-blue-500/30 backdrop-blur-sm rounded-xl p-4 mb-4 border-2 border-blue-400">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-100" />
              <span className="text-white">Modification Reason (Required)</span>
            </div>
            <textarea
              value={modificationReason}
              onChange={(e) => setModificationReason(e.target.value)}
              placeholder="Explain why you are modifying this request/response..."
              rows={3}
              className="w-full bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        )}

        {/* Change Summary */}
        {hasChanges && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-300" />
              <span className="text-white">Changes Detected</span>
            </div>
            <div className="space-y-1">
              {getChangeSummary().map((change, idx) => (
                <div key={idx} className="flex items-start gap-2 text-emerald-100">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleForward}
            className={`w-full h-14 rounded-xl ${
              hasChanges
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-white hover:bg-emerald-50 text-emerald-600'
            }`}
            size="lg"
          >
            {hasChanges ? (
              <>
                <Play className="w-5 h-5 mr-2" />
                Forward Modified Request
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Forward Unchanged
              </>
            )}
          </Button>

          <Button
            onClick={onBack}
            variant="outline"
            className="w-full h-12 rounded-xl bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            Cancel - Keep Paused
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-4 bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-400/30">
          <p className="text-red-100 text-center">
            ⚠️ All modifications are logged and timestamped
          </p>
        </div>
      </div>
    </div>
  );
}
