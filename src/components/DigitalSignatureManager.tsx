import React, { useState } from 'react';
import { 
  PenTool, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Eye, 
  Download, 
  Check, 
  X, 
  ChevronRight,
  ShieldCheck,
  History,
  User,
  Calendar,
  Lock,
  MoreVertical,
  ArrowLeft,
  FileSignature,
  Maximize2,
  ExternalLink,
  Info,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  BookOpen,
  School
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SigningModal from './SigningModal';

interface SignatureData {
  id: string;
  type: 'personal' | 'organization';
  name: string;
  role: string;
  timestamp: string;
  position: { x: number; y: number };
}

interface SigningDoc {
  id: string;
  title: string;
  type: 'PL1' | 'PL2' | 'PL3' | 'SCHEDULE';
  submitter: string;
  submitDate: string;
  status: 'pending_submission' | 'pending_head' | 'pending_principal' | 'signed' | 'rejected';
  grade?: number;
  subject?: string;
  priority: 'normal' | 'high';
  pages: number;
  size: string;
  signatures?: SignatureData[];
  history: {
    action: string;
    user: string;
    date: string;
    note?: string;
  }[];
}

const MOCK_DOCS: SigningDoc[] = [
  {
    id: 'DOC-2026-001',
    title: 'Kế hoạch Giáo dục Tổ Khối 4 Năm học 2025-2026',
    type: 'PL2',
    submitter: 'Trần Tổ Trưởng',
    submitDate: '2026-03-14 08:30',
    status: 'pending_principal',
    grade: 4,
    priority: 'high',
    pages: 12,
    size: '2.4 MB',
    signatures: [
      {
        id: 'sig-1',
        type: 'personal',
        name: 'Trần Tổ Trưởng',
        role: 'Tổ trưởng chuyên môn',
        timestamp: '2026-03-14 08:30:00',
        position: { x: 70, y: 85 }
      }
    ],
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Trần Tổ Trưởng', date: '2026-03-14 08:00' },
      { action: 'Tổ trưởng đã ký duyệt', user: 'Trần Tổ Trưởng', date: '2026-03-14 08:30', note: 'Hồ sơ đầy đủ, đúng định dạng.' }
    ]
  },
  {
    id: 'DOC-2026-002',
    title: 'Kế hoạch bài dạy môn Tiếng Anh - Khối 5 - Tuần 24',
    type: 'PL3',
    submitter: 'Nguyễn Văn A',
    submitDate: '2026-03-14 14:20',
    status: 'pending_head',
    grade: 5,
    subject: 'Tiếng Anh',
    priority: 'normal',
    pages: 8,
    size: '1.8 MB',
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Nguyễn Văn A', date: '2026-03-14 14:10' },
      { action: 'Trình ký Tổ trưởng', user: 'Nguyễn Văn A', date: '2026-03-14 14:20' }
    ]
  },
  {
    id: 'DOC-2026-003',
    title: 'Kế hoạch Giáo dục Nhà trường 2025-2026',
    type: 'PL1',
    submitter: 'Lê Hiệu Trưởng',
    submitDate: '2026-03-13 10:00',
    status: 'signed',
    priority: 'high',
    pages: 24,
    size: '4.2 MB',
    signatures: [
      {
        id: 'sig-2',
        type: 'organization',
        name: 'Lê Hiệu Trưởng',
        role: 'Hiệu trưởng',
        timestamp: '2026-03-13 10:00:00',
        position: { x: 75, y: 80 }
      }
    ],
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Lê Hiệu Trưởng', date: '2026-03-13 09:00' },
      { action: 'Hiệu trưởng đã ký ban hành', user: 'Lê Hiệu Trưởng', date: '2026-03-13 10:00' }
    ]
  },
  {
    id: 'DOC-2026-004',
    title: 'Kế hoạch bài dạy Tuần 24 - Toán 4 (Tiết 115-120)',
    type: 'PL3',
    submitter: 'Phạm Thị C',
    submitDate: '2026-03-15 07:00',
    status: 'pending_head',
    grade: 4,
    subject: 'Toán học',
    priority: 'normal',
    pages: 5,
    size: '0.9 MB',
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Phạm Thị C', date: '2026-03-15 06:50' },
      { action: 'Trình ký Tổ trưởng', user: 'Phạm Thị C', date: '2026-03-15 07:00' }
    ]
  },
  {
    id: 'DOC-2026-006',
    title: 'Kế hoạch bài dạy môn Mỹ thuật - Khối 3 - Tuần 23',
    type: 'PL3',
    submitter: 'Lý Thị E',
    submitDate: '2026-03-11 15:00',
    status: 'rejected',
    grade: 3,
    subject: 'Mỹ thuật',
    priority: 'normal',
    pages: 6,
    size: '1.2 MB',
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Lý Thị E', date: '2026-03-11 14:30' },
      { action: 'Trình ký Tổ trưởng', user: 'Lý Thị E', date: '2026-03-11 15:00' },
      { action: 'Đã trả lại hồ sơ', user: 'Trần Tổ Trưởng', date: '2026-03-11 16:00', note: 'Thiếu phần đánh giá định kỳ và phân bổ thời lượng chưa hợp lý.' }
    ]
  },
  {
    id: 'DOC-2026-007',
    title: 'Lịch báo giảng Tuần 24 - Nguyễn Văn A',
    type: 'SCHEDULE',
    submitter: 'Nguyễn Văn A',
    submitDate: '2026-03-16 08:00',
    status: 'pending_head',
    grade: 5,
    priority: 'normal',
    pages: 2,
    size: '0.5 MB',
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Nguyễn Văn A', date: '2026-03-16 07:30' },
      { action: 'Trình ký Tổ trưởng', user: 'Nguyễn Văn A', date: '2026-03-16 08:00' }
    ]
  },
  {
    id: 'DOC-2026-008',
    title: 'Lịch báo giảng Tuần 24 - Phạm Thị C',
    type: 'SCHEDULE',
    submitter: 'Phạm Thị C',
    submitDate: '2026-03-16 08:15',
    status: 'signed',
    grade: 4,
    priority: 'normal',
    pages: 2,
    size: '0.5 MB',
    signatures: [
      {
        id: 'sig-3',
        type: 'personal',
        name: 'Trần Tổ Trưởng',
        role: 'Tổ trưởng chuyên môn',
        timestamp: '2026-03-16 09:00:00',
        position: { x: 70, y: 85 }
      }
    ],
    history: [
      { action: 'Khởi tạo hồ sơ', user: 'Phạm Thị C', date: '2026-03-16 07:45' },
      { action: 'Trình ký Tổ trưởng', user: 'Phạm Thị C', date: '2026-03-16 08:15' },
      { action: 'Tổ trưởng đã ký duyệt', user: 'Trần Tổ Trưởng', date: '2026-03-16 09:00' }
    ]
  }
];

const SignatureStamp = ({ sig, isTemp, onConfirm, onCancel, key }: { sig: SignatureData | Partial<SignatureData>, isTemp?: boolean, onConfirm?: () => void, onCancel?: () => void, key?: string }) => {
  if (isTemp) {
    return (
      <div
        className="absolute flex flex-col items-center pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ left: `${sig.position?.x}%`, top: `${sig.position?.y}%` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-2 border-dashed border-indigo-500 bg-indigo-50/80 flex flex-col items-center justify-center w-[240px] h-[100px] backdrop-blur-sm rounded-xl shadow-lg">
          <div className="text-indigo-600 font-bold text-sm flex flex-col items-center gap-2">
            <PenTool className="w-5 h-5 animate-bounce" />
            <span>Vùng ký được chọn</span>
          </div>
        </div>
        
        {/* Action buttons attached to the stamp */}
        <div className="flex items-center gap-2 mt-3 bg-white p-1.5 rounded-xl shadow-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={onCancel}
            className="p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
            title="Hủy vị trí này"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> Xác nhận ký
          </button>
        </div>
      </div>
    );
  }

  const isOrg = sig.type === 'organization';
  return (
    <div
      className="absolute border-2 border-emerald-500 bg-white/90 p-3 rounded-xl shadow-sm flex items-center gap-3 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 backdrop-blur-sm min-w-[240px]"
      style={{ left: `${sig.position?.x}%`, top: `${sig.position?.y}%` }}
    >
      {isOrg && (
        <div className="absolute -left-6 -top-6 w-20 h-20 border-4 border-rose-600 rounded-full flex items-center justify-center opacity-80 rotate-[-15deg] bg-white/50 backdrop-blur-sm mix-blend-multiply">
          <div className="text-rose-600 font-black text-[10px] text-center leading-tight">
            TRƯỜNG<br/>TIỂU HỌC<br/>DEMO
          </div>
        </div>
      )}
      <div className="flex-1 pl-2">
        <div className="flex items-center gap-1.5 text-emerald-600 mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-wider">Ký số hợp lệ</span>
        </div>
        <div className="font-serif italic text-blue-900 text-2xl leading-none mb-2 relative z-10">
          {sig.name}
        </div>
        <div className="space-y-0.5">
          <div className="text-[10px] text-slate-700 font-bold">Ký bởi: <span className="font-medium">{sig.name}</span></div>
          <div className="text-[10px] text-slate-700 font-bold">Chức vụ: <span className="font-medium">{sig.role}</span></div>
          <div className="text-[9px] text-slate-500 mt-1">{sig.timestamp}</div>
        </div>
      </div>
    </div>
  );
};

export default function DigitalSignatureManager({ 
  role,
  filterType = 'all'
}: { 
  role: 'teacher_unassigned' | 'teacher_assigned' | 'head' | 'principal',
  filterType?: 'all' | 'PL1' | 'PL2' | 'PL3' | 'SCHEDULE'
}) {
  const [docs, setDocs] = useState<SigningDoc[]>(MOCK_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<SigningDoc | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'history' | 'info'>('preview');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [isSigningModalOpen, setIsSigningModalOpen] = useState(false);
  const [docToSign, setDocToSign] = useState<SigningDoc | null>(null);
  const [isPlacingSignature, setIsPlacingSignature] = useState(false);
  const [tempSigPosition, setTempSigPosition] = useState<{x: number, y: number} | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{x: number, y: number} | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [docToReject, setDocToReject] = useState<SigningDoc | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const getGroupName = (doc: SigningDoc) => {
    if (doc.type === 'PL1') return 'Nhà trường';
    if (doc.subject) return `Tổ ${doc.subject}`;
    if (doc.grade) return `Khối ${doc.grade}`;
    return 'Khác';
  };

  const availableGroups = Array.from(new Set(
    docs.filter(d => d.type === 'PL1' || d.type === 'PL2').map(getGroupName)
  )).sort();

  const availableTeachers = Array.from(new Set(
    docs.filter(d => d.type === 'PL3' || d.type === 'SCHEDULE').map(d => d.submitter)
  )).sort();

  const filteredDocs = docs.filter(doc => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    if (role === 'head') {
      return matchesStatus && matchesSearch && matchesType && (doc.status === 'pending_head' || doc.status === 'pending_principal' || doc.status === 'signed' || doc.status === 'rejected');
    }
    if (role === 'principal') {
      return matchesStatus && matchesSearch && matchesType && (doc.status === 'pending_principal' || doc.status === 'signed' || doc.status === 'rejected');
    }
    return matchesStatus && matchesSearch && matchesType;
  });

  // Grouping logic
  const groupedDocs = {
    pending_head: filteredDocs.filter(d => d.status === 'pending_head'),
    pending_principal: filteredDocs.filter(d => d.status === 'pending_principal'),
    signed: filteredDocs.filter(d => d.status === 'signed'),
    rejected: filteredDocs.filter(d => d.status === 'rejected'),
  };

  const handleSubmitForSignature = (doc: SigningDoc) => {
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'pending_head' } : d));
  };

  const handleSign = (doc?: SigningDoc) => {
    const targetDoc = doc || selectedDoc;
    if (!targetDoc) return;
    setDocToSign(targetDoc);
    setSelectedDoc(targetDoc);
    setView('detail');
    setIsPlacingSignature(true);
    setTempSigPosition(null);
  };

  const executeSign = () => {
    if (!docToSign || !tempSigPosition) return;
    
    const newSig: SignatureData = {
      id: crypto.randomUUID(),
      type: role === 'principal' ? 'organization' : 'personal',
      name: role === 'principal' ? 'Lê Hiệu Trưởng' : 'Trần Tổ Trưởng',
      role: role === 'principal' ? 'Hiệu trưởng' : 'Tổ trưởng chuyên môn',
      timestamp: new Date().toLocaleString(),
      position: tempSigPosition
    };

    setDocs(prev => prev.map(d => {
      if (d.id === docToSign.id) {
        const newStatus = role === 'head' ? 'pending_principal' : 'signed';
        return {
          ...d,
          status: newStatus,
          signatures: [...(d.signatures || []), newSig],
          history: [
            ...d.history,
            { 
              action: role === 'head' ? 'Tổ trưởng đã ký duyệt' : 'Ban giám hiệu đã ký ban hành', 
              user: role === 'head' ? 'Trần Tổ Trưởng' : 'Lê Hiệu Trưởng', 
              date: new Date().toLocaleString() 
            }
          ]
        };
      }
      return d;
    }));
    
    if (selectedDoc?.id === docToSign.id) {
      setSelectedDoc(prev => prev ? {
        ...prev,
        status: role === 'head' ? 'pending_principal' : 'signed',
        signatures: [...(prev.signatures || []), newSig]
      } : null);
    }
    
    setIsSigningModalOpen(false);
    setIsPlacingSignature(false);
    setTempSigPosition(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setDocToSign(null);
  };

  const handleReject = (doc: SigningDoc) => {
    setDocToReject(doc);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const executeReject = () => {
    if (!docToReject || !rejectReason.trim()) return;
    
    setDocs(prev => prev.map(d => d.id === docToReject.id ? { 
      ...d, 
      status: 'rejected', 
      history: [...d.history, { 
        action: 'Đã trả lại hồ sơ', 
        user: role === 'head' ? 'Trần Tổ Trưởng' : 'Lê Hiệu Trưởng', 
        date: new Date().toLocaleString(), 
        note: rejectReason.trim()
      }] 
    } : d));
    
    if (selectedDoc?.id === docToReject.id) {
      setSelectedDoc(null);
      setView('list');
    }
    
    setIsRejectModalOpen(false);
    setDocToReject(null);
    setRejectReason('');
  };

  const getStatusInfo = (status: string, type?: string) => {
    switch (status) {
      case 'pending_submission': return { label: 'Chờ Tổ trưởng ký', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
      case 'pending_principal': return { label: 'Chờ BGH ký', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: Clock };
      case 'pending_head': return { label: 'Chờ Văn thư ký', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock };
      case 'signed': return { label: 'Đã ban hành', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2 };
      case 'rejected': return { label: 'Đã trả lại', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: AlertCircle };
      default: return { label: 'Không xác định', color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', icon: Clock };
    }
  };

  const renderListView = () => {
    const tabs = filterType === 'PL2' ? [
      { id: 'all', label: 'Tất cả', count: filteredDocs.length, icon: LayoutGrid },
      { id: 'pending_submission', label: 'Chờ Tổ trưởng ký', count: docs.filter(d => d.status === 'pending_submission').length, icon: FileText },
      { id: 'pending_principal', label: 'Chờ BGH ký', count: docs.filter(d => d.status === 'pending_principal').length, icon: FileSignature },
      { id: 'pending_head', label: 'Chờ Văn thư ký', count: docs.filter(d => d.status === 'pending_head').length, icon: Clock },
      { id: 'signed', label: 'Đã ban hành', count: docs.filter(d => d.status === 'signed').length, icon: CheckCircle2 },
      { id: 'rejected', label: 'Đã trả lại', count: docs.filter(d => d.status === 'rejected').length, icon: AlertCircle },
    ] : filterType === 'SCHEDULE' || filterType === 'PL3' ? [
      { id: 'all', label: 'Tất cả', count: filteredDocs.length, icon: LayoutGrid },
      { id: 'pending_submission', label: 'Chờ Tổ trưởng ký', count: docs.filter(d => d.status === 'pending_submission').length, icon: FileText },
      { id: 'pending_principal', label: 'Chờ BGH ký', count: docs.filter(d => d.status === 'pending_principal').length, icon: FileSignature },
      { id: 'pending_head', label: 'Chờ Văn thư ký', count: docs.filter(d => d.status === 'pending_head').length, icon: Clock },
      { id: 'signed', label: 'Đã ban hành', count: docs.filter(d => d.status === 'signed').length, icon: CheckCircle2 },
    ] : [
      { id: 'all', label: 'Tất cả', count: filteredDocs.length, icon: LayoutGrid },
      { id: 'pending_principal', label: 'Chờ BGH ký', count: docs.filter(d => d.status === 'pending_principal').length, icon: FileSignature },
      { id: 'pending_head', label: 'Chờ Văn thư ký', count: docs.filter(d => d.status === 'pending_head').length, icon: Clock },
      { id: 'signed', label: 'Đã ban hành', count: docs.filter(d => d.status === 'signed').length, icon: CheckCircle2 },
    ];

    const currentDocs = (filterStatus === 'all' 
      ? filteredDocs 
      : filteredDocs.filter(d => d.status === filterStatus))
      .filter(d => {
        if (d.type === 'PL1' || d.type === 'PL2') {
          return filterGroup === 'all' || getGroupName(d) === filterGroup;
        }
        if (d.type === 'PL3' || d.type === 'SCHEDULE') {
          return filterTeacher === 'all' || d.submitter === filterTeacher;
        }
        return true;
      });

    const renderDocCard = (doc: SigningDoc) => {
      const s = getStatusInfo(doc.status, doc.type);
      const isPl3OrSchedule = doc.type === 'PL3' || doc.type === 'SCHEDULE';
      const theme = isPl3OrSchedule ? 'emerald' : 'indigo';
      const isIndigo = theme === 'indigo';
      
      return (
        <div 
          key={doc.id}
          className={`bg-white p-5 rounded-2xl border-2 transition-all group flex flex-col md:flex-row items-center gap-6 relative overflow-hidden ${
            isIndigo 
              ? 'border-slate-100 hover:border-indigo-200 hover:shadow-indigo-100/50' 
              : 'border-slate-100 hover:border-emerald-200 hover:shadow-emerald-100/50'
          } shadow-sm hover:shadow-md`}
        >
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isIndigo ? 'bg-indigo-500' : 'bg-emerald-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-1">
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${s.bg} ${s.color} border ${s.border}`}>
                {s.label}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                isIndigo ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {doc.type === 'PL3' ? 'Giáo án' : doc.type === 'SCHEDULE' ? 'Lịch báo giảng' : 'Tổ khối'}
              </span>
            </div>
            <h4 className={`font-bold text-lg leading-tight transition-colors truncate ${
              isIndigo ? 'text-slate-800 group-hover:text-indigo-700' : 'text-slate-800 group-hover:text-emerald-700'
            }`}>
              {doc.title}
            </h4>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-5 gap-y-1 mt-2 text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3" /> <span className="text-slate-600">{doc.submitter}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" /> {doc.submitDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 p-2 bg-slate-100 rounded-2xl border-2 border-slate-200 shadow-inner">
            <button 
              onClick={() => {
                setSelectedDoc(doc);
                setView('detail');
              }}
              className={`px-4 py-2 bg-white text-slate-700 rounded-xl font-black text-xs transition-all border border-slate-300 shadow-sm ${
                isIndigo ? 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200' : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
              }`}
            >
              Chi tiết
            </button>
            
            {((role === 'head' && doc.status === 'pending_head') || 
              (role === 'principal' && doc.status === 'pending_principal')) ? (
              <>
                {(role === 'principal' || (role === 'head' && doc.type === 'PL3')) && (
                  <button 
                    onClick={() => handleReject(doc)}
                    className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-black text-xs hover:bg-rose-100 transition-all border border-rose-200"
                  >
                    Từ chối
                  </button>
                )}
                <button 
                  onClick={() => handleSign(doc)}
                  className={`px-6 py-2 text-white rounded-xl font-black text-xs transition-all shadow-md ${
                    isIndigo ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  Ký duyệt
                </button>
              </>
            ) : doc.status === 'pending_submission' && role === 'teacher_assigned' ? (
              <button 
                onClick={() => handleSubmitForSignature(doc)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-md"
              >
                Trình ký
              </button>
            ) : (
              doc.status === 'pending_principal' && role !== 'principal' ? (
                <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Đang chờ BGH
                </div>
              ) : doc.status === 'pending_head' && role !== 'head' ? (
                <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl font-bold text-xs border border-slate-200 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> Đang chờ Tổ trưởng
                </div>
              ) : null
            )}

            {doc.status === 'signed' && (
              <button className={`p-2 bg-white rounded-xl border transition-all shadow-sm ${
                isIndigo ? 'text-indigo-600 border-indigo-200 hover:bg-indigo-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
              }`}>
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full gap-8 max-w-6xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {filterType === 'PL1' ? 'Kế hoạch trường' : 
               filterType === 'PL2' ? 'Kế hoạch tổ' :
               filterType === 'SCHEDULE' ? 'Lịch báo giảng' :
               filterType === 'PL3' ? 'Kế hoạch bài dạy' : 'Hồ sơ trình duyệt'}
            </h2>
            <p className="text-sm text-slate-400 font-medium">Quản lý và phê duyệt kế hoạch giáo dục điện tử</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium outline-none"
              />
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          {(filterType === 'all' || filterType === 'PL1' || filterType === 'PL2') && (
            <div className="relative flex-1 sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-indigo-400" />
              </div>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm font-medium text-slate-700 appearance-none"
              >
                <option value="all">Tất cả Tổ / Khối</option>
                {availableGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          )}

          {(filterType === 'all' || filterType === 'PL3' || filterType === 'SCHEDULE') && (
            <div className="relative flex-1 sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-emerald-400" />
              </div>
              <select
                value={filterTeacher}
                onChange={(e) => setFilterTeacher(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm font-medium text-slate-700 appearance-none"
              >
                <option value="all">Tất cả Giáo viên</option>
                {availableTeachers.map(teacher => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          )}
        </div>

        {/* Status Tabs Navigation - Colorful & Prominent Style */}
        <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200 shrink-0 overflow-hidden">
          {tabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            const s = getStatusInfo(tab.id);
            
            // Map status info to active styles
            const activeStyles = {
              all: 'bg-slate-100 text-slate-900 ring-slate-200',
              pending_submission: 'bg-amber-50 text-amber-700 ring-amber-200',
              pending_head: 'bg-amber-50 text-amber-700 ring-amber-200',
              pending_principal: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
              signed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
              rejected: 'bg-rose-50 text-rose-700 ring-rose-200'
            }[tab.id] || 'bg-indigo-50 text-indigo-700 ring-indigo-200';

            const iconColors = {
              all: 'text-slate-500',
              pending_submission: 'text-amber-500',
              pending_head: 'text-amber-500',
              pending_principal: 'text-indigo-500',
              signed: 'text-emerald-500',
              rejected: 'text-rose-500'
            }[tab.id] || 'text-indigo-500';

            return (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all relative group whitespace-nowrap ${
                  isActive 
                    ? `${activeStyles} shadow-sm ring-1` 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? iconColors : 'text-slate-400'}`} />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tight md:tracking-wider">
                  {tab.label}
                </span>
                <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[9px] font-black transition-colors ${
                  isActive ? 'bg-rose-600 text-white shadow-sm' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {tab.count}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${
                      {
                        all: 'bg-slate-400',
                        pending_submission: 'bg-amber-500',
                        pending_head: 'bg-amber-500',
                        pending_principal: 'bg-indigo-500',
                        signed: 'bg-emerald-500',
                        rejected: 'bg-rose-500'
                      }[tab.id] || 'bg-indigo-500'
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={filterStatus}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 pb-12"
            >
              {currentDocs.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {currentDocs.map(doc => renderDocCard(doc))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-24 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">Không có hồ sơ nào</h3>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderDetailView = () => {
    if (!selectedDoc) return null;
    const status = getStatusInfo(selectedDoc.status, selectedDoc.type);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        {/* Detail Header */}
        <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setView('list')}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${status.bg} ${status.color} border ${status.border}`}>
                  {status.label}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 truncate">{selectedDoc.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400" title="Tải xuống">
              <Download className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-100 mx-1" />
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[11px] hover:bg-indigo-600 transition-all">
              <ExternalLink className="w-3.5 h-3.5" /> Mở tab mới
            </button>
          </div>
        </div>

        {/* Detail Content Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* PDF Preview Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-12 flex justify-center bg-slate-50/50 relative">
            
            <AnimatePresence>
              {isPlacingSignature && !tempSigPosition && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-20"
                >
                  <PenTool className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">Click vào vị trí bất kỳ trên tài liệu để đặt chữ ký</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              className={`w-full max-w-3xl bg-white shadow-xl rounded-lg aspect-[1/1.414] relative overflow-hidden flex flex-col border border-slate-100 ${isPlacingSignature && !tempSigPosition ? 'cursor-none ring-4 ring-indigo-500/30 ring-offset-4' : ''}`}
              onMouseMove={(e) => {
                if (!isPlacingSignature || tempSigPosition) {
                  setHoverPosition(null);
                  return;
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setHoverPosition({ x, y });
              }}
              onMouseLeave={() => setHoverPosition(null)}
              onClick={(e) => {
                if (!isPlacingSignature || tempSigPosition) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setTempSigPosition({ x, y });
                setHoverPosition(null);
              }}
            >
              <div className="p-16 space-y-8 animate-pulse opacity-40">
                <div className="flex justify-between border-b border-slate-50 pb-8">
                  <div className="space-y-2"><div className="h-3 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div>
                  <div className="space-y-2 text-right"><div className="h-3 w-32 bg-slate-100 rounded" /><div className="h-2 w-20 bg-slate-50 rounded" /></div>
                </div>
                <div className="h-6 w-2/3 bg-slate-100 rounded mx-auto" />
                <div className="space-y-3 pt-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-2 w-full bg-slate-100 rounded" />)}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] rotate-[-35deg] select-none">
                <span className="text-8xl font-black uppercase tracking-[1.5rem]">Document</span>
              </div>

              {/* Render Existing Signatures */}
              {selectedDoc.signatures?.map(sig => (
                <SignatureStamp key={sig.id} sig={sig} />
              ))}

              {/* Ghost Signature (Follows Mouse) */}
              {isPlacingSignature && !tempSigPosition && hoverPosition && (
                <div
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-30 opacity-60 transition-opacity duration-75"
                  style={{ left: `${hoverPosition.x}%`, top: `${hoverPosition.y}%` }}
                >
                  <div className="border-2 border-dashed border-indigo-500 bg-indigo-50/50 flex flex-col items-center justify-center w-[240px] h-[100px] backdrop-blur-sm rounded-xl">
                    <div className="text-indigo-600 font-bold text-sm flex flex-col items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      <span>Click để đặt chữ ký</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render Temporary Signature (Placed) */}
              {isPlacingSignature && tempSigPosition && (
                <SignatureStamp 
                  sig={{
                    type: role === 'principal' ? 'organization' : 'personal',
                    name: role === 'principal' ? 'Lê Hiệu Trưởng' : 'Trần Tổ Trưởng',
                    role: role === 'principal' ? 'Hiệu trưởng' : 'Tổ trưởng chuyên môn',
                    timestamp: 'Đang chờ ký...',
                    position: tempSigPosition
                  }} 
                  isTemp 
                  onConfirm={() => setIsSigningModalOpen(true)}
                  onCancel={() => setTempSigPosition(null)}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar: Meta & History */}
          <div className="w-72 bg-white border-l border-slate-100 flex flex-col shrink-0">
            {isPlacingSignature ? (
              <div className="flex-1 flex flex-col">
                <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <PenTool className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-indigo-900 mb-2">Chế độ ký số</h3>
                  <p className="text-xs text-indigo-700/80 font-medium leading-relaxed">
                    {tempSigPosition 
                      ? 'Bạn đã chọn vị trí ký trên tài liệu. Vui lòng nhấn "Xác nhận ký" tại vị trí đó để tiếp tục.' 
                      : 'Di chuyển chuột vào tài liệu bên trái và click để chọn vị trí đặt chữ ký.'}
                  </p>
                </div>
                
                <div className="p-6 mt-auto border-t border-slate-100 bg-slate-50/50">
                  <button 
                    onClick={() => { setIsPlacingSignature(false); setTempSigPosition(null); setHoverPosition(null); }}
                    className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <X className="w-4 h-4" /> Hủy quá trình ký
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                    {['info', 'history'].map(t => {
                      const isActive = activeTab === t;
                      const Icon = t === 'info' ? Info : History;
                      return (
                        <button 
                          key={t}
                          onClick={() => setActiveTab(t as any)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80 ring-1 ring-black/[0.02]' 
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                          {t === 'info' ? 'Thông tin' : 'Lịch sử'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                  {activeTab === 'info' ? (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          { label: 'Người trình', value: selectedDoc.submitter, icon: User },
                          { label: 'Ngày trình', value: selectedDoc.submitDate, icon: Calendar },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                              <item.icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</p>
                              <p className="text-[11px] font-bold text-slate-700">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                        <p className="text-[10px] text-indigo-600 font-medium leading-relaxed">
                          Hồ sơ được bảo mật bằng chữ ký số SSL 256-bit.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative space-y-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                      {selectedDoc.history.map((h, i) => (
                        <div key={i} className="flex gap-3 relative">
                          <div className={`w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0 z-10 ${i === selectedDoc.history.length - 1 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-slate-700">{h.action}</p>
                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">{h.user} • {h.date}</p>
                            {h.note && <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[10px] text-slate-500 italic">"{h.note}"</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Panel */}
                <div className="p-5 bg-slate-50/50 border-t border-slate-50 space-y-2">
                  {((role === 'head' && selectedDoc.status === 'pending_head') || 
                    (role === 'principal' && selectedDoc.status === 'pending_principal')) ? (
                    <>
                      <button 
                        onClick={() => handleSign()}
                        className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-600 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <PenTool className="w-4 h-4" /> Ký duyệt hồ sơ
                      </button>
                      {(role === 'principal' || (role === 'head' && selectedDoc.type === 'PL3')) && (
                        <button 
                          onClick={() => handleReject(selectedDoc)}
                          className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-600 font-black text-xs rounded-xl hover:bg-rose-100 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" /> Từ chối & Trả lại
                        </button>
                      )}
                    </>
                  ) : (
                    selectedDoc.status === 'pending_principal' && role !== 'principal' ? (
                      <div className="w-full py-3 bg-slate-50 text-slate-500 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" /> Đang chờ BGH ký duyệt
                      </div>
                    ) : selectedDoc.status === 'pending_head' && role !== 'head' ? (
                      <div className="w-full py-3 bg-slate-50 text-slate-500 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" /> Đang chờ Tổ trưởng ký duyệt
                      </div>
                    ) : null
                  )}
                  {selectedDoc.status === 'signed' && (
                    <button className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Tải bản chính thức
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            {renderListView()}
          </motion.div>
        ) : (
          <div className="h-full">
            {renderDetailView()}
          </div>
        )}
      </AnimatePresence>

      {/* Signing Overlay */}
      <AnimatePresence>
        {isSigning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4"
          >
            <div className="bg-white rounded-[3.5rem] p-16 max-w-lg w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-indigo-600"
                />
              </div>
              <div className="w-28 h-28 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-10 relative">
                <PenTool className="w-12 h-12 text-indigo-600 animate-bounce" />
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Đang thực hiện ký số...</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-lg">Hệ thống đang mã hóa dữ liệu và đính kèm chứng thư số bảo mật. Vui lòng giữ kết nối internet ổn định.</p>
              
              <div className="mt-12 flex items-center justify-center gap-4 text-emerald-600 font-black text-sm uppercase tracking-widest">
                <ShieldCheck className="w-6 h-6" /> Kết nối bảo mật SSL 256-bit
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-5 px-10 py-6 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <p className="font-black text-lg leading-none">Ký số thành công!</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">Hồ sơ đã được cập nhật trạng thái mới</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signing Modal */}
      <SigningModal
        isOpen={isSigningModalOpen}
        onClose={() => {
          setIsSigningModalOpen(false);
          setDocToSign(null);
        }}
        onSign={executeSign}
        documentTitle={docToSign?.title || ''}
        userName={role === 'head' ? 'Trần Tổ Trưởng' : 'Lê Hiệu Trưởng'}
      />

      {/* Reject Modal */}
      <AnimatePresence>
        {isRejectModalOpen && docToReject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Từ chối hồ sơ</h3>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{docToReject.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRejectModalOpen(false)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lý do từ chối <span className="text-rose-500">*</span></label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do chi tiết để người trình có thể chỉnh sửa..."
                    className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none transition-all"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsRejectModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={executeReject}
                    disabled={!rejectReason.trim()}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold text-sm rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Xác nhận từ chối
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
