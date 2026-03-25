import React, { useState, useMemo, useEffect } from 'react';
import { 
  RefreshCw, 
  Plus, 
  Save, 
  FileSearch, 
  Check, 
  AlertTriangle, 
  Trash2,
  Copy,
  MapPin,
  Info,
  ChevronDown,
  Sparkles,
  Zap,
  ArrowRight,
  Wrench,
  BookOpen,
  LayoutGrid,
  ChevronLeft,
  Search,
  CheckCircle2,
  Clock,
  PenTool,
  History,
  Lock,
  Eye,
  Users,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SmartEquipmentSelector from './SmartEquipmentSelector';
import { GRADES } from '../constants/grades';

// --- Types & Interfaces ---
interface Subject {
  id: string;
  name: string;
  icon: any;
  ppctStatus: 'signed' | 'unsigned';
  planStatus: 'draft' | 'completed' | 'needs_sync';
  progress: number;
  hasChange: boolean;
  color: string;
  isLocked?: boolean; // Khóa khi bản hợp nhất đã ban hành
  grade?: number; // Thêm grade để hiển thị
  isMerged?: boolean; // Đã được đưa vào file hợp nhất ở Bước 2
  syncFailed?: boolean; // Đánh dấu khi đồng bộ thất bại do chưa có PPCT
}

interface GradeData {
  id: number;
  label: string;
  progress: number;
}

const SUBJECTS_BY_GRADE: Record<number, Subject[]> = {
  5: [
    { id: 'math_5', name: 'Toán học', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-500 to-indigo-600', grade: 5 },
    { id: 'vietnamese_5', name: 'Tiếng Việt', icon: BookOpen, ppctStatus: 'unsigned', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-rose-500 to-orange-500', grade: 5 },
    { id: 'english_5', name: 'Ngoại ngữ (Tiếng Anh)', icon: BookOpen, ppctStatus: 'signed', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-indigo-500 to-purple-600', grade: 5 },
    { id: 'ethics_5', name: 'Đạo đức', icon: CheckCircle2, ppctStatus: 'signed', planStatus: 'draft', progress: 40, hasChange: false, color: 'from-emerald-500 to-teal-600', grade: 5 },
    { id: 'history_geo_5', name: 'Lịch sử - Địa lý', icon: MapPin, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-amber-500 to-orange-600', grade: 5 },
    { id: 'science_5', name: 'Khoa học', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-400 to-cyan-500', grade: 5 },
    { id: 'tech_5', name: 'Công nghệ', icon: Wrench, ppctStatus: 'signed', planStatus: 'draft', progress: 10, hasChange: false, color: 'from-slate-500 to-gray-600', grade: 5 },
    { id: 'it_5', name: 'Tin học', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-cyan-500 to-blue-600', grade: 5 },
    { id: 'pe_5', name: 'Giáo dục thể chất', icon: Zap, ppctStatus: 'signed', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-orange-500 to-red-600', grade: 5 },
    { id: 'music_5', name: 'Âm nhạc', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-pink-500 to-rose-600', grade: 5, isMerged: true },
    { id: 'art_5', name: 'Mĩ thuật', icon: PenTool, ppctStatus: 'signed', planStatus: 'draft', progress: 20, hasChange: false, color: 'from-fuchsia-500 to-purple-600', grade: 5 },
    { id: 'experience_5', name: 'Hoạt động trải nghiệm', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-purple-500 to-indigo-600', grade: 5 },
  ],
  4: [
    { id: 'math_4', name: 'Toán học', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-500 to-indigo-600', grade: 4 },
    { id: 'vietnamese_4', name: 'Tiếng Việt', icon: BookOpen, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-rose-500 to-orange-500', grade: 4, isMerged: true },
    { id: 'english_4', name: 'Ngoại ngữ (Tiếng Anh)', icon: BookOpen, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-indigo-500 to-purple-600', grade: 4 },
    { id: 'ethics_4', name: 'Đạo đức', icon: CheckCircle2, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-emerald-500 to-teal-600', grade: 4, isMerged: true },
    { id: 'history_geo_4', name: 'Lịch sử - Địa lý', icon: MapPin, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-amber-500 to-orange-600', grade: 4 },
    { id: 'science_4', name: 'Khoa học', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-400 to-cyan-500', grade: 4 },
    { id: 'tech_4', name: 'Công nghệ', icon: Wrench, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-slate-500 to-gray-600', grade: 4 },
    { id: 'it_4', name: 'Tin học', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-cyan-500 to-blue-600', grade: 4 },
    { id: 'pe_4', name: 'Giáo dục thể chất', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-orange-500 to-red-600', grade: 4 },
    { id: 'music_4', name: 'Âm nhạc', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-pink-500 to-rose-600', grade: 4 },
    { id: 'art_4', name: 'Mĩ thuật', icon: PenTool, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-fuchsia-500 to-purple-600', grade: 4 },
    { id: 'experience_4', name: 'Hoạt động trải nghiệm', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-purple-500 to-indigo-600', grade: 4 },
  ],
  3: [
    { id: 'math_3', name: 'Toán học', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-500 to-indigo-600', grade: 3 },
    { id: 'vietnamese_3', name: 'Tiếng Việt', icon: BookOpen, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-rose-500 to-orange-500', grade: 3 },
    { id: 'english_3', name: 'Tiếng Anh', icon: BookOpen, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-indigo-500 to-purple-600', grade: 3 },
    { id: 'ethics_3', name: 'Đạo đức', icon: CheckCircle2, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-emerald-500 to-teal-600', grade: 3 },
    { id: 'nature_3', name: 'Tự nhiên xã hội', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-amber-500 to-orange-600', grade: 3 },
    { id: 'music_3', name: 'Âm nhạc', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-pink-500 to-rose-600', grade: 3 },
    { id: 'art_3', name: 'Mĩ thuật', icon: PenTool, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-fuchsia-500 to-purple-600', grade: 3 },
    { id: 'pe_3', name: 'Giáo dục thể chất', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-orange-500 to-red-600', grade: 3 },
    { id: 'it_3', name: 'Tin học', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-cyan-500 to-blue-600', grade: 3 },
    { id: 'tech_3', name: 'Công nghệ', icon: Wrench, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-slate-500 to-gray-600', grade: 3 },
    { id: 'experience_3', name: 'Hoạt động trải nghiệm', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-purple-500 to-indigo-600', grade: 3 },
  ],
  2: [
    { id: 'math_2', name: 'Toán học', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-500 to-indigo-600', grade: 2 },
    { id: 'vietnamese_2', name: 'Tiếng Việt', icon: BookOpen, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-rose-500 to-orange-500', grade: 2 },
    { id: 'ethics_2', name: 'Đạo đức', icon: CheckCircle2, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-emerald-500 to-teal-600', grade: 2 },
    { id: 'nature_2', name: 'Tự nhiên & Xã hội', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-amber-500 to-orange-600', grade: 2 },
    { id: 'experience_2', name: 'Hoạt động trải nghiệm', icon: LayoutGrid, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-purple-500 to-indigo-600', grade: 2 },
    { id: 'english_2', name: 'Tiếng Anh', icon: BookOpen, ppctStatus: 'signed', planStatus: 'draft', progress: 50, hasChange: false, color: 'from-indigo-500 to-purple-600', grade: 2 },
    { id: 'music_2', name: 'Âm nhạc', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-pink-500 to-rose-600', grade: 2 },
    { id: 'art_2', name: 'Mĩ thuật', icon: PenTool, ppctStatus: 'signed', planStatus: 'draft', progress: 20, hasChange: false, color: 'from-fuchsia-500 to-purple-600', grade: 2 },
    { id: 'pe_2', name: 'Giáo dục thể chất', icon: Zap, ppctStatus: 'signed', planStatus: 'draft', progress: 50, hasChange: false, color: 'from-orange-500 to-red-600', grade: 2 },
  ],
  1: [
    { id: 'math_1', name: 'Toán học', icon: Zap, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-blue-500 to-indigo-600', grade: 1 },
    { id: 'vietnamese_1', name: 'Tiếng Việt', icon: BookOpen, ppctStatus: 'signed', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-rose-500 to-orange-500', grade: 1 },
    { id: 'ethics_1', name: 'Đạo đức', icon: CheckCircle2, ppctStatus: 'signed', planStatus: 'draft', progress: 50, hasChange: false, color: 'from-emerald-500 to-teal-600', grade: 1 },
    { id: 'science_1', name: 'Tự nhiên & Xã hội', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-amber-500 to-orange-600', grade: 1 },
    { id: 'english_1', name: 'Tiếng Anh', icon: BookOpen, ppctStatus: 'signed', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-indigo-500 to-purple-600', grade: 1 },
    { id: 'music_1', name: 'Âm nhạc', icon: Sparkles, ppctStatus: 'signed', planStatus: 'completed', progress: 100, hasChange: false, color: 'from-pink-500 to-rose-600', grade: 1 },
    { id: 'art_1', name: 'Mĩ thuật', icon: PenTool, ppctStatus: 'signed', planStatus: 'draft', progress: 20, hasChange: false, color: 'from-fuchsia-500 to-purple-600', grade: 1 },
    { id: 'pe_1', name: 'Giáo dục thể chất', icon: Zap, ppctStatus: 'signed', planStatus: 'needs_sync', progress: 0, hasChange: false, color: 'from-orange-500 to-red-600', grade: 1 },
  ],
};

interface PlanRow {
  id: string;
  week: string;
  topicId: string; // ID để gộp dòng Chủ đề
  topicName: string;
  lessonName: string;
  periods: number;
  adjustmentGroupId: string; // ID để gộp dòng Nội dung điều chỉnh
  adjustments: string;
  equipmentIds: string[];
  locationId: string;
}

// --- Mock Data ---
const MOCK_PLAN_DATA: PlanRow[] = [
  { 
    id: '1', week: '1', topicId: 't1', topicName: 'SỐ TỰ NHIÊN', 
    lessonName: 'Ôn tập các số đến 100 000', periods: 2, 
    adjustmentGroupId: 'g1', adjustments: 'Tích hợp nội dung bảo vệ môi trường thông qua các bài toán thực tế.',
    equipmentIds: ['EQ_001', 'EQ_002'], locationId: 'LOC_001' 
  },
  { 
    id: '2', week: '1', topicId: 't1', topicName: 'SỐ TỰ NHIÊN', 
    lessonName: 'Biểu thức có chứa chữ', periods: 1, 
    adjustmentGroupId: 'g1', adjustments: 'Tích hợp nội dung bảo vệ môi trường thông qua các bài toán thực tế.',
    equipmentIds: ['EQ_001'], locationId: 'LOC_001' 
  },
  { 
    id: '3', week: '1', topicId: 't1', topicName: 'SỐ TỰ NHIÊN', 
    lessonName: 'Các số có sáu chữ số', periods: 3, 
    adjustmentGroupId: 'g1', adjustments: 'Tích hợp nội dung bảo vệ môi trường thông qua các bài toán thực tế.',
    equipmentIds: ['EQ_008'], locationId: 'LOC_001' 
  },
  { 
    id: '4', week: '2', topicId: 't2', topicName: 'BẢNG ĐƠN VỊ ĐO', 
    lessonName: 'Yến, tạ, tấn', periods: 2, 
    adjustmentGroupId: 'g2', adjustments: 'Sử dụng vật thật để học sinh trải nghiệm cân nặng.',
    equipmentIds: ['EQ_007'], locationId: 'LOC_003' 
  },
  { 
    id: '5', week: '2', topicId: 't2', topicName: 'BẢNG ĐƠN VỊ ĐO', 
    lessonName: 'Bảng đơn vị đo khối lượng', periods: 2, 
    adjustmentGroupId: 'g2', adjustments: 'Sử dụng vật thật để học sinh trải nghiệm cân nặng.',
    equipmentIds: ['EQ_007'], locationId: 'LOC_001' 
  },
];

// --- Helper for Rowspan ---
const calculateSpans = (data: PlanRow[], key: keyof PlanRow) => {
  const spans: number[] = [];
  let currentSpan = 0;

  for (let i = 0; i < data.length; i++) {
    if (i > 0 && data[i][key] === data[i - 1][key]) {
      spans.push(0);
      spans[currentSpan]++;
    } else {
      spans.push(1);
      currentSpan = i;
    }
  }
  return spans;
};

// --- Main Component ---
export default function SubjectPlanEditor({ 
  role, 
  subjectGroupSubjects, 
  subjectGroupName, 
  excludeSubjects,
  selectedGrade,
  setSelectedGrade,
  onNextStep
}: { 
  role: 'teacher_unassigned' | 'teacher_assigned' | 'head' | 'principal', 
  subjectGroupSubjects?: string[], 
  subjectGroupName?: string, 
  excludeSubjects?: string[],
  selectedGrade: number,
  setSelectedGrade: (val: number) => void,
  onNextStep?: () => void
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [rows, setRows] = useState<PlanRow[]>(MOCK_PLAN_DATA);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  
  // Modal States
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showBulkAssignModal, setShowBulkAssignModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState<{ type: 'head' | 'principal', subjectId: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showMergeWarning, setShowMergeWarning] = useState<{ subjectId: string } | null>(null);
  const [assignModalSubjectId, setAssignModalSubjectId] = useState<string | null>(null);
  const [assignedTeachers, setAssignedTeachers] = useState<Record<string, string[]>>({});

  const MOCK_TEACHERS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];

  // Spans calculation
  const weekSpans = useMemo(() => calculateSpans(rows, 'week'), [rows]);
  const topicSpans = useMemo(() => calculateSpans(rows, 'topicId'), [rows]);
  const adjSpans = useMemo(() => calculateSpans(rows, 'adjustmentGroupId'), [rows]);

  const selectedSubject = useMemo(() => subjects.find(s => s.id === selectedSubjectId), [selectedSubjectId, subjects]);
  const totalPeriods = useMemo(() => rows.reduce((sum, row) => sum + (Number(row.periods) || 0), 0), [rows]);
  const ppctTotal = 140;

  // Cập nhật danh sách môn
  useEffect(() => {
    let gradeSubjects: Subject[] = [];
    
    if (subjectGroupName) {
      // Nếu là Tổ bộ môn: Lấy tất cả các môn thuộc tổ này ở TẤT CẢ các khối
      const allSubjectsAcrossGrades = Object.values(SUBJECTS_BY_GRADE).flat();
      gradeSubjects = allSubjectsAcrossGrades.filter(s => s && s.name && subjectGroupSubjects?.includes(s.name));
      
      // Loại bỏ trùng lặp nếu có (dựa vào id hoặc name + grade)
      // Trong thực tế, mỗi môn ở mỗi khối sẽ có ID riêng. Ở đây dùng mock data nên có thể bị trùng.
      const uniqueSubjects = Array.from(new Map(gradeSubjects.map(item => [item.id, item])).values());
      gradeSubjects = uniqueSubjects;
    } else {
      // Nếu là Tổ khối: Chỉ lấy các môn của khối hiện tại, và loại trừ các môn của tổ bộ môn
      gradeSubjects = SUBJECTS_BY_GRADE[selectedGrade] || [];
      if (excludeSubjects) {
        gradeSubjects = gradeSubjects.filter(s => s && s.name && !excludeSubjects.includes(s.name));
      }
    }
    
    setSubjects(gradeSubjects);
    setSelectedSubjectId(null);
  }, [selectedGrade, subjectGroupSubjects, excludeSubjects, subjectGroupName]);

  const handleBulkSync = () => {
    setIsBulkSyncing(true);
    setShowBulkModal(false);
    setTimeout(() => {
      setSubjects(prev => prev.map(s => {
        if (s.ppctStatus === 'signed' && s.planStatus === 'needs_sync') {
          return {
            ...s,
            planStatus: 'draft',
            progress: 100,
            hasChange: false
          };
        }
        return s;
      }));
      setIsBulkSyncing(false);
    }, 2000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newRows: PlanRow[] = MOCK_PPCT_SOURCE.map((item, index) => ({
        id: `row-${crypto.randomUUID()}-${index}`,
        week: `Tuần ${Math.floor(index / 2) + 1}`,
        topicId: item.topicId,
        topicName: item.topicName,
        lessonName: item.lessonName,
        periods: item.periods,
        adjustmentGroupId: item.adjustmentGroupId,
        adjustments: '',
        equipmentIds: [],
        locationId: 'LOC_001'
      }));
      setRows(newRows);
      if (selectedSubjectId) {
        setSubjects(prev => prev.map(s => s.id === selectedSubjectId ? { ...s, progress: 100, hasChange: false } : s));
      }
      setIsSyncing(false);
    }, 1000);
  };

  const updateRow = (id: string, field: keyof PlanRow, value: any) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleUpdateStatus = (subjectId: string, newStatus: Subject['planStatus'], extraFields: Partial<Subject> = {}) => {
    const subject = subjects.find(s => s.id === subjectId);
    
    // Nếu đang muốn mở lại soạn thảo (completed -> draft) VÀ môn học đã được merge
    if (newStatus === 'draft' && subject?.planStatus === 'completed' && subject?.isMerged) {
      setShowMergeWarning({ subjectId });
      return;
    }

    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, planStatus: newStatus, ...extraFields } : s));
  };

  const confirmReopen = () => {
    if (showMergeWarning) {
      setSubjects(prev => prev.map(s => s.id === showMergeWarning.subjectId ? { ...s, planStatus: 'draft' } : s));
      setShowMergeWarning(null);
    }
  };

  const handleReject = () => {
    if (!showRejectModal || !rejectReason.trim()) return;
    handleUpdateStatus(showRejectModal.subjectId, 'draft');
    alert(`Đã trả lại hồ sơ với lý do: ${rejectReason}`);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const getStatusBadge = (status: Subject['planStatus']) => {
    switch (status) {
      case 'draft': return <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">Đang soạn thảo</span>;
      case 'completed': return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">Đã hoàn thành</span>;
      case 'needs_sync': return <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase whitespace-nowrap">Cần đồng bộ PPCT</span>;
    }
  };

  const renderGradeOverview = () => {
    const draftSubjects = subjects.filter(s => s.planStatus === 'draft');
    const completedSubjects = subjects.filter(s => s.planStatus === 'completed');
    const syncSubjects = subjects.filter(s => s.planStatus === 'needs_sync');

    const renderSubjectCard = (subject: Subject) => {
      const isCompleted = subject.planStatus === 'completed';
      const isNeedsSync = subject.planStatus === 'needs_sync';
      
      const statusColor = isCompleted 
        ? 'from-blue-500 to-indigo-600' 
        : isNeedsSync
          ? 'from-purple-500 to-indigo-600'
          : 'from-amber-400 to-orange-500';
      
      const StatusIcon = isCompleted ? CheckCircle2 : isNeedsSync ? RefreshCw : Zap;

      return (
        <motion.div 
          key={subject.id}
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group relative"
        >
          <div className={`h-32 bg-gradient-to-br ${statusColor} p-6 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
            <StatusIcon className="w-12 h-12 text-white/40 absolute right-4 bottom-4" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">
                  {subject.name}
                  {subjectGroupName && subject.grade && (
                    <span className="ml-2 text-sm font-bold opacity-80 bg-black/20 px-2 py-0.5 rounded-lg">Khối {subject.grade}</span>
                  )}
                </h3>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-tighter">
                <span className="text-slate-400">Trạng thái</span>
                <span className={subject.planStatus === 'completed' ? "text-emerald-600" : subject.planStatus === 'needs_sync' ? "text-purple-600" : "text-amber-600"}>
                  {subject.planStatus === 'completed' ? 'Đã hoàn thành' : subject.planStatus === 'needs_sync' ? 'Cần đồng bộ PPCT' : 'Đang soạn thảo'}
                </span>
              </div>
              {assignedTeachers[subject.id] && assignedTeachers[subject.id].length > 0 && (
                <div className="flex justify-between text-xs font-bold tracking-tight mt-2">
                  <span className="text-slate-400">Phụ trách:</span>
                  <span className="text-indigo-600">{assignedTeachers[subject.id].join(', ')}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  subject.isLocked 
                    ? 'bg-slate-100 text-slate-400' 
                    : subject.planStatus === 'needs_sync'
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100'
                      : 'bg-slate-900 text-white hover:bg-indigo-600'
                }`}
              >
                {subject.isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : subject.planStatus === 'completed' || (role !== 'head' && role !== 'teacher_assigned') ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : subject.planStatus === 'needs_sync' ? (
                  <RefreshCw className="w-3.5 h-3.5" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                {subject.isLocked 
                  ? 'Đã khóa dữ liệu' 
                  : subject.planStatus === 'completed' || (role !== 'head' && role !== 'teacher_assigned')
                    ? 'Xem chi tiết' 
                    : subject.planStatus === 'needs_sync'
                      ? 'Đồng bộ PPCT'
                      : 'Vào soạn thảo'}
              </button>

              {subject.isLocked && (
                <p className="text-[10px] text-slate-400 font-bold text-center italic">
                  Bản hợp nhất đã ban hành, không thể sửa đổi.
                </p>
              )}

              {subject.hasChange && !subject.isLocked && (
                <div className="flex items-center justify-center gap-1.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> PPCT nguồn đã thay đổi
                </div>
              )}

              {subject.syncFailed && (
                <div className="flex items-center justify-center gap-1.5 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black border border-rose-100">
                  <AlertTriangle className="w-3.5 h-3.5" /> Chưa có PPCT ban hành
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    };

    return (
      <div className="pb-20 space-y-12 relative">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-black text-slate-800 truncate">
              Kế hoạch Giáo dục {subjectGroupName ? `Tổ ${subjectGroupName}` : GRADES.find(g => g.id === selectedGrade)?.label}
            </h2>
            <p className="text-slate-500 mt-1">
              {role === 'teacher_assigned' ? 'Hoàn thiện kế hoạch cá nhân dựa trên PPCT.' : 
               role === 'head' ? 'Thẩm định và ký duyệt kế hoạch chuyên môn của khối.' : 
               'Phê duyệt ban hành kế hoạch giáo dục toàn khối.'}
            </p>
          </div>
          
          {role === 'head' && (
            <div className="flex flex-wrap items-center xl:justify-end gap-3 flex-shrink-0">
              <button 
                onClick={() => setShowBulkAssignModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[1.5rem] font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap"
              >
                <Users className="w-5 h-5 flex-shrink-0" /> Phân công giáo viên
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowBulkModal(true)}
                  disabled={isBulkSyncing}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap"
                >
                  <RefreshCw className={`w-5 h-5 flex-shrink-0 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                  {isBulkSyncing ? 'Đang đồng bộ...' : subjectGroupName ? 'Đồng bộ PPCT toàn tổ' : `Đồng bộ PPCT cả khối ${selectedGrade}`}
                </button>
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  <button className="relative flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full shadow-sm border-2 border-red-200 hover:border-red-600">
                    <Info className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-slate-800 text-white text-xs rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                    <p className="font-bold text-sm mb-2 text-red-400">Lưu ý quan trọng khi đồng bộ:</p>
                    <ul className="list-disc pl-4 space-y-2 text-slate-300 leading-relaxed">
                      <li>Đồng bộ PPCT để điền nhanh các mục: tuần học, chủ đề, tên bài, số tiết. Chỉ cần bổ sung thêm nội dung cần điều chỉnh, thiết bị, hình thức tổ chức.</li>
                      <li>Chỉ đồng bộ được dữ liệu PPCT đối với PPCT nào đã được ban hành. Nếu chưa có, vui lòng vào mục Phân phối chương trình để thực hiện trước.</li>
                    </ul>
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-slate-800 transform rotate-45" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header Divider */}
        <div className="h-0.5 bg-slate-400/50 w-full" />

        {/* Congratulatory Message */}
        {subjects.length > 0 && subjects.every(s => s.planStatus === 'completed') && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-black mb-2">Tuyệt vời! Bạn đã hoàn thành Bước 1</h3>
                <p className="text-emerald-50 font-medium leading-relaxed max-w-2xl">
                  Tất cả các kế hoạch giáo dục môn học đã được hoàn tất. 
                  Bây giờ, bạn đã sẵn sàng chuyển sang <span className="font-black underline decoration-2 underline-offset-4">Bước 2: Hợp nhất kế hoạch {subjectGroupName ? 'tổ' : 'khối'}</span> để kết nối các file này thành một bản kế hoạch tổng thể duy nhất và tiến hành trình ký ban hành.
                </p>
              </div>
              <div className="md:ml-auto">
                <button 
                  onClick={onNextStep}
                  className="px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 whitespace-nowrap hover:bg-emerald-50 transition-colors active:scale-95"
                >
                  Sẵn sàng hợp nhất <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {/* Group: Cần đồng bộ PPCT */}
        {syncSubjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kế hoạch cần đồng bộ PPCT</h3>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-black">{syncSubjects.length} môn</span>
            </div>
            <p className="text-blue-600 text-sm font-medium -mt-4 ml-4.5 italic">
              Các môn học đã có Phân phối chương trình được ban hành nhưng chưa được đồng bộ vào kế hoạch giáo dục.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {syncSubjects.map(renderSubjectCard)}
            </div>
          </div>
        )}

        {/* Divider */}
        {syncSubjects.length > 0 && (draftSubjects.length > 0 || completedSubjects.length > 0) && (
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t-2 border-slate-400/50"></div>
            <div className="mx-4 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50"></div>
            </div>
            <div className="flex-grow border-t-2 border-slate-400/50"></div>
          </div>
        )}

        {/* Group: Đang soạn thảo */}
        {draftSubjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-amber-400 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kế hoạch đang soạn thảo</h3>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black">{draftSubjects.length} môn</span>
            </div>
            <p className="text-blue-600 text-sm font-medium -mt-4 ml-4.5 italic">
              Các môn học đang trong quá trình xây dựng nội dung chi tiết, điều chỉnh và bổ sung thiết bị dạy học.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftSubjects.map(renderSubjectCard)}
            </div>
          </div>
        )}

        {/* Divider */}
        {draftSubjects.length > 0 && completedSubjects.length > 0 && (
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t-2 border-slate-400/50"></div>
            <div className="mx-4 flex-shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50"></div>
            </div>
            <div className="flex-grow border-t-2 border-slate-400/50"></div>
          </div>
        )}

        {/* Group: Đã hoàn thành */}
        {completedSubjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Kế hoạch đã hoàn thành</h3>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">{completedSubjects.length} môn</span>
            </div>
            <p className="text-blue-600 text-sm font-medium -mt-4 ml-4.5 italic">
              Các môn học đã hoàn tất việc soạn thảo nội dung và sẵn sàng để hợp nhất vào kế hoạch giáo dục chung của khối.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedSubjects.map(renderSubjectCard)}
            </div>
          </div>
        )}

        {/* --- Modals --- */}
        <AnimatePresence>
          {/* Bulk Sync Modal */}
          {showBulkModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBulkModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-8 text-center pb-4">
                  <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Xác nhận đồng bộ {subjectGroupName ? 'tổ' : 'khối'}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Hệ thống sẽ quét toàn bộ PPCT Đã ban hành của <span className="font-bold text-indigo-600">{subjectGroupName ? `Tổ ${subjectGroupName}` : `Khối ${selectedGrade}`}</span>. 
                  </p>
                </div>

                <div className="px-8 pb-6 overflow-y-auto flex-1">
                  <div className="space-y-5">
                    {/* Danh sách môn có thể đồng bộ */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <h4 className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Sẵn sàng đồng bộ ({subjects.filter(s => s.ppctStatus === 'signed' && s.planStatus === 'needs_sync').length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subjects.filter(s => s.ppctStatus === 'signed' && s.planStatus === 'needs_sync').map(s => (
                          <span key={s.id} className="px-3 py-1.5 bg-white text-emerald-700 rounded-xl text-xs font-bold shadow-sm border border-emerald-100/50">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Danh sách môn không thể đồng bộ do chưa có PPCT */}
                    {subjects.filter(s => s.ppctStatus === 'unsigned').length > 0 && (
                      <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                        <h4 className="text-sm font-bold text-rose-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> Chưa có PPCT ban hành ({subjects.filter(s => s.ppctStatus === 'unsigned').length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {subjects.filter(s => s.ppctStatus === 'unsigned').map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-white text-rose-700 rounded-xl text-xs font-bold shadow-sm border border-rose-100/50">
                              {s.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-rose-600 mt-3 font-medium">
                          * Các môn này sẽ bị bỏ qua. Vui lòng vào mục Phân phối chương trình để ban hành trước khi đồng bộ.
                        </p>
                      </div>
                    )}

                    {/* Danh sách môn đã có kế hoạch (Bỏ qua) */}
                    {subjects.filter(s => s.ppctStatus === 'signed' && s.planStatus !== 'needs_sync').length > 0 && (
                      <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-600 mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5" /> Đã có kế hoạch ({subjects.filter(s => s.ppctStatus === 'signed' && s.planStatus !== 'needs_sync').length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {subjects.filter(s => s.ppctStatus === 'signed' && s.planStatus !== 'needs_sync').map(s => (
                            <span key={s.id} className="px-3 py-1.5 bg-white text-slate-500 rounded-xl text-xs font-bold shadow-sm border border-slate-200/50">
                              {s.name}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-3 font-medium italic">
                          * Các môn này đã được soạn thảo hoặc hoàn thành, hệ thống sẽ không ghi đè dữ liệu.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
                  <button onClick={() => setShowBulkModal(false)} className="flex-1 py-4 text-slate-600 font-black text-sm hover:bg-slate-200 rounded-2xl transition-all">Hủy bỏ</button>
                  <button onClick={handleBulkSync} className="flex-[2] py-4 bg-indigo-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Bắt đầu đồng bộ</button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowRejectModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Lý do trả lại hồ sơ</h3>
                  <p className="text-slate-500 text-sm mb-6">Vui lòng nhập nội dung góp ý để giáo viên thực hiện chỉnh sửa.</p>
                  <textarea 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all min-h-[120px]"
                    placeholder="Ví dụ: Cần điều chỉnh lại số tiết bài Ôn tập..."
                  />
                </div>
                <div className="p-6 bg-slate-50 flex gap-3">
                  <button onClick={() => setShowRejectModal(null)} className="flex-1 py-4 text-slate-600 font-black text-sm hover:bg-slate-100 rounded-2xl transition-all">Hủy</button>
                  <button 
                    onClick={handleReject}
                    disabled={!rejectReason.trim()}
                    className="flex-[2] py-4 bg-rose-600 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-100 hover:bg-rose-700 transition-all disabled:opacity-50"
                  >
                    Xác nhận trả lại
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderSubjectEditor = () => (
    <div className="flex flex-col min-h-full">
      {/* Main Table Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-indigo-100 shadow-2xl relative">
        <div className={`relative p-6 bg-gradient-to-r ${selectedSubject?.color} text-white overflow-hidden flex-shrink-0 rounded-t-[2.5rem]`}>
          <div className="relative z-10 flex items-center justify-between gap-4 flex-nowrap">
            <div className="flex items-center gap-6 min-w-0 flex-1">
              <button 
                onClick={() => setSelectedSubjectId(null)}
                className="flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl transition-all group font-bold text-sm shrink-0"
                title="Quay lại danh sách"
              >
                <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Quay lại danh sách</span>
              </button>
              
              <div className="h-10 w-px bg-white/20 shrink-0" />

              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
                  {selectedSubject && <selectedSubject.icon className="w-6 h-6 text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <h2 className="text-2xl font-black tracking-tight truncate">{selectedSubject?.name}</h2>
                    <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[10px] font-black rounded-lg uppercase tracking-widest shrink-0">
                      {GRADES.find(g => g.id === selectedGrade)?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedSubject && getStatusBadge(selectedSubject.planStatus)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {role !== 'principal' && selectedSubject?.planStatus === 'needs_sync' && (
                <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-3 px-6 py-3 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50">
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} /> {isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ từ PPCT'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-0 overflow-x-auto custom-scrollbar">
          {selectedSubject?.isMerged && selectedSubject?.planStatus === 'draft' && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2 sticky left-0 right-0 w-full z-30">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <div className="text-sm">
                <span className="font-bold">Lưu ý quan trọng:</span> Môn học này đã được sử dụng trong Kế hoạch chung của tổ (Bước 2). 
                Việc chỉnh sửa nội dung tại đây sẽ yêu cầu <span className="font-bold underline">Hợp nhất lại</span> ở Bước 2 để đồng bộ dữ liệu.
              </div>
            </div>
          )}
          <table className="w-full border-collapse min-w-[1200px]">
            <thead className="bg-slate-50 shadow-sm sticky top-0 z-20">
              <tr className="text-[11px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-300">
                <th className="px-4 py-3 text-center w-16 border-r border-slate-300">Tuần</th>
                <th className="px-6 py-3 text-left w-56 border-r border-slate-300">Chủ đề / Mạch nội dung</th>
                <th className="px-6 py-3 text-left w-[400px] border-r border-slate-300">Tên bài học</th>
                <th className="px-4 py-3 text-center w-16 border-r border-slate-300">Tiết</th>
                <th className="px-6 py-3 text-left w-80 border-r border-slate-300">Nội dung điều chỉnh, bổ sung</th>
                <th className="px-6 py-3 text-left w-64">Thiết bị / Hình thức tổ chức</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {rows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    onMouseEnter={() => setHoveredGroupId(row.topicId)}
                    onMouseLeave={() => setHoveredGroupId(null)}
                    className={`transition-colors duration-150 border-b border-slate-300 ${hoveredGroupId === row.topicId ? 'bg-indigo-50/30' : 'hover:bg-slate-50/40'}`}
                  >
                    {/* Cột Tuần - Rowspan */}
                    {weekSpans[index] > 0 && (
                      <td rowSpan={weekSpans[index]} className="px-3 py-1.5 text-center border-r border-slate-300 align-middle bg-white/50">
                        <span className="inline-block text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200 leading-none">{row.week}</span>
                      </td>
                    )}

                    {/* Cột Chủ đề - Rowspan */}
                    {topicSpans[index] > 0 && (
                      <td rowSpan={topicSpans[index]} className="px-4 py-1.5 border-r border-slate-300 align-middle bg-white/50">
                        <p className="text-[13px] font-black text-slate-800 leading-tight">{row.topicName}</p>
                      </td>
                    )}

                    {/* Cột Tên bài - Dòng đơn */}
                    <td className="px-4 py-1.5 border-r border-slate-300 align-middle">
                      <p className="text-[13px] font-bold text-slate-700 leading-tight">{row.lessonName}</p>
                    </td>

                    {/* Cột Tiết - Dòng đơn */}
                    <td className="px-3 py-1.5 text-center border-r border-slate-300 align-middle">
                      <div className="w-7 h-7 mx-auto bg-white rounded-lg flex items-center justify-center border border-slate-200 shadow-sm">
                        <span className="text-[13px] font-black text-indigo-600 leading-none">{row.periods}</span>
                      </div>
                    </td>

                    {/* Cột Nội dung điều chỉnh - Rowspan */}
                    {adjSpans[index] > 0 && (
                      <td rowSpan={adjSpans[index]} className="px-4 py-1.5 border-r border-slate-300 align-middle group/cell bg-white/50">
                        {role !== 'head' && role !== 'teacher_assigned' ? (
                          <p className="text-[11px] text-slate-500 leading-tight italic">{row.adjustments || 'Không có điều chỉnh'}</p>
                        ) : (
                          <div className="relative">
                            <textarea 
                              className="w-full bg-transparent border-none text-[11px] italic text-slate-600 focus:ring-0 p-0 resize-none overflow-hidden leading-tight" 
                              placeholder="Nhập nội dung điều chỉnh..." 
                              rows={1}
                              value={row.adjustments}
                              onChange={(e) => {
                                updateRow(row.id, 'adjustments', e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                              onFocus={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                              }}
                            />
                            <div className="absolute -right-1 top-0 opacity-0 group-hover/cell:opacity-100 transition-opacity">
                              <Wrench className="w-2.5 h-2.5 text-indigo-400" />
                            </div>
                          </div>
                        )}
                      </td>
                    )}

                    {/* Cột Thiết bị - Dòng đơn */}
                    <td className="px-4 py-1.5 align-middle">
                      <SmartEquipmentSelector 
                        subjectId={selectedSubjectId || 'all'}
                        lessonName={row.lessonName}
                        selectedEquipIds={row.equipmentIds}
                        selectedLocId={row.locationId}
                        readOnly={role !== 'head' && role !== 'teacher_assigned'}
                        onChange={(equipIds, locId) => {
                          setRows(prev => prev.map(r => r.id === row.id ? { ...r, equipmentIds: equipIds, locationId: locId } : r));
                        }}
                      />
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Bar */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] flex-shrink-0 rounded-b-[2.5rem]">
          <div className="flex flex-wrap sm:flex-nowrap gap-2 md:gap-3 w-full sm:w-auto justify-end">
            {role !== 'head' && role !== 'teacher_assigned' ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm italic">
                <Eye className="w-4 h-4" /> Chế độ chỉ xem
              </div>
            ) : selectedSubject?.isLocked ? (
              <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-sm italic">
                <Lock className="w-4 h-4" /> Dữ liệu đã khóa
              </div>
            ) : selectedSubject?.planStatus === 'completed' ? (
              <button 
                onClick={() => handleUpdateStatus(selectedSubjectId!, 'draft')}
                className="px-6 md:px-10 py-2 md:py-3 bg-amber-500 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-amber-600 transition-all shadow-xl shadow-amber-100 whitespace-nowrap flex items-center gap-2"
              >
                <History className="w-4 h-4" /> Mở lại soạn thảo
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleUpdateStatus(selectedSubjectId!, 'draft')}
                  className="px-4 md:px-6 py-2 md:py-3 text-slate-600 font-black text-xs md:text-sm hover:bg-slate-50 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Lưu bản nháp
                </button>
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedSubjectId!, 'completed');
                    setSelectedSubjectId(null);
                  }} 
                  className="px-6 md:px-10 py-2 md:py-3 bg-slate-900 text-white rounded-2xl font-black text-xs md:text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 whitespace-nowrap flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Hoàn thành soạn thảo
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col min-h-full">
      <AnimatePresence mode="wait">
        {selectedSubjectId ? (
          <motion.div 
            key="editor" 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col min-h-full"
          >
            {renderSubjectEditor()}
          </motion.div>
        ) : (
          <motion.div 
            key="overview" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col min-h-full"
          >
            {renderGradeOverview()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Merge Warning Modal */}
      <AnimatePresence>
        {showMergeWarning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 bg-amber-50 border-b border-amber-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-900">Cảnh báo đồng bộ</h3>
                  <p className="text-sm text-amber-700 font-medium">Kế hoạch đã được sử dụng</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  Môn học này đã được đưa vào <span className="font-bold text-slate-900">Kế hoạch chung của tổ (Bước 2)</span>.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nếu bạn mở lại soạn thảo và thay đổi nội dung, dữ liệu giữa Bước 1 và Bước 2 sẽ <span className="font-bold text-rose-600">không đồng nhất</span>.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-600">
                  <span className="font-bold block mb-1">Hành động yêu cầu:</span>
                  Sau khi chỉnh sửa xong, bạn cần thông báo cho Tổ trưởng để thực hiện <span className="font-bold">Hợp nhất lại</span> ở Bước 2.
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowMergeWarning(null)}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={confirmReopen}
                  className="px-5 py-2.5 bg-amber-500 text-white font-bold hover:bg-amber-600 rounded-xl shadow-lg shadow-amber-200 transition-all"
                >
                  Đã hiểu, mở lại soạn thảo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Assign Modal */}
      <AnimatePresence>
        {showBulkAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex flex-col gap-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800">Phân công giáo viên phụ trách</h3>
                  <button 
                    onClick={() => setShowBulkAssignModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start">
                  <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                    Tổ trưởng có thể phân công cho từng giáo viên trong tổ hỗ trợ soạn thảo kế hoạch giáo dục bộ môn, giúp giảm tải khối lượng công việc và đảm bảo tiến độ chung của tổ chuyên môn.
                  </p>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                <div className="space-y-4">
                  {subjects.map(subject => (
                    <div key={subject.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800">{subject.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">Trạng thái: {subject.planStatus === 'completed' ? 'Đã hoàn thành' : 'Đang soạn thảo'}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_TEACHERS.map(teacher => {
                          const isSelected = assignedTeachers[subject.id]?.includes(teacher);
                          return (
                            <button
                              key={teacher}
                              onClick={() => {
                                setAssignedTeachers(prev => {
                                  if (isSelected) {
                                    return { ...prev, [subject.id]: [] };
                                  } else {
                                    return { ...prev, [subject.id]: [teacher] };
                                  }
                                });
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 flex items-center gap-2 ${
                                isSelected 
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105 z-10' 
                                  : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {teacher}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                <button 
                  onClick={() => setShowBulkAssignModal(false)}
                  className="px-6 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setShowBulkAssignModal(false)}
                  className="px-6 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                >
                  Lưu tất cả phân công
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Modal */}
      <AnimatePresence>
        {assignModalSubjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800">Phân công giáo viên</h3>
                  <button 
                    onClick={() => setAssignModalSubjectId(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start">
                  <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                    Tổ trưởng có thể chỉ định một giáo viên phụ trách soạn thảo kế hoạch cho môn học này để đảm bảo chất lượng và tiến độ.
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chọn giáo viên phụ trách:</p>
                <div className="space-y-2">
                  {MOCK_TEACHERS.map(teacher => {
                    const isSelected = assignedTeachers[assignModalSubjectId]?.includes(teacher);
                    return (
                      <label key={teacher} className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                          : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-white border-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                        </div>
                        <input 
                          type="radio" 
                          name={`assign-${assignModalSubjectId}`}
                          checked={isSelected || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedTeachers(prev => ({ ...prev, [assignModalSubjectId]: [teacher] }));
                            }
                          }}
                          className="hidden"
                        />
                        <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>{teacher}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setAssignModalSubjectId(null)}
                  className="px-6 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setAssignModalSubjectId(null)}
                  className="px-6 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                >
                  Lưu phân công
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MOCK_PPCT_SOURCE = [
  { topicId: 't1', topicName: 'Số tự nhiên', lessonName: 'Ôn tập các số đến 100 000', periods: 2, adjustmentGroupId: 'g1' },
  { topicId: 't1', topicName: 'Số tự nhiên', lessonName: 'Biểu thức có chứa chữ', periods: 1, adjustmentGroupId: 'g1' },
  { topicId: 't1', topicName: 'Số tự nhiên', lessonName: 'Các số có sáu chữ số', periods: 3, adjustmentGroupId: 'g1' },
  { topicId: 't1', topicName: 'Số tự nhiên', lessonName: 'Hàng và lớp', periods: 2, adjustmentGroupId: 'g1' },
];
