import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Key, Usb, Cloud, CheckCircle2, Loader2, FileSignature, AlertCircle, Smartphone, User } from 'lucide-react';

interface SigningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  documentTitle: string;
  userName: string;
}

type SignStep = 'select_cert' | 'select_provider' | 'enter_account' | 'enter_pin' | 'wait_phone' | 'signing' | 'success' | 'error';
type CertType = 'usb' | 'cloud';
type CloudProvider = 'viettel' | 'vnpt' | 'mobifone' | '';

export default function SigningModal({ isOpen, onClose, onSign, documentTitle, userName }: SigningModalProps) {
  const [step, setStep] = useState<SignStep>('select_cert');
  const [certType, setCertType] = useState<CertType>('usb');
  const [provider, setProvider] = useState<CloudProvider>('');
  const [pin, setPin] = useState('');
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [signingProgress, setSigningProgress] = useState(0);
  const [signingStatus, setSigningStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('select_cert');
      setPin('');
      setAccount('');
      setProvider('');
      setError('');
      setSigningProgress(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (step === 'select_cert') {
      if (certType === 'cloud') {
        setStep('select_provider');
      } else {
        setStep('enter_pin');
      }
    } else if (step === 'select_provider') {
      if (!provider) {
        setError('Vui lòng chọn nhà cung cấp');
        return;
      }
      setError('');
      setStep('enter_account');
    } else if (step === 'enter_account') {
      if (!account) {
        setError('Vui lòng nhập tài khoản');
        return;
      }
      setError('');
      setStep('wait_phone');
      
      // Simulate waiting for phone confirmation
      setTimeout(() => {
        startSigningProcess();
      }, 4000);
    } else if (step === 'enter_pin') {
      if (pin.length < 4) {
        setError('Mã PIN phải có ít nhất 4 ký tự');
        return;
      }
      setError('');
      startSigningProcess();
    }
  };

  const startSigningProcess = () => {
    setStep('signing');
    setSigningProgress(0);
    
    const steps = [
      { progress: 10, status: 'Đang kết nối thiết bị chữ ký số...' },
      { progress: 30, status: 'Đang xác thực chứng thư số...' },
      { progress: 50, status: 'Đang tạo mã băm (hash) tài liệu...' },
      { progress: 70, status: 'Đang ký số tài liệu...' },
      { progress: 90, status: 'Đang đóng dấu thời gian (Timestamp)...' },
      { progress: 100, status: 'Hoàn tất ký số!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSigningProgress(steps[currentStep].progress);
        setSigningStatus(steps[currentStep].status);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStep('success');
          setTimeout(() => {
            onSign();
          }, 1500);
        }, 500);
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Ký số điện tử</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{documentTitle}</p>
              </div>
            </div>
            {step !== 'signing' && step !== 'success' && (
              <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'select_cert' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-700">Chọn phương thức ký số</h4>
                  <p className="text-xs text-slate-500">Vui lòng chọn chứng thư số để thực hiện ký duyệt tài liệu này.</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setCertType('usb')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      certType === 'usb' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${certType === 'usb' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Usb className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h5 className={`text-sm font-bold ${certType === 'usb' ? 'text-indigo-900' : 'text-slate-700'}`}>USB Token (VNPT-CA)</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Chứng thư số: {userName}</p>
                    </div>
                    {certType === 'usb' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>

                  <button
                    onClick={() => setCertType('cloud')}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      certType === 'cloud' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${certType === 'cloud' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h5 className={`text-sm font-bold ${certType === 'cloud' ? 'text-indigo-900' : 'text-slate-700'}`}>Ký số từ xa (Remote Signing)</h5>
                      <p className="text-xs text-slate-500 mt-0.5">Xác thực qua ứng dụng di động</p>
                    </div>
                    {certType === 'cloud' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'select_provider' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-700">Chọn nhà cung cấp</h4>
                  <p className="text-xs text-slate-500">Vui lòng chọn nhà cung cấp dịch vụ ký số từ xa của bạn.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'viettel', name: 'Viettel (Mysign)', desc: 'Tập đoàn Công nghiệp - Viễn thông Quân đội' },
                    { id: 'vnpt', name: 'VNPT (SmartCA)', desc: 'Tập đoàn Bưu chính Viễn thông Việt Nam' },
                    { id: 'mobifone', name: 'Mobifone (Mobisign)', desc: 'Tổng công ty Viễn thông MobiFone' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setProvider(p.id as CloudProvider)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        provider === p.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${provider === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h5 className={`text-sm font-bold ${provider === p.id ? 'text-indigo-900' : 'text-slate-700'}`}>{p.name}</h5>
                        <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                      </div>
                      {provider === p.id && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
                {error && (
                  <p className="text-xs font-medium text-rose-500 mt-2 text-center flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}
              </motion.div>
            )}

            {step === 'enter_account' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Thông tin tài khoản</h4>
                  <p className="text-sm text-slate-500">
                    Nhập tài khoản CCCD hoặc MST đã đăng ký với nhà cung cấp.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Tài khoản (CCCD/MST)</label>
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="Nhập số CCCD hoặc MST..."
                      className="w-full px-4 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNext();
                      }}
                    />
                    {error && (
                      <p className="text-xs font-medium text-rose-500 mt-2 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {error}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'wait_phone' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 space-y-8 text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75" />
                  <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl z-10">
                    <Smartphone className="w-10 h-10 text-indigo-600 animate-bounce" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-slate-800">Xác nhận trên điện thoại</h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                    Hệ thống đã gửi yêu cầu ký số đến ứng dụng trên điện thoại của bạn. Vui lòng mở ứng dụng và xác nhận để tiếp tục.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'enter_pin' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">
                    Nhập mã PIN
                  </h4>
                  <p className="text-sm text-slate-500">
                    Vui lòng nhập mã PIN của USB Token để xác nhận ký số.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="Nhập mã PIN..."
                      className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNext();
                      }}
                    />
                    {error && (
                      <p className="text-xs font-medium text-rose-500 mt-2 text-center flex items-center justify-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {error}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'signing' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 space-y-8 text-center">
                <div className="relative w-24 h-24 mx-auto">
                  <svg className="w-full h-full text-slate-100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
                  </svg>
                  <svg className="w-full h-full text-indigo-600 absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="currentColor" strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * signingProgress) / 100} 
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileSignature className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-800">{signingProgress}%</h4>
                  <p className="text-sm font-medium text-slate-500 animate-pulse">{signingStatus}</p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 space-y-4 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-slate-800">Ký số thành công!</h4>
                <p className="text-sm text-slate-500">Tài liệu đã được ký điện tử hợp lệ.</p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {step !== 'signing' && step !== 'success' && step !== 'wait_phone' && (
            <div className="p-6 pt-0 flex gap-3">
              {step !== 'select_cert' && (
                <button
                  onClick={() => {
                    if (step === 'select_provider') setStep('select_cert');
                    else if (step === 'enter_account') setStep('select_provider');
                    else if (step === 'enter_pin') setStep('select_cert');
                  }}
                  className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Quay lại
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-200"
              >
                {step === 'enter_pin' || step === 'enter_account' ? 'Ký duyệt' : 'Tiếp tục'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
