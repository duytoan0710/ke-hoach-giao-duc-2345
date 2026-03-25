import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  FileText, 
  Users, 
  BookOpen, 
  Monitor,
  Sparkles, 
  CheckCircle2,
  Plus,
  Trash2,
  Calculator,
  Info,
  LayoutGrid,
  Download,
  Printer,
  Eye,
  FileDown,
  Pencil,
  PenTool,
  ShieldCheck,
  Lock,
  History,
  Send,
  Clock,
  RefreshCw,
  AlertTriangle,
  X,
  CheckSquare,
  ChevronUp,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';

// --- Types ---
interface StudentData {
  grade: string;
  classes: number;
  total: number;
  female: number;
  ethnic: number;
  twoSessions: number;
  tatc: number;
  disability: number;
  ratio: number;
}

interface TeacherSummary {
  category: string;
  total: number;
  female: number;
  university: number;
  college: number;
  intermediate: number;
  other: number;
  note: string;
}

interface GeneralDeclaration {
  schoolName: string;
  departmentName: string;
  location: string;
  date: string;
  gradeLevel: string;
  year: string;
  grounds: string[];
  students: StudentData[];
  studentCharacteristics: string;
  teachers: TeacherSummary[];
  teacherCharacteristics: string;
  learningMaterials: string;
  teachingEquipment: string;
  educationalContent: {
    compulsory: string;
    optional: string;
  };
  duration: string;
  headTeacherName: string;
  principalName: string;
  principalTitleType: 'principal' | 'vice-principal';
}

interface MergedSubject {
  id: string;
  name: string;
  progress: number;
  lastUpdated: string;
  author: string;
  status: 'draft' | 'completed' | 'needs_sync';
  grade: string;
  hasUpdates?: boolean;
}

type ConsolidatedStatus = 'draft' | 'pending' | 'issued';

enum BlockType {
  TEXT = 'text',
  HEADING = 'heading',
  IMAGE = 'image',
  TABLE = 'table',
  CHECKLIST = 'checklist',
  SUBJECT_PLAN = 'subject_plan',
  GROUNDS = 'grounds',
  STUDENT_STATS = 'student_stats',
  TEACHER_STATS = 'teacher_stats',
  LEARNING_RESOURCES = 'learning_resources',
  TEACHING_EQUIPMENT = 'teaching_equipment',
  EDUCATIONAL_CONTENT = 'educational_content',
  OTHER_ACTIVITIES = 'other_activities'
}

interface TableHeaderCell {
  text: string;
  rowSpan?: number;
  colSpan?: number;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableColumn {
  id: string;
  header: string;
  width?: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ContentBlock {
  id: string;
  type: BlockType;
  title: string;
  content: any;
  order: number;
}

interface ConsolidatedPlan {
  id: string;
  title: string;
  year: string;
  status: ConsolidatedStatus;
  lastUpdated: string;
  subjects: string[];
  grade: string;
  data?: GeneralDeclaration;
  blocks: ContentBlock[];
  signatureFlow: {
    headSigned: boolean;
    principalSigned: boolean;
    headSignDate?: string;
    principalSignDate?: string;
  };
  currentStep?: number;
}

// --- Constants ---
const AVAILABLE_SUBJECTS: MergedSubject[] = [
  // --- KHỐI 1 ---
  { id: 'math_1', name: 'Toán học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn A', status: 'completed', grade: 'Khối 1' },
  { id: 'vietnamese_1', name: 'Tiếng Việt', progress: 0, lastUpdated: '21/02/2026', author: 'Trần Thị B', status: 'needs_sync', grade: 'Khối 1' },
  { id: 'english_1', name: 'Tiếng Anh', progress: 100, lastUpdated: '20/02/2026', author: 'Giáo viên TA', status: 'completed', grade: 'Khối 1' },
  { id: 'music_1', name: 'Âm nhạc', progress: 100, lastUpdated: '20/02/2026', author: 'Phạm Văn Nhạc', status: 'completed', grade: 'Khối 1' },
  { id: 'art_1', name: 'Mĩ thuật', progress: 20, lastUpdated: '20/02/2026', author: 'Lê Thị Vẽ', status: 'draft', grade: 'Khối 1' },
  { id: 'pe_1', name: 'Giáo dục thể chất', progress: 100, lastUpdated: '20/02/2026', author: 'Trần Văn Thể', status: 'completed', grade: 'Khối 1' },

  // --- KHỐI 2 ---
  { id: 'math_2', name: 'Toán học', progress: 100, lastUpdated: '20/02/2026', author: 'Lê Văn C', status: 'completed', grade: 'Khối 2' },
  { id: 'vietnamese_2', name: 'Tiếng Việt', progress: 100, lastUpdated: '22/02/2026', author: 'Phạm Văn D', status: 'completed', grade: 'Khối 2' },
  { id: 'english_2', name: 'Tiếng Anh', progress: 100, lastUpdated: '20/02/2026', author: 'Giáo viên TA', status: 'completed', grade: 'Khối 2' },
  { id: 'music_2', name: 'Âm nhạc', progress: 100, lastUpdated: '20/02/2026', author: 'Phạm Văn Nhạc', status: 'completed', grade: 'Khối 2' },
  { id: 'art_2', name: 'Mĩ thuật', progress: 20, lastUpdated: '20/02/2026', author: 'Lê Thị Vẽ', status: 'draft', grade: 'Khối 2' },
  { id: 'pe_2', name: 'Giáo dục thể chất', progress: 50, lastUpdated: '20/02/2026', author: 'Trần Văn Thể', status: 'draft', grade: 'Khối 2' },

  // --- KHỐI 3 ---
  { id: 'math_3', name: 'Toán học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn E', status: 'completed', grade: 'Khối 3' },
  { id: 'vietnamese_3', name: 'Tiếng Việt', progress: 100, lastUpdated: '20/02/2026', author: 'Trần Thị F', status: 'completed', grade: 'Khối 3' },
  { id: 'english_3', name: 'Tiếng Anh', progress: 100, lastUpdated: '20/02/2026', author: 'Giáo viên TA', status: 'completed', grade: 'Khối 3' },
  { id: 'music_3', name: 'Âm nhạc', progress: 100, lastUpdated: '20/02/2026', author: 'Phạm Văn Nhạc', status: 'completed', grade: 'Khối 3' },
  { id: 'art_3', name: 'Mĩ thuật', progress: 20, lastUpdated: '20/02/2026', author: 'Lê Thị Vẽ', status: 'draft', grade: 'Khối 3' },
  { id: 'pe_3', name: 'Giáo dục thể chất', progress: 50, lastUpdated: '20/02/2026', author: 'Trần Văn Thể', status: 'draft', grade: 'Khối 3' },
  { id: 'it_3', name: 'Tin học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn Tin', status: 'completed', grade: 'Khối 3' },
  { id: 'tech_3', name: 'Công nghệ', progress: 100, lastUpdated: '20/02/2026', author: 'Lê Văn Công', status: 'completed', grade: 'Khối 3' },

  // --- KHỐI 4 (Đã hoàn thành hết) ---
  { id: 'math_4', name: 'Toán học', progress: 100, lastUpdated: '15/02/2026', author: 'Hoàng Thị E', status: 'completed', grade: 'Khối 4' },
  { id: 'vietnamese_4', name: 'Tiếng Việt', progress: 100, lastUpdated: '02/03/2026', author: 'Ngô Văn F', status: 'completed', grade: 'Khối 4' },
  { id: 'ethics_4', name: 'Đạo đức', progress: 100, lastUpdated: '02/03/2026', author: 'Lý Văn G', status: 'completed', grade: 'Khối 4' },
  { id: 'science_4', name: 'Khoa học', progress: 100, lastUpdated: '22/02/2026', author: 'Vũ Thị H', status: 'completed', grade: 'Khối 4' },
  { id: 'english_4', name: 'Tiếng Anh', progress: 100, lastUpdated: '20/02/2026', author: 'Giáo viên TA', status: 'completed', grade: 'Khối 4' },
  { id: 'music_4', name: 'Âm nhạc', progress: 100, lastUpdated: '20/02/2026', author: 'Phạm Văn Nhạc', status: 'completed', grade: 'Khối 4' },
  { id: 'art_4', name: 'Mĩ thuật', progress: 100, lastUpdated: '20/02/2026', author: 'Lê Thị Vẽ', status: 'completed', grade: 'Khối 4' },
  { id: 'pe_4', name: 'Giáo dục thể chất', progress: 100, lastUpdated: '20/02/2026', author: 'Trần Văn Thể', status: 'completed', grade: 'Khối 4' },
  { id: 'it_4', name: 'Tin học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn Tin', status: 'completed', grade: 'Khối 4' },
  { id: 'tech_4', name: 'Công nghệ', progress: 100, lastUpdated: '20/02/2026', author: 'Lê Văn Công', status: 'completed', grade: 'Khối 4' },

  // --- KHỐI 5 ---
  { id: 'math_5', name: 'Toán học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn I', status: 'completed', grade: 'Khối 5' },
  { id: 'vietnamese_5', name: 'Tiếng Việt', progress: 0, lastUpdated: '20/02/2026', author: 'Trần Thị K', status: 'draft', grade: 'Khối 5' },
  { id: 'english_5', name: 'Tiếng Anh', progress: 100, lastUpdated: '20/02/2026', author: 'Giáo viên TA', status: 'completed', grade: 'Khối 5' },
  { id: 'music_5', name: 'Âm nhạc', progress: 100, lastUpdated: '20/02/2026', author: 'Phạm Văn Nhạc', status: 'completed', grade: 'Khối 5' },
  { id: 'art_5', name: 'Mĩ thuật', progress: 20, lastUpdated: '20/02/2026', author: 'Lê Thị Vẽ', status: 'draft', grade: 'Khối 5' },
  { id: 'pe_5', name: 'Giáo dục thể chất', progress: 50, lastUpdated: '20/02/2026', author: 'Trần Văn Thể', status: 'draft', grade: 'Khối 5' },
  { id: 'it_5', name: 'Tin học', progress: 100, lastUpdated: '20/02/2026', author: 'Nguyễn Văn Tin', status: 'completed', grade: 'Khối 5' },
  { id: 'tech_5', name: 'Công nghệ', progress: 10, lastUpdated: '20/02/2026', author: 'Lê Văn Công', status: 'draft', grade: 'Khối 5' },
];

const MOCK_FULL_DATA_GRADE_4: GeneralDeclaration = {
  schoolName: 'Trường Tiểu học Demo',
  departmentName: 'Tổ Khối 4',
  location: 'TP. Hồ Chí Minh',
  date: '20/08/2025',
  gradeLevel: 'Khối 4',
  year: '2025-2026',
  grounds: [
    'Căn cứ Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ GDĐT ban hành Chương trình GDPT;',
    'Căn cứ Công văn số 2345/BGDĐT-GDTH ngày 07/6/2021 của Bộ GDĐT về việc Hướng dẫn xây dựng kế hoạch giáo dục của nhà trường cấp tiểu học;',
    'Căn cứ Kế hoạch giáo dục nhà trường năm học 2025-2026.'
  ],
  students: [
    { grade: '4A', classes: 1, total: 35, female: 18, ethnic: 0, twoSessions: 35, tatc: 35, disability: 1, ratio: 35 },
    { grade: '4B', classes: 1, total: 34, female: 16, ethnic: 1, twoSessions: 34, tatc: 34, disability: 0, ratio: 34 },
    { grade: '4C', classes: 1, total: 36, female: 19, ethnic: 0, twoSessions: 36, tatc: 36, disability: 0, ratio: 36 },
  ],
  studentCharacteristics: 'Học sinh ngoan, lễ phép, tích cực tham gia các hoạt động. Đa số học sinh có ý thức học tập tốt. Tuy nhiên, một số em còn rụt rè trong giao tiếp.',
  teachers: [
    { category: 'Giáo viên dạy nhiều môn', total: 3, female: 3, university: 3, college: 0, intermediate: 0, other: 0, note: 'Đạt chuẩn' },
    { category: 'Giáo viên bộ môn', total: 4, female: 2, university: 4, college: 0, intermediate: 0, other: 0, note: 'Đạt chuẩn' },
  ],
  teacherCharacteristics: 'Đội ngũ giáo viên nhiệt tình, có trách nhiệm, trình độ chuyên môn vững vàng. 100% giáo viên đạt chuẩn trình độ đào tạo.',
  learningMaterials: 'Sách giáo khoa, sách giáo viên, thiết bị dạy học tối thiểu theo quy định.',
  teachingEquipment: 'Máy chiếu, tivi, bảng tương tác, bộ đồ dùng dạy học các môn.',
  educationalContent: {
    compulsory: 'Tiếng Việt, Toán, Đạo đức, Khoa học, Lịch sử và Địa lí, HĐTN, Tin học và Công nghệ, Giáo dục thể chất, Nghệ thuật (Âm nhạc, Mĩ thuật).',
    optional: 'Tiếng Anh tăng cường, Kỹ năng sống.',
  },
  duration: 'Tổ chức dạy học 2 buổi/ngày, mỗi ngày không quá 7 tiết, mỗi tiết 35 phút.',
  headTeacherName: 'Nguyễn Thị Tổ Trưởng',
  principalName: 'Trần Văn Hiệu Trưởng',
  principalTitleType: 'principal',
};

const MOCK_CONSOLIDATED_PLANS: ConsolidatedPlan[] = [
  { 
    id: 'cp4', 
    title: 'Kế hoạch Giáo dục Tổ khối 4', 
    year: '2025-2026', 
    status: 'draft', 
    lastUpdated: '01/03/2026',
    subjects: ['math4', 'viet4', 'ethics4', 'english4'],
    grade: '4',
    data: MOCK_FULL_DATA_GRADE_4,
    blocks: [
      { id: 'b1', type: BlockType.TEXT, title: 'I. Căn cứ xây dựng kế hoạch', content: { html: '<p>Căn cứ Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ trưởng Bộ Giáo dục và Đào tạo ban hành Chương trình giáo dục phổ thông...</p>' }, order: 1 },
      { id: 'b2', type: BlockType.TABLE, title: 'II. Đặc điểm tình hình', content: { 
        columns: [
          { id: 'c1', header: 'Lớp', width: '100px' },
          { id: 'c2', header: 'Số học sinh', width: '150px' },
          { id: 'c3', header: 'Ghi chú' }
        ],
        rows: [
          { c1: '4A', c2: '35', c3: 'Ổn định' },
          { c1: '4B', c2: '34', c3: 'Khá' }
        ]
      }, order: 2 },
      { id: 'b3', type: BlockType.SUBJECT_PLAN, title: 'III. Kế hoạch dạy học các môn học', content: { subjectIds: ['math4', 'viet4'] }, order: 3 }
    ],
    signatureFlow: {
      headSigned: false,
      principalSigned: false
    }
  }
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const defaultAcademicYear = currentMonth < 7 ? `${currentYear - 1} - ${currentYear}` : `${currentYear} - ${currentYear + 1}`;

const INITIAL_DATA: GeneralDeclaration = {
  schoolName: '',
  departmentName: '',
  location: '',
  date: '',
  gradeLevel: '',
  year: defaultAcademicYear,
  grounds: [
    'Căn cứ Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ GDĐT ban hành Chương trình GDPT;',
    'Căn cứ Công văn số 2345/BGDĐT-GDTH ngày 07/6/2021 của Bộ GDĐT về việc Hướng dẫn xây dựng kế hoạch giáo dục của nhà trường cấp tiểu học;',
    `Căn cứ Kế hoạch giáo dục nhà trường năm học ${defaultAcademicYear}.`
  ],
  students: [
    { grade: '', classes: 0, total: 0, female: 0, ethnic: 0, twoSessions: 0, tatc: 0, disability: 0, ratio: 0 },
  ],
  studentCharacteristics: '',
  teachers: [
    { category: 'Giáo viên dạy nhiều môn', total: 0, female: 0, university: 0, college: 0, intermediate: 0, other: 0, note: '' },
    { category: 'Giáo viên bộ môn', total: 0, female: 0, university: 0, college: 0, intermediate: 0, other: 0, note: '' },
  ],
  teacherCharacteristics: '',
  learningMaterials: '',
  teachingEquipment: '',
  educationalContent: {
    compulsory: '',
    optional: '',
  },
  duration: '',
  headTeacherName: '',
  principalName: '',
  principalTitleType: 'principal',
};

export default function MasterPlanMerger({ 
  role = 'head',
  subjectGroupSubjects, 
  subjectGroupName, 
  excludeSubjects,
  selectedGrade
}: { 
  role?: 'teacher_unassigned' | 'teacher_assigned' | 'head' | 'principal',
  subjectGroupSubjects?: string[], 
  subjectGroupName?: string, 
  excludeSubjects?: string[],
  selectedGrade?: number
}) {
  const [view, setView] = useState<'list' | 'editor'>('list');
  // Only show mock data for Grade Group (when subjectGroupName is not provided)
  const [consolidatedPlans, setConsolidatedPlans] = useState<ConsolidatedPlan[]>(
    subjectGroupName ? [] : MOCK_CONSOLIDATED_PLANS
  );
  const [activePlan, setActivePlan] = useState<ConsolidatedPlan | null>(null);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<GeneralDeclaration>(INITIAL_DATA);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [signatureFlow, setSignatureFlow] = useState({
    headSigned: false,
    principalSigned: false
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignedMergers, setAssignedMergers] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const addBlock = (type: BlockType, level?: number) => {
    const newBlock: ContentBlock = {
      id: `b-${crypto.randomUUID()}`,
      type,
      title: 
        type === BlockType.TEXT ? 'Mục mới' : 
        type === BlockType.HEADING ? 'Tiêu đề mới' :
        type === BlockType.IMAGE ? 'Hình ảnh mới' :
        type === BlockType.TABLE ? 'Bảng mới' : 
        type === BlockType.CHECKLIST ? 'Danh mục mới' : 
        type === BlockType.SUBJECT_PLAN ? 'Kế hoạch môn học' :
        type === BlockType.GROUNDS ? 'I. Căn cứ xây dựng kế hoạch' :
        type === BlockType.STUDENT_STATS ? '1. Thống kê học sinh' :
        type === BlockType.TEACHER_STATS ? '2. Tình hình đội ngũ giáo viên' :
        type === BlockType.LEARNING_RESOURCES ? '3. Nguồn học liệu' :
        type === BlockType.EDUCATIONAL_CONTENT ? '5. Nội dung thực hiện chương trình' : 'Khối mới',
      content: 
        type === BlockType.TEXT ? { html: '' } : 
        type === BlockType.HEADING ? { level: level || 1, text: '' } :
        type === BlockType.IMAGE ? { url: '', caption: '' } :
        type === BlockType.TABLE ? { columns: [{ id: 'c1', header: 'Cột 1' }], rows: [] } : 
        type === BlockType.CHECKLIST ? { items: [
          { id: `i-${crypto.randomUUID()}-1`, label: '', checked: false },
          { id: `i-${crypto.randomUUID()}-2`, label: '', checked: false },
          { id: `i-${crypto.randomUUID()}-3`, label: '', checked: false }
        ] } : 
        type === BlockType.SUBJECT_PLAN ? { subjectIds: [] } :
        type === BlockType.GROUNDS ? { grounds: data.grounds } :
        type === BlockType.STUDENT_STATS ? { students: data.students, characteristics: data.studentCharacteristics } :
        type === BlockType.TEACHER_STATS ? { teachers: data.teachers, characteristics: data.teacherCharacteristics } :
        type === BlockType.LEARNING_RESOURCES ? { text: data.learningMaterials, equipment: data.teachingEquipment } :
        type === BlockType.EDUCATIONAL_CONTENT ? { compulsory: data.educationalContent.compulsory, optional: data.educationalContent.optional, duration: data.duration } : {},
      order: blocks.length + 1
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const MOCK_TEACHERS = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];
  const [availableSubjects, setAvailableSubjects] = useState<MergedSubject[]>(AVAILABLE_SUBJECTS);

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpTarget, setOtpTarget] = useState<'head' | 'principal' | null>(null);

  const handleSign = (target: 'head' | 'principal') => {
    setOtpTarget(target);
    setShowOtpModal(true);
  };

  const verifyOtp = () => {
    if (otpValue === '123456') { // Mock OTP
      setSignatureFlow(prev => ({
        ...prev,
        [otpTarget === 'head' ? 'headSigned' : 'principalSigned']: true,
        [otpTarget === 'head' ? 'headSignDate' : 'principalSignDate']: new Date().toLocaleDateString('vi-VN')
      }));
      setShowOtpModal(false);
      setOtpValue('');
      setOtpTarget(null);
    } else {
      alert('Mã OTP không chính xác. Vui lòng thử lại (Gợi ý: 123456)');
    }
  };

  // Filter available subjects based on subjectGroupSubjects or excludeSubjects if provided
  const filteredAvailableSubjects = useMemo(() => {
    let base = availableSubjects;
    
    // If we have a selectedGrade, filter by it first (only for grade plans)
    if (selectedGrade && !subjectGroupName) {
      const gradeLabel = `Khối ${selectedGrade}`;
      base = base.filter(s => s.grade === gradeLabel);
    }

    if (subjectGroupSubjects) {
      // s.name is like "Tiếng Anh 4", "Toán học 1". We check if it starts with any of the subjectGroupSubjects
      return base.filter(s => subjectGroupSubjects.some(sub => s.name.startsWith(sub)));
    }
    if (excludeSubjects) {
      return base.filter(s => !excludeSubjects.some(sub => s.name.startsWith(sub)));
    }
    return base;
  }, [subjectGroupSubjects, excludeSubjects, selectedGrade, subjectGroupName, availableSubjects]);

  const handleUpdateSubject = (subjectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePlan && activePlan.status !== 'draft') {
      alert('Kế hoạch đã được trình ký hoặc ban hành, không thể cập nhật!');
      return;
    }
    
    setAvailableSubjects(prev => prev.map(s => 
      s.id === subjectId ? { ...s, hasUpdates: false, lastUpdated: new Date().toLocaleDateString('vi-VN') } : s
    ));
    alert('Đã cập nhật dữ liệu mới nhất từ bản soạn thảo!');
  };

  const handleSaveDraft = () => {
    // If it's already submitted or issued, we don't overwrite it as a draft unless specifically intended
    // But for "Back to List", we should ensure we don't lose unsaved changes if it was a draft.
    if (activePlan?.status === 'pending' || activePlan?.status === 'issued') {
      return;
    }

    const draftPlan: ConsolidatedPlan = {
      id: activePlan?.id || `cp-${crypto.randomUUID()}`,
      title: activePlan?.title || `Kế hoạch Giáo dục Tổ ${subjectGroupName || data.gradeLevel}`,
      year: data.year || '2025-2026',
      status: 'draft',
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
      subjects: selectedSubjectIds,
      grade: String(selectedGrade || data.gradeLevel.replace('Khối ', '')),
      blocks: blocks,
      signatureFlow: activePlan?.signatureFlow || {
        headSigned: false,
        principalSigned: false
      },
      data: data,
      currentStep: step
    };

    if (activePlan) {
      setConsolidatedPlans(prev => prev.map(p => p.id === activePlan.id ? draftPlan : p));
    } else {
      setConsolidatedPlans(prev => [draftPlan, ...prev]);
    }
    setActivePlan(draftPlan);
  };

  const handleCompleteAndSubmit = () => {
    // If already submitted, just close
    if (activePlan?.status === 'pending' || activePlan?.status === 'issued') {
      setView('list');
      return;
    }

    const newPlan: ConsolidatedPlan = {
      id: activePlan?.id || `cp-${crypto.randomUUID()}`,
      title: activePlan?.title || `Kế hoạch Giáo dục Tổ ${subjectGroupName || data.gradeLevel}`,
      year: data.year || '2025-2026',
      status: 'pending',
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
      subjects: selectedSubjectIds,
      grade: String(selectedGrade || data.gradeLevel.replace('Khối ', '')),
      blocks: blocks,
      signatureFlow: activePlan?.signatureFlow || {
        headSigned: false,
        principalSigned: false
      },
      data: data,
      currentStep: 5
    };

    if (activePlan) {
      setConsolidatedPlans(prev => prev.map(p => p.id === activePlan.id ? newPlan : p));
    } else {
      setConsolidatedPlans(prev => [newPlan, ...prev]);
    }

    setActivePlan(newPlan);
    alert('🎉 Chúc mừng! Hồ sơ đã được trình ký thành công và chuyển sang trạng thái "Chờ phê duyệt".');
  };

  // --- Calculations ---
  const studentTotals = useMemo(() => {
    return data.students.reduce((acc, curr) => ({
      classes: acc.classes + curr.classes,
      total: acc.total + curr.total,
      female: acc.female + curr.female,
      ethnic: acc.ethnic + curr.ethnic,
      twoSessions: acc.twoSessions + curr.twoSessions,
      tatc: acc.tatc + curr.tatc,
      disability: acc.disability + curr.disability,
      ratio: acc.ratio + curr.ratio,
    }), { classes: 0, total: 0, female: 0, ethnic: 0, twoSessions: 0, tatc: 0, disability: 0, ratio: 0 });
  }, [data.students]);

  const teacherTotals = useMemo(() => {
    return data.teachers.reduce((acc, curr) => ({
      total: acc.total + curr.total,
      female: acc.female + curr.female,
      university: acc.university + curr.university,
      college: acc.college + curr.college,
      intermediate: acc.intermediate + curr.intermediate,
      other: acc.other + curr.other,
    }), { total: 0, female: 0, university: 0, college: 0, intermediate: 0, other: 0 });
  }, [data.teachers]);

  // --- Handlers ---
  const updateStudent = (index: number, field: keyof StudentData, value: number) => {
    const newStudents = [...data.students];
    newStudents[index] = { ...newStudents[index], [field]: value };
    setData({ ...data, students: newStudents });
  };

  const applyTemplate = (templateType: 'grade' | 'english' | 'subject_group', groupName?: string) => {
    let templateBlocks: ContentBlock[] = [];
    
    if (templateType === 'grade') {
      // Grade Plan structure based on the provided PDF
      templateBlocks = [
        { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. Căn cứ xây dựng kế hoạch', content: { grounds: INITIAL_DATA.grounds }, order: 1 },
        { id: crypto.randomUUID(), type: BlockType.STUDENT_STATS, title: '1. Học sinh', content: { students: INITIAL_DATA.students, characteristics: INITIAL_DATA.studentCharacteristics }, order: 2 },
        { id: crypto.randomUUID(), type: BlockType.TEACHER_STATS, title: '2. Đội ngũ giáo viên', content: { teachers: INITIAL_DATA.teachers, characteristics: INITIAL_DATA.teacherCharacteristics }, order: 3 },
        { id: crypto.randomUUID(), type: BlockType.LEARNING_RESOURCES, title: '3. Nguồn học liệu & 4. Thiết bị dạy học', content: { text: INITIAL_DATA.learningMaterials, equipment: INITIAL_DATA.teachingEquipment }, order: 4 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '5. Các nội dung giáo dục địa phương, giáo dục an toàn giao thông, chủ đề hoạt động giáo dục tập thể, nội dung thực hiện tích hợp liên môn, stem …', content: { html: '- Tích hợp dạy học giáo dục Kỹ năng sống, Bảo vệ môi trường, bảo vệ biển đảo, giáo dục địa phương, Quốc phòng - An ninh, Quyền con người, nội dung thực hiện tích hợp liên môn, stem … trong các môn học phù hợp theo quy định.\n- Tích hợp dạy học theo hướng phát triển Năng lực, phẩm chất cho học sinh.\n- Nhà trường trang bị đầy đủ các tài liệu phục vụ dạy giáo dục an toàn giao thông.\n- Chủ đề hoạt động giáo dục tập thể được xây dựng, thống nhất trong nhà trường theo kế hoạch giáo dục hàng năm.\n- Các nội dung thực hiện tích hợp liên môn được tổ chuyên môn bàn bạc, thống nhất thông qua các buổi sinh hoạt chuyên môn định kì.' }, order: 5 },
        { id: crypto.randomUUID(), type: BlockType.EDUCATIONAL_CONTENT, title: '6. Nội dung thực hiện chương trình giáo dục', content: { compulsory: INITIAL_DATA.educationalContent.compulsory, optional: INITIAL_DATA.educationalContent.optional, duration: INITIAL_DATA.duration }, order: 6 },
        { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'III. KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC, HOẠT ĐỘNG GIÁO DỤC', content: { subjectIds: [] }, order: 7 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'IV. TỔ CHỨC THỰC HIỆN', content: { html: '1. Trách nhiệm của tổ trưởng chuyên môn:\n- Xây dựng kế hoạch dạy học lớp...; kế hoạch sinh hoạt chuyên môn khối...\n- Triển khai đầy đủ, chính xác kế hoạch dạy học của nhà trường.\n- Xây dựng phân phối chương trình, nội dung giáo dục, lựa chọn phương pháp giảng dạy, phương pháp đánh giá học sinh, lập thời khóa biểu hàng tuần trình Ban giám hiệu nhà trường phê duyệt trước khi tổ chức thực hiện.\n- Thực hiện đầy đủ hồ sơ sổ sách của nhà trường theo đúng quy định.\n- Bồi dưỡng, dự giờ thăm lớp các thành viên trong tổ khối để trao đổi kinh nghiệm, chuyên môn nhằm tạo hiệu quả tốt trong quá trình giảng dạy.\n- Thực hiện nghiêm túc sinh hoạt chuyên môn nghiên cứu bài học. Thường xuyên trao đổi, thảo luận về những khó khăn khi thực hiện chương trình để tìm biện pháp tháo gỡ. Những điều chỉnh, thay đổi phải được bàn bạc, thống nhất và ghi chép lại trong biên bản họp tổ chuyên môn.\n- Kiểm tra, giám sát việc thực hiện kế hoạch dạy học của giáo viên trong tổ.\n- Không để xảy ra tình trạng bỏ buổi, bỏ tiết; không được đổi buổi hoặc thay đổi thời gian, thời lượng dạy học đã quy định trong kế hoạch dạy học khi chưa có sự đồng ý của Hiệu trưởng.\n\n2. Trách nhiệm của các thành viên trong khối:\n- Thực hiện kế hoạch bài dạy theo đúng phân phối chương trình. Trên cơ sở nội dung chương trình và các hoạt động giáo dục quy định, phối hợp cùng với tổ chuyên môn xây dựng kế hoạch, tổ chức giảng dạy và các hoạt động giáo dục cho lớp, môn phân công phù hợp với điều kiện với học sinh của lớp giảng dạy.\n- Chuẩn bị chu đáo tất cả các tiết dạy, thực hiện nội dung các chuyên đề chuyên môn đã được tập huấn vào quá trình giảng dạy thực tế; không chỉ lo đầu tư các tiết có dự giờ, thăm lớp theo kế hoạch của nhà trường.\n- Tham gia đầy đủ các buổi sinh hoạt chuyên môn, dự giờ, bồi dưỡng để trao đổi kinh nghiệm nhằm tạo kết quả tốt trong quá trình giảng dạy.\n- Thực hiện nghiêm túc việc đánh giá học sinh theo Thông tư số 27/2020/TT-BGDĐT ngày 04/9/2020 ban hành về quy định đánh giá học sinh tiểu học.' }, order: 8 }
      ];
    } else if (templateType === 'subject_group') {
      if (groupName === 'Tổ Năng khiếu') {
        // Comprehensive Template for Arts/Talent Group
        templateBlocks = [
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 1, text: 'KẾ HOẠCH GIÁO DỤC TỔ NĂNG KHIẾU NĂM HỌC 2025 – 2026' }, order: 1 },
          
          { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. CĂN CỨ XÂY DỰNG KẾ HOẠCH', content: { grounds: INITIAL_DATA.grounds }, order: 2 },
          
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'II. ĐẶC ĐIỂM TÌNH HÌNH' }, order: 3 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Bối cảnh năm học', content: { html: '<i>- Năm học tiếp tục thực hiện Chương trình GDPT 2018 đối với tất cả các khối lớp.<br>- Nhà trường chú trọng giáo dục toàn diện, phát triển năng khiếu và kỹ năng mềm cho học sinh.</i>' }, order: 4 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Thuận lợi', content: { html: '<b>- Cơ sở vật chất:</b> Nhà trường có phòng Âm nhạc, phòng Mĩ thuật riêng biệt, trang bị đầy đủ đàn, hệ thống âm thanh, giá vẽ, họa phẩm...<br><b>- Đội ngũ:</b> Giáo viên trẻ, nhiệt tình, có chuyên môn vững vàng, tích cực ứng dụng CNTT.<br><b>- Học sinh:</b> Đa số học sinh yêu thích các môn năng khiếu, tích cực tham gia các hoạt động phong trào.' }, order: 5 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Khó khăn', content: { html: '<i>- Một số học sinh còn rụt rè, chưa tự tin thể hiện năng khiếu.<br>- Kinh phí tổ chức các hoạt động ngoại khóa quy mô lớn còn hạn chế.</i>' }, order: 6 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Tình hình đội ngũ giáo viên', content: { html: '<p>Tổng số giáo viên trong tổ: ... đ/c. Trong đó: Âm nhạc: ... đ/c; Mĩ thuật: ... đ/c.</p><table style="width:100%; border-collapse: collapse; border: 1px solid black; text-align: center; margin-top: 10px; font-size: 13px;"><thead><tr style="background-color: #f3f4f6;"><th style="border: 1px solid black; padding: 8px; width: 50px;">STT</th><th style="border: 1px solid black; padding: 8px;">Họ và tên</th><th style="border: 1px solid black; padding: 8px; width: 80px;">Năm sinh</th><th style="border: 1px solid black; padding: 8px;">Trình độ CM</th><th style="border: 1px solid black; padding: 8px;">Chuyên ngành</th><th style="border: 1px solid black; padding: 8px;">Nhiệm vụ phân công</th></tr></thead><tbody><tr><td style="border: 1px solid black; padding: 8px;">1</td><td style="border: 1px solid black; padding: 8px; text-align: left;">Nguyễn Văn A</td><td style="border: 1px solid black; padding: 8px;">1985</td><td style="border: 1px solid black; padding: 8px;">Đại học</td><td style="border: 1px solid black; padding: 8px;">SP Âm nhạc</td><td style="border: 1px solid black; padding: 8px;">Tổ trưởng - Dạy Âm nhạc K4,5</td></tr><tr><td style="border: 1px solid black; padding: 8px;">2</td><td style="border: 1px solid black; padding: 8px; text-align: left;">Trần Thị B</td><td style="border: 1px solid black; padding: 8px;">1990</td><td style="border: 1px solid black; padding: 8px;">Đại học</td><td style="border: 1px solid black; padding: 8px;">SP Mĩ thuật</td><td style="border: 1px solid black; padding: 8px;">Tổ phó - Dạy Mĩ thuật K1,2,3</td></tr><tr><td style="border: 1px solid black; padding: 8px;">3</td><td style="border: 1px solid black; padding: 8px; text-align: left;">...</td><td style="border: 1px solid black; padding: 8px;">...</td><td style="border: 1px solid black; padding: 8px;">...</td><td style="border: 1px solid black; padding: 8px;">...</td><td style="border: 1px solid black; padding: 8px;">...</td></tr></tbody></table><p style="margin-top: 10px;"><i>Nhận xét chung: Đội ngũ giáo viên trẻ, nhiệt tình, có năng lực chuyên môn vững vàng, tích cực tham gia các hoạt động phong trào của nhà trường và ngành.</i></p>' }, order: 7 },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'III. CÁC MỤC TIÊU, CHỈ TIÊU PHẤN ĐẤU' }, order: 8 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Mục tiêu chung', content: { html: '- Nâng cao chất lượng giáo dục thẩm mỹ, giúp học sinh hình thành và phát triển năng lực âm nhạc, mĩ thuật.<br>- Phát hiện và bồi dưỡng những học sinh có năng khiếu, tạo nguồn cho các đội tuyển của trường.<br>- Tổ chức đa dạng các hoạt động trải nghiệm, sân chơi nghệ thuật.' }, order: 9 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Chỉ tiêu cụ thể', content: { html: '<table style="width:100%; border-collapse: collapse; border: 1px solid black;"><tr><td style="border: 1px solid black; padding: 8px; font-weight: bold;">Đối với Giáo viên</td><td style="border: 1px solid black; padding: 8px;">- 100% GV đạt chuẩn và trên chuẩn.<br>- 100% GV tham gia hội giảng, thao giảng (ít nhất 2 tiết/năm).<br>- 100% GV có sáng kiến kinh nghiệm hoặc sản phẩm nghiên cứu khoa học sư phạm ứng dụng.</td></tr><tr><td style="border: 1px solid black; padding: 8px; font-weight: bold;">Đối với Học sinh</td><td style="border: 1px solid black; padding: 8px;">- 100% HS hoàn thành chương trình môn học.<br>- Thành lập CLB Âm nhạc, Mĩ thuật hoạt động thường xuyên.<br>- Tham gia đầy đủ các hội thi: Giai điệu tuổi hồng, Nét vẽ xanh, Em yêu chữ Việt... đạt giải cấp Quận/Huyện trở lên.</td></tr></table>' }, order: 10 },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'IV. CÁC NHIỆM VỤ, GIẢI PHÁP TRỌNG TÂM' }, order: 11 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Thực hiện chương trình giáo dục', content: { html: '- Thực hiện nghiêm túc phân phối chương trình, đảm bảo chuẩn kiến thức kỹ năng.<br>- Tăng cường dạy học theo chủ đề, tích hợp liên môn (Vẽ tranh theo nhạc, Âm nhạc trong văn học...).<br>- Xây dựng kế hoạch giáo dục cá nhân cho học sinh năng khiếu và học sinh cần hỗ trợ.' }, order: 12 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Đổi mới phương pháp dạy học và kiểm tra đánh giá', content: { html: '- Áp dụng triệt để các phương pháp dạy học tích cực: Đan Mạch (Mĩ thuật), Kodály, Orff-Schulwerk (Âm nhạc).<br>- Đa dạng hóa hình thức đánh giá: Đánh giá qua sản phẩm, dự án, biểu diễn thực hành, hồ sơ học tập.<br>- Tăng cường nhận xét, đánh giá vì sự tiến bộ của học sinh.' }, order: 13 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Công tác bồi dưỡng học sinh năng khiếu', content: { html: '- Duy trì sinh hoạt Câu lạc bộ Âm nhạc và Mĩ thuật vào chiều thứ 6 hàng tuần.<br>- Xây dựng kế hoạch tập luyện cụ thể cho các đội tuyển tham gia hội thi các cấp.' }, order: 14 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Tổ chức các hoạt động giáo dục', content: { html: '- Tổ chức Triển lãm tranh "Sắc màu tuổi thơ" chào mừng ngày 20/11.<br>- Tổ chức Hội diễn văn nghệ "Mừng Đảng - Mừng Xuân".<br>- Trang trí trường lớp theo các chủ điểm lớn trong năm.' }, order: 15 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '5. Nâng cao chất lượng đội ngũ', content: { html: '- Duy trì sinh hoạt chuyên môn 2 tuần/lần, tập trung vào nghiên cứu bài học.<br>- Tăng cường dự giờ, rút kinh nghiệm, chia sẻ học liệu số.' }, order: 16 },

          { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'V. LỊCH TRÌNH THỰC HIỆN', content: { html: '<table style="width:100%; border-collapse: collapse; border: 1px solid black; text-align: center;"><thead><tr style="background-color: #f3f4f6;"><th style="border: 1px solid black; padding: 8px;">Tháng</th><th style="border: 1px solid black; padding: 8px;">Nội dung công việc trọng tâm</th><th style="border: 1px solid black; padding: 8px;">Người thực hiện</th><th style="border: 1px solid black; padding: 8px;">Ghi chú</th></tr></thead><tbody><tr><td style="border: 1px solid black; padding: 8px;">8</td><td style="border: 1px solid black; padding: 8px; text-align: left;">- Ổn định tổ chức, xây dựng kế hoạch.<br>- Rà soát thiết bị dạy học.</td><td style="border: 1px solid black; padding: 8px;">Tổ trưởng + GV</td><td style="border: 1px solid black; padding: 8px;"></td></tr><tr><td style="border: 1px solid black; padding: 8px;">9</td><td style="border: 1px solid black; padding: 8px; text-align: left;">- Phát động phong trào thi đua chào mừng năm học mới.<br>- Tuyển chọn thành viên CLB.</td><td style="border: 1px solid black; padding: 8px;">Tổ chuyên môn</td><td style="border: 1px solid black; padding: 8px;"></td></tr><tr><td style="border: 1px solid black; padding: 8px;">10</td><td style="border: 1px solid black; padding: 8px; text-align: left;">- Hội giảng cấp trường.<br>- Kiểm tra chuyên đề.</td><td style="border: 1px solid black; padding: 8px;">BGH + Tổ trưởng</td><td style="border: 1px solid black; padding: 8px;"></td></tr><tr><td style="border: 1px solid black; padding: 8px;">11</td><td style="border: 1px solid black; padding: 8px; text-align: left;">- Triển lãm tranh/Văn nghệ chào mừng 20/11.</td><td style="border: 1px solid black; padding: 8px;">Toàn tổ</td><td style="border: 1px solid black; padding: 8px;"></td></tr></tbody></table>' }, order: 17 },

          { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'VI. TỔ CHỨC THỰC HIỆN', content: { html: '<b>1. Trách nhiệm của Tổ trưởng:</b><br>- Xây dựng kế hoạch chung, phân công nhiệm vụ cụ thể.<br>- Đôn đốc, kiểm tra, giám sát việc thực hiện.<br><br><b>2. Trách nhiệm của Giáo viên:</b><br>- Thực hiện nghiêm túc quy chế chuyên môn.<br>- Chủ động sáng tạo trong dạy học và tổ chức hoạt động.' }, order: 18 },
          
          { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'VII. KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC', content: { subjectIds: [] }, order: 19 }
        ];
      } else if (groupName === 'Tổ Tin học - Công nghệ') {
         templateBlocks = [
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 1, text: 'KẾ HOẠCH GIÁO DỤC TỔ TIN HỌC - CÔNG NGHỆ NĂM HỌC 2025 – 2026' }, order: 1 },
          
          { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. CĂN CỨ XÂY DỰNG KẾ HOẠCH', content: { grounds: INITIAL_DATA.grounds }, order: 2 },
          
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'II. ĐẶC ĐIỂM TÌNH HÌNH' }, order: 3 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Bối cảnh năm học', content: { html: '<i>- Đẩy mạnh chuyển đổi số trong giáo dục và giáo dục STEM theo định hướng Chương trình GDPT 2018.<br>- Môn Tin học và Công nghệ đóng vai trò nòng cốt trong việc hình thành năng lực tin học và công nghệ cho học sinh.</i>' }, order: 4 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Thuận lợi', content: { html: '<b>- Cơ sở vật chất:</b> Nhà trường có 02 phòng máy tính kết nối Internet cáp quang tốc độ cao, hệ thống máy chiếu/tivi thông minh tại các lớp học.<br><b>- Đội ngũ:</b> Giáo viên có trình độ chuẩn, năng động, nắm bắt nhanh công nghệ mới.<br><b>- Học sinh:</b> Hứng thú với các tiết học thực hành máy tính và lắp ráp mô hình kỹ thuật.' }, order: 5 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Khó khăn', content: { html: '<i>- Một số máy tính cấu hình đã cũ, thường xuyên hỏng hóc cần bảo trì.<br>- Thiết bị dạy học STEM và robot giáo dục còn hạn chế.<br>- Việc cập nhật phần mềm mới đôi khi gặp khó khăn do cấu hình máy thấp.</i>' }, order: 6 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Tình hình đội ngũ giáo viên', content: { html: '<p>Tổng số giáo viên trong tổ: ... đ/c. Trong đó: Tin học: ... đ/c; Công nghệ: ... đ/c.</p>' }, order: 7 },
          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: '', 
            content: { 
              columns: [
                { id: 'c1', header: 'STT', width: '50px' },
                { id: 'c2', header: 'Họ và tên', width: '200px' },
                { id: 'c3', header: 'Năm sinh', width: '80px' },
                { id: 'c4', header: 'Trình độ CM', width: '120px' },
                { id: 'c5', header: 'Chuyên ngành', width: '120px' },
                { id: 'c6', header: 'Nhiệm vụ phân công', width: '250px' }
              ],
              rows: [
                { c1: '1', c2: 'Lê Văn C', c3: '1988', c4: 'Đại học', c5: 'CNTT', c6: 'Tổ trưởng - Quản trị mạng - Dạy Tin học K3,4,5' },
                { c1: '2', c2: 'Phạm Thị D', c3: '1992', c4: 'Đại học', c5: 'KT Công nghiệp', c6: 'Dạy Công nghệ K3,4,5' },
                { c1: '3', c2: '...', c3: '...', c4: '...', c5: '...', c6: '...' }
              ]
            }, 
            order: 7.5 
          },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'III. CÁC MỤC TIÊU, CHỈ TIÊU PHẤN ĐẤU' }, order: 8 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Mục tiêu chung', content: { html: '- Hình thành và phát triển năng lực tin học, năng lực công nghệ cho học sinh.<br>- Đẩy mạnh giáo dục STEM, khơi dậy niềm đam mê khoa học kỹ thuật.<br>- Đảm bảo an toàn, an ninh mạng trong nhà trường.' }, order: 9 },
          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: '2. Chỉ tiêu cụ thể', 
            content: { 
              columns: [
                { id: 'c1', header: 'Đối tượng', width: '150px' },
                { id: 'c2', header: 'Chỉ tiêu phấn đấu', width: '400px' }
              ],
              rows: [
                { c1: 'Đối với Giáo viên', c2: '- 100% GV ứng dụng thành thạo CNTT và chuyển đổi số.\n- 100% GV tham gia bồi dưỡng về giáo dục STEM.\n- Xây dựng kho học liệu số dùng chung cho tổ.' },
                { c1: 'Đối với Học sinh', c2: '- 100% HS lớp 3,4,5 được học Tin học và Công nghệ.\n- Tham gia Hội thi Tin học trẻ: Phấn đấu có giải cấp Quận.\n- 100% HS biết sử dụng máy tính an toàn, đúng quy định.' }
              ]
            }, 
            order: 10 
          },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'IV. CÁC NHIỆM VỤ, GIẢI PHÁP TRỌNG TÂM' }, order: 11 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Thực hiện chương trình giáo dục', content: { html: '- Giảng dạy môn Tin học và Công nghệ theo đúng phân phối chương trình.<br>- Tăng cường thời lượng thực hành trên máy (tối thiểu 50% thời lượng môn Tin học).<br>- Lồng ghép nội dung giáo dục kỹ năng số, an toàn thông tin.' }, order: 12 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Đổi mới phương pháp dạy học và giáo dục STEM', content: { html: '- Triển khai dạy học theo định hướng giáo dục STEM/STEAM.<br>- Sử dụng các phần mềm hỗ trợ dạy học, mô phỏng.<br>- Tổ chức các hoạt động trải nghiệm: Lắp ráp robot, lập trình Scratch, thiết kế đồ họa đơn giản.' }, order: 13 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Công tác bồi dưỡng học sinh giỏi', content: { html: '- Thành lập CLB Tin học trẻ, bồi dưỡng đội tuyển tham gia các hội thi.<br>- Hướng dẫn học sinh tham gia các sân chơi trí tuệ trực tuyến (IOE, VioEdu...).' }, order: 14 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Ứng dụng CNTT và Chuyển đổi số', content: { html: '- Hỗ trợ các tổ chuyên môn khác trong việc ứng dụng CNTT vào dạy học.<br>- Quản lý và vận hành hiệu quả website, fanpage nhà trường.<br>- Triển khai sử dụng học bạ điện tử, giáo án điện tử.' }, order: 15 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '5. Quản lý, bảo trì phòng máy', content: { html: '- Lập lịch trực phòng máy, vệ sinh công nghiệp định kỳ.<br>- Kiểm tra, cài đặt phần mềm, diệt virus thường xuyên.<br>- Đề xuất sửa chữa, nâng cấp thiết bị kịp thời.' }, order: 16 },

          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: 'V. LỊCH TRÌNH THỰC HIỆN', 
            content: { 
              columns: [
                { id: 'c1', header: 'Tháng', width: '80px' },
                { id: 'c2', header: 'Nội dung công việc trọng tâm', width: '350px' },
                { id: 'c3', header: 'Người thực hiện', width: '150px' },
                { id: 'c4', header: 'Ghi chú', width: '100px' }
              ],
              rows: [
                { c1: '8', c2: '- Bảo trì hệ thống máy tính đầu năm.\n- Cài đặt phần mềm phục vụ giảng dạy.', c3: 'GV Tin học', c4: '' },
                { c1: '9', c2: '- Triển khai dạy học theo TKB.\n- Tuyển chọn đội tuyển Tin học trẻ.', c3: 'Tổ chuyên môn', c4: '' },
                { c1: '10', c2: '- Tổ chức chuyên đề STEM cấp trường.\n- Kiểm tra an toàn thông tin.', c3: 'BGH + Tổ trưởng', c4: '' },
                { c1: '11', c2: '- Thi đua dạy tốt chào mừng 20/11.\n- Hỗ trợ làm báo tường điện tử.', c3: 'Toàn tổ', c4: '' }
              ]
            }, 
            order: 17 
          },

          { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'VI. TỔ CHỨC THỰC HIỆN', content: { html: '<b>1. Trách nhiệm của Tổ trưởng:</b><br>- Chịu trách nhiệm chung về hoạt động của tổ và hệ thống CNTT nhà trường.<br>- Xây dựng kế hoạch bảo trì, nâng cấp thiết bị.<br><br><b>2. Trách nhiệm của Giáo viên:</b><br>- Quản lý học sinh trong giờ thực hành.<br>- Bảo quản tài sản phòng máy được giao.' }, order: 18 },
          
          { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'VII. KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC', content: { subjectIds: [] }, order: 19 }
        ];
      } else if (groupName === 'Tổ Giáo dục thể chất') {
         templateBlocks = [
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 1, text: 'KẾ HOẠCH GIÁO DỤC TỔ GIÁO DỤC THỂ CHẤT NĂM HỌC 2025 – 2026' }, order: 1 },
          
          { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. CĂN CỨ XÂY DỰNG KẾ HOẠCH', content: { grounds: INITIAL_DATA.grounds }, order: 2 },
          
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'II. ĐẶC ĐIỂM TÌNH HÌNH' }, order: 3 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Bối cảnh năm học', content: { html: '<i>- Tiếp tục đẩy mạnh cuộc vận động "Toàn dân rèn luyện thân thể theo gương Bác Hồ vĩ đại".<br>- Chú trọng công tác giáo dục thể chất, thể thao trường học và phòng chống đuối nước cho học sinh.</i>' }, order: 4 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Thuận lợi', content: { html: '<b>- Cơ sở vật chất:</b> Sân trường rộng rãi, có hố nhảy xa, sân bóng đá mini, sân cầu lông...<br><b>- Đội ngũ:</b> Giáo viên trẻ, khỏe, nhiệt tình, có chuyên môn sâu về huấn luyện thể thao.<br><b>- Học sinh:</b> Đa số học sinh yêu thích vận động, tích cực tham gia các CLB thể thao.' }, order: 5 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Khó khăn', content: { html: '<i>- Chưa có nhà đa năng nên việc dạy học bị ảnh hưởng khi thời tiết xấu (mưa, nắng gắt).<br>- Một số dụng cụ tập luyện đã cũ, cần bổ sung thay thế.</i>' }, order: 6 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Tình hình đội ngũ giáo viên', content: { html: '<p>Tổng số giáo viên trong tổ: ... đ/c.</p>' }, order: 7 },
          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: '', 
            content: { 
              columns: [
                { id: 'c1', header: 'STT', width: '50px' },
                { id: 'c2', header: 'Họ và tên', width: '200px' },
                { id: 'c3', header: 'Năm sinh', width: '80px' },
                { id: 'c4', header: 'Trình độ CM', width: '120px' },
                { id: 'c5', header: 'Chuyên sâu', width: '120px' },
                { id: 'c6', header: 'Nhiệm vụ phân công', width: '250px' }
              ],
              rows: [
                { c1: '1', c2: 'Nguyễn Văn X', c3: '1985', c4: 'Đại học', c5: 'Điền kinh', c6: 'Tổ trưởng - Huấn luyện đội tuyển Điền kinh' },
                { c1: '2', c2: 'Lê Thị Y', c3: '1990', c4: 'Đại học', c5: 'Bơi lội', c6: 'Dạy bơi - Huấn luyện đội tuyển Bơi' },
                { c1: '3', c2: '...', c3: '...', c4: '...', c5: '...', c6: '...' }
              ]
            }, 
            order: 7.5 
          },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'III. CÁC MỤC TIÊU, CHỈ TIÊU PHẤN ĐẤU' }, order: 8 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Mục tiêu chung', content: { html: '- Nâng cao sức khỏe, phát triển thể lực, tầm vóc cho học sinh.<br>- Phát hiện và bồi dưỡng năng khiếu thể thao.<br>- Đảm bảo an toàn trong tập luyện và thi đấu.' }, order: 9 },
          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: '2. Chỉ tiêu cụ thể', 
            content: { 
              columns: [
                { id: 'c1', header: 'Đối tượng', width: '150px' },
                { id: 'c2', header: 'Chỉ tiêu phấn đấu', width: '400px' }
              ],
              rows: [
                { c1: 'Đối với Giáo viên', c2: '- 100% GV đạt danh hiệu Lao động tiên tiến.\n- Huấn luyện đội tuyển đạt ít nhất 02 giải cấp Quận.\n- Tổ chức thành công Hội khỏe Phù Đổng cấp trường.' },
                { c1: 'Đối với Học sinh', c2: '- 100% HS đạt tiêu chuẩn rèn luyện thân thể.\n- 100% HS lớp 3,4,5 biết bơi an toàn.\n- Tham gia đầy đủ các giải thể thao do ngành tổ chức.' }
              ]
            }, 
            order: 10 
          },

          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'IV. CÁC NHIỆM VỤ, GIẢI PHÁP TRỌNG TÂM' }, order: 11 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Thực hiện chương trình giáo dục', content: { html: '- Thực hiện nghiêm túc phân phối chương trình môn GDTC.<br>- Đổi mới hình thức khởi động, gây hứng thú cho học sinh.<br>- Tăng cường sử dụng trò chơi vận động trong giờ học.' }, order: 12 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Công tác giáo dục thể chất và thể thao trường học', content: { html: '- Duy trì tập thể dục giữa giờ và múa hát sân trường nề nếp.<br>- Thành lập và duy trì hoạt động các CLB: Bóng đá, Cờ vua, Bóng rổ, Aerobic.<br>- Tổ chức giải bóng đá mini cấp trường chào mừng 26/3.' }, order: 13 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Công tác phòng chống đuối nước', content: { html: '- Tuyên truyền về phòng chống đuối nước trong các giờ chào cờ.<br>- Phối hợp tổ chức dạy bơi cho học sinh trong dịp hè và năm học.' }, order: 14 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '4. Công tác huấn luyện đội tuyển', content: { html: '- Tuyển chọn VĐV năng khiếu ngay từ đầu năm học.<br>- Xây dựng kế hoạch tập luyện khoa học, bài bản.<br>- Tham gia thi đấu cọ xát để nâng cao trình độ.' }, order: 15 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: '5. Quản lý cơ sở vật chất', content: { html: '- Kiểm tra độ an toàn của dụng cụ tập luyện trước khi lên lớp.<br>- Sắp xếp kho dụng cụ gọn gàng, ngăn nắp.<br>- Đề xuất mua sắm bổ sung dụng cụ kịp thời.' }, order: 16 },

          { 
            id: crypto.randomUUID(), 
            type: BlockType.TABLE, 
            title: 'V. LỊCH TRÌNH THỰC HIỆN', 
            content: { 
              columns: [
                { id: 'c1', header: 'Tháng', width: '80px' },
                { id: 'c2', header: 'Nội dung công việc trọng tâm', width: '350px' },
                { id: 'c3', header: 'Người thực hiện', width: '150px' },
                { id: 'c4', header: 'Ghi chú', width: '100px' }
              ],
              rows: [
                { c1: '8', c2: '- Vệ sinh sân bãi, kiểm tra dụng cụ.\n- Tuyển chọn đội tuyển điền kinh, bơi lội.', c3: 'Toàn tổ', c4: '' },
                { c1: '9', c2: '- Ổn định nề nếp thể dục giữa giờ.\n- Tập luyện đội tuyển chuẩn bị thi đấu.', c3: 'GV GDTC + TPT', c4: '' },
                { c1: '10', c2: '- Tổ chức Hội khỏe Phù Đổng cấp trường.\n- Kiểm tra thể lực học sinh.', c3: 'BGH + Tổ GDTC', c4: '' },
                { c1: '11', c2: '- Tổ chức giải kéo co chào mừng 20/11.\n- Tham gia thi đấu cấp Quận.', c3: 'Toàn tổ', c4: '' }
              ]
            }, 
            order: 17 
          },

          { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'VI. TỔ CHỨC THỰC HIỆN', content: { html: '<b>1. Trách nhiệm của Tổ trưởng:</b><br>- Xây dựng kế hoạch hoạt động thể thao toàn trường.<br>- Phân công huấn luyện các đội tuyển.<br><br><b>2. Trách nhiệm của Giáo viên:</b><br>- Đảm bảo an toàn tuyệt đối cho học sinh trong giờ học.<br>- Tích cực tham gia công tác huấn luyện và trọng tài.' }, order: 18 },
          
          { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'VII. KẾ HOẠCH DẠY HỌC CÁC MÔN HỌC', content: { subjectIds: [] }, order: 19 }
        ];
      } else {
        // Generic fallback
        templateBlocks = [
          { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 1, text: `KẾ HOẠCH GIÁO DỤC NĂM HỌC 2025 – 2026 ${groupName ? groupName.toUpperCase() : 'TỔ BỘ MÔN'}` }, order: 1 },
          { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. Căn cứ xây dựng kế hoạch', content: { grounds: INITIAL_DATA.grounds }, order: 2 },
          { id: crypto.randomUUID(), type: BlockType.TEACHER_STATS, title: '1. Tình hình đội ngũ giáo viên', content: { teachers: INITIAL_DATA.teachers, characteristics: INITIAL_DATA.teacherCharacteristics }, order: 3 },
          { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'II. Kế hoạch dạy học', content: { subjectIds: [] }, order: 4 },
          { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'III. Tổ chức thực hiện', content: { html: '' }, order: 5 }
        ];
      }
    } else {
      // English Template based on PDF
      templateBlocks = [
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 1, text: 'KẾ HOẠCH GIÁO DỤC NĂM HỌC 2025 – 2026 TỔ TIẾNG ANH' }, order: 1 },
        
        { id: crypto.randomUUID(), type: BlockType.GROUNDS, title: 'I. Căn cứ xây dựng kế hoạch:', content: { grounds: ['<i>Liệt kê các văn bản pháp lý, nghị quyết, kế hoạch của các cấp (Bộ GDĐT, Sở GDĐT, Phòng GDĐT, Nhà trường) làm cơ sở xây dựng kế hoạch...</i>'] }, order: 2 },
        
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'II. Điều kiện thực hiện các môn học, hoạt động giáo dục:' }, order: 3 },
        
        { 
          id: crypto.randomUUID(), 
          type: BlockType.TABLE, 
          title: '1. Loại hình dạy – học tiếng Anh tại trường', 
          content: { 
            columns: [
              { id: 'c1', header: 'KHỐI', width: '80px' },
              { id: 'c2', header: 'TỔNG SỐ LỚP', width: '100px' },
              { id: 'c3', header: 'Tăng cường', width: '100px' },
              { id: 'c4', header: 'Đề án', width: '100px' },
              { id: 'c5', header: 'Tích hợp', width: '100px' },
              { id: 'c6', header: 'TỔNG SỐ HS', width: '100px' },
              { id: 'c7', header: 'Tăng cường', width: '100px' },
              { id: 'c8', header: 'Đề án', width: '100px' },
              { id: 'c9', header: 'Tích hợp', width: '100px' },
              { id: 'c10', header: 'GHI CHÚ' }
            ],
            headerRows: [
              [
                { text: 'KHỐI', rowSpan: 2, width: '80px' },
                { text: 'TỔNG SỐ LỚP', rowSpan: 2, width: '100px' },
                { text: 'SỐ LỚP', colSpan: 3 },
                { text: 'TỔNG SỐ HỌC SINH', rowSpan: 2, width: '100px' },
                { text: 'SỐ HỌC SINH', colSpan: 3 },
                { text: 'GHI CHÚ (số tiết TCTA/tuần khối lớp 1)', rowSpan: 2 }
              ],
              [
                { text: 'Tăng cường' },
                { text: 'Đề án' },
                { text: 'Tích hợp' },
                { text: 'Tăng cường' },
                { text: 'Đề án' },
                { text: 'Tích hợp' }
              ]
            ],
            rows: [
              { c1: '1', c2: '06', c3: '04', c4: '', c5: '02', c6: '209', c7: '138', c8: '', c9: '70', c10: '6' },
              { c1: '2', c2: '06', c3: '04', c4: '', c5: '02', c6: '209', c7: '140', c8: '', c9: '69', c10: '6' },
              { c1: '3', c2: '06', c3: '04', c4: '', c5: '02', c6: '209', c7: '140', c8: '', c9: '69', c10: '8' },
              { c1: '4', c2: '06', c3: '04', c4: '', c5: '02', c6: '208', c7: '140', c8: '', c9: '70', c10: '8' },
              { c1: '5', c2: '06', c3: '05', c4: '', c5: '01', c6: '203', c7: '173', c8: '', c9: '34', c10: '8' },
              { c1: 'TC', c2: '30', c3: '21', c4: '0', c5: '09', c6: '1029', c7: '731', c8: '0', c9: '312', c10: '' }
            ]
          }, 
          order: 4 
        },
        
        { 
          id: crypto.randomUUID(), 
          type: BlockType.TABLE, 
          title: '2. Đội ngũ giáo viên', 
          content: { 
            columns: [
              { id: 'c1', header: 'STT', width: '50px' },
              { id: 'c2', header: 'HỌ VÀ TÊN GV', width: '200px' },
              { id: 'c3', header: 'CHỨC VỤ', width: '120px' },
              { id: 'c4', header: 'NĂM SINH', width: '100px' },
              { id: 'c5', header: 'NĂM VÀO NGÀNH', width: '120px' },
              { id: 'c6', header: 'TRÌNH ĐỘ CM', width: '150px' },
              { id: 'c7', header: 'C1', width: '80px' },
              { id: 'c8', header: 'B2', width: '80px' },
              { id: 'c9', header: 'B1', width: '80px' },
              { id: 'c10', header: 'PHỤ TRÁCH KHỐI', width: '120px' },
              { id: 'c11', header: 'GHI CHÚ', width: '150px' }
            ],
            headerRows: [
              [
                { text: 'STT', rowSpan: 2, width: '50px' },
                { text: 'Họ và tên GV TIẾNG ANH', rowSpan: 2, width: '200px' },
                { text: 'Chức vụ', rowSpan: 2, width: '120px' },
                { text: 'Năm sinh', rowSpan: 2, width: '100px' },
                { text: 'Năm vào ngành', rowSpan: 2, width: '120px' },
                { text: 'Trình độ chuyên môn', rowSpan: 2, width: '150px' },
                { text: 'CCNN Theo chuẩn VSTEP (Khung NLNN 6 bậc Việt Nam)', colSpan: 3 },
                { text: 'Phụ trách khối lớp', rowSpan: 2, width: '120px' },
                { text: 'GHI CHÚ (Biên chế/HĐ)', rowSpan: 2, width: '150px' }
              ],
              [
                { text: 'C1' },
                { text: 'B2' },
                { text: 'B1' }
              ]
            ],
            rows: [
              { c1: '1', c2: 'Phan Ngọc Thúy', c3: 'TTCM', c4: '1989', c5: '2014', c6: 'Đại học', c7: 'X', c8: 'FCE', c9: '', c10: '4, 5', c11: 'Biên chế' },
              { c1: '2', c2: 'Nguyễn Hoàng Chinh', c3: 'Tổ phó', c4: '1972', c5: '2009', c6: 'Đại học', c7: '', c8: 'X', c9: '', c10: '2, 5', c11: 'Biên chế' },
              { c1: '3', c2: 'Nguyễn Thị Hồng Phượng', c3: 'Giáo viên', c4: '1986', c5: '2017', c6: 'Đại học', c7: '', c8: 'FCE', c9: '', c10: '1, 5', c11: 'Biên chế' },
              { c1: '4', c2: 'Trương Ngọc Thị Thanh Thảo', c3: 'Giáo viên', c4: '1990', c5: '2018', c6: 'Đại học', c7: '', c8: 'X', c9: '', c10: '1, 5', c11: 'Biên chế' }
            ]
          }, 
          order: 5 
        },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Thuận lợi – khó khăn', content: { html: '<b>3.1. Thuận lợi:</b><br>- [Mô tả sự quan tâm, chỉ đạo của Ban giám hiệu nhà trường đối với hoạt động của tổ].<br>- Cơ sở vật chất, trang thiết bị dạy học: [Liệt kê các thiết bị hiện có: ví dụ: phòng chức năng, bảng tương tác, máy chiếu, TV...] được trang bị [mức độ: đầy đủ/tương đối đầy đủ], phục vụ tốt cho công tác giảng dạy.<br>- Đội ngũ giáo viên: [Mô tả đặc điểm đội ngũ: ví dụ: tâm huyết, đoàn kết, có kinh nghiệm, tích cực học hỏi...].<br>- [Số lượng] lớp học theo chương trình Tiếng Anh [loại hình: tăng cường/tích hợp/đề án], tạo điều kiện thuận lợi cho việc phân hóa đối tượng học sinh.<br>- Đặc điểm học sinh: [Mô tả đặc điểm tích cực của học sinh: ví dụ: ngoan, lễ phép, tích cực tham gia hoạt động...].<br>- Sự phối hợp giữa nhà trường và phụ huynh: [Mô tả mức độ phối hợp: ví dụ: chặt chẽ, thường xuyên quan tâm đến tình hình học tập của học sinh].<br><br><b>3.2. Khó khăn:</b><br>- Đặc điểm học sinh: [Mô tả các hạn chế của học sinh: ví dụ: còn nhút nhát, tiếp thu bài chậm, ý thức tự giác chưa cao...], gây khó khăn trong việc triển khai các hoạt động dạy học tích cực.<br>- Sự phối hợp của phụ huynh: [Mô tả các hạn chế trong phối hợp: ví dụ: ít quan tâm, chưa thường xuyên liên lạc...], đặc biệt trong việc quản lý học tập tại nhà.<br>- Kinh nghiệm giáo viên: [Mô tả các hạn chế về kinh nghiệm: ví dụ: giáo viên trẻ còn thiếu kinh nghiệm quản lý lớp, xử lý tình huống sư phạm...].<br>- Việc vận dụng phương pháp dạy học mới: [Mô tả các khó khăn khi vận dụng phương pháp: ví dụ: sĩ số lớp đông, thời lượng tiết học hạn chế, thiếu tài liệu bổ trợ...].' }, order: 6 },
        
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 2, text: 'III. KẾ HOẠCH GIÁO DỤC NĂM HỌC 2025 - 2026' }, order: 7 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'Chủ đề năm học', content: { html: '<i>(Ghi rõ chủ đề năm học nếu có)</i>' }, order: 8 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '1. Mục tiêu dạy học môn tiếng Anh', content: { html: '<b>1.1. Mục tiêu chung:</b><br>- Giúp học sinh hình thành và phát triển năng lực giao tiếp thông qua rèn luyện các kỹ năng: [Liệt kê các kỹ năng: Nghe, Nói, Đọc, Viết] và kiến thức ngôn ngữ: [Liệt kê kiến thức ngôn ngữ: Ngữ âm, Từ vựng, Ngữ pháp].<br>- Hướng tới mục tiêu đạt [Bậc năng lực cụ thể: ví dụ: Bậc 3] khi kết thúc [Cấp học: ví dụ: cấp Tiểu học/THPT] theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam.<br>- Giúp học sinh hiểu biết khái quát về đất nước, con người và nền văn hóa của các quốc gia nói tiếng Anh.<br>- [Mô tả mục tiêu đặc thù cho các khối lớp nhỏ: ví dụ: Đối với lớp 1, 2: Làm quen, khám phá, tạo niềm yêu thích đối với môn học].<br><br><b>1.2. Mục tiêu cụ thể:</b><br>- [Mô tả mục tiêu cụ thể cho từng khối lớp hoặc nhóm khối lớp: ví dụ: Giúp học sinh lớp 1, 2 bước đầu tiếp xúc tiếng Anh, chuẩn bị tâm thế học tập; Giúp học sinh lớp 3, 4, 5 phát triển toàn diện kỹ năng giao tiếp, hợp tác, làm việc nhóm, phẩm chất và giá trị đạo đức].<br>- [Mô tả các mục tiêu về thái độ: ví dụ: Nuôi dưỡng tình yêu học tiếng Anh, tinh thần tự hào về văn hóa Việt Nam].' }, order: 9 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '2. Yêu cầu cần đạt', content: { html: '<b>2.1. Năng lực chung và phẩm chất:</b><br>- Năng lực: [Liệt kê các năng lực chung: ví dụ: năng lực giao tiếp, hợp tác, tự phục vụ, tự quản, tự học, giải quyết vấn đề].<br>- Phẩm chất: [Liệt kê các phẩm chất: ví dụ: chăm học, chăm làm, tự tin, trách nhiệm, trung thực, kỉ luật, đoàn kết, yêu thương].<br><br><b>2.2. Năng lực đặc thù môn Tiếng Anh:</b><br>- [Mô tả yêu cầu đạt được về 4 kỹ năng: Nghe, Nói, Đọc, Viết].<br>- [Mô tả yêu cầu về kiến thức ngôn ngữ: Ngữ âm, Từ vựng, Ngữ pháp].<br><br><b>2.3. Yêu cầu cần đạt theo khối lớp:</b><br>- Khối lớp [Số khối]: [Mô tả cụ thể yêu cầu cần đạt về kỹ năng, kiến thức cho khối lớp này].<br>- Khối lớp [Số khối]: [Mô tả cụ thể yêu cầu cần đạt về kỹ năng, kiến thức cho khối lớp này].<br>- [Tiếp tục bổ sung cho các khối lớp còn lại].' }, order: 10 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '3. Phương pháp dạy và học', content: { html: '<b>3.1. Đối với giáo viên:</b><br>- Vai trò: [Mô tả vai trò của giáo viên: ví dụ: người tổ chức, hướng dẫn, tạo môi trường học tập].<br>- Các phương pháp chủ đạo: [Liệt kê các phương pháp: ví dụ: Đường hướng giao tiếp, Hồi đáp phi ngôn ngữ (TPR), Học tập trải nghiệm, Học tập dựa trên nhiệm vụ/dự án...].<br>- Hình thức tổ chức: [Mô tả các hình thức: ví dụ: trò chơi, bài hát, kể chuyện, ứng dụng công nghệ thông tin...].<br>- Nguyên tắc giảng dạy: [Mô tả nguyên tắc: ví dụ: tôn trọng giai đoạn "Silent Period", không dạy kiến thức tách rời ngữ cảnh, khuyến khích và biểu dương học sinh].<br><br><b>3.2. Đối với học sinh:</b><br>- Vai trò: [Mô tả vai trò của học sinh: ví dụ: chủ thể tham gia tích cực, trải nghiệm ngôn ngữ].<br>- Hình thức học tập: [Mô tả hình thức học: ví dụ: học qua trò chơi, bài hát, bài vè, kể chuyện...].<br>- Phát triển kỹ năng: [Mô tả lộ trình phát triển kỹ năng: ví dụ: ưu tiên nghe hiểu, phản hồi phi ngôn ngữ trước khi nói, tương tác cá nhân/nhóm/cả lớp].<br>- Thái độ học tập: [Mô tả cách duy trì hứng thú: ví dụ: được khích lệ, tạo cơ hội trải nghiệm, tiếp cận công nghệ].' }, order: 11 },
        
        { id: crypto.randomUUID(), type: BlockType.LEARNING_RESOURCES, title: '4. Tài liệu và thời lượng giáo dục', content: { text: '4.1. Nguồn học liệu:\n- Sách giáo khoa: [Liệt kê tên bộ sách giáo khoa được Bộ GD&ĐT thẩm định].\n- Tài liệu bổ trợ: [Liệt kê tài liệu bổ trợ: ví dụ: sách bài tập, tài liệu ôn thi chứng chỉ quốc tế...].\n- Phần mềm/Học liệu điện tử: [Liệt kê các phần mềm, website, học liệu điện tử sử dụng].\n\n4.2. Thời lượng giáo dục (số tiết/tuần):\n- Đối với khối lớp [Số khối]: [Số tiết]/tuần. Phân phối: [Mô tả chi tiết phân phối tiết: ví dụ: Tiết 1,2: Chương trình chính khóa; Tiết 3,4: Toán/Khoa học; Tiết 5,6: Ôn luyện...].\n- Đối với khối lớp [Số khối]: [Số tiết]/tuần. Phân phối: [Mô tả chi tiết phân phối tiết].' }, order: 12 },
        { id: crypto.randomUUID(), type: BlockType.TEACHING_EQUIPMENT, title: '5. Thiết bị dạy học', content: { equipment: '5.1. Thiết bị dạy học:\n- [Liệt kê các thiết bị hiện có tại các lớp: ví dụ: Máy chiếu, bảng tương tác, TV, máy tính, loa, tranh ảnh, đồ dùng dạy học...].\n- [Mô tả tình trạng sử dụng: ví dụ: Đảm bảo hoạt động tốt, đáp ứng nhu cầu giảng dạy].' }, order: 13 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '6. Nội dung kế hoạch dạy học', content: { html: '<i>Mô tả khái quát tiến độ thực hiện chương trình theo tuần/tháng. (Ví dụ: Tuần 1 làm quen, Tuần 2-35 thực hiện chương trình...). Chi tiết xem tại Phụ lục Kế hoạch dạy học.</i>' }, order: 14 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '6. Đánh giá học sinh', content: { html: '<i>Mô tả hình thức, phương pháp đánh giá thường xuyên và định kỳ theo quy định (Thông tư 27, Thông tư 22...). Các bài kiểm tra, hình thức khen thưởng...</i>' }, order: 14 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '7. Các hoạt động giáo dục khác', content: { html: '<i>Kế hoạch tổ chức các hoạt động ngoại khóa, câu lạc bộ, lễ hội (Halloween, Giáng sinh...), giao lưu tiếng Anh, Open House...</i>' }, order: 15 },
        
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 3, text: '1. Tham dự và thực hiện chuyên đề' }, order: 16 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '', content: { html: '- Kế hoạch tham dự chuyên đề cấp Quận, Thành phố...<br>- Kế hoạch thao giảng, chuyên đề cấp trường...' }, order: 17 },
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 3, text: '2. Sinh hoạt chuyên môn và dự giờ thăm lớp' }, order: 18 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '', content: { html: '- Lịch sinh hoạt chuyên môn, quy định dự giờ...' }, order: 19 },
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 3, text: '3. Hoạt động giúp đỡ giáo viên' }, order: 20 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '', content: { html: '- [Mô tả các hoạt động giúp đỡ, hỗ trợ giáo viên trong tổ...]' }, order: 21 },
        { id: crypto.randomUUID(), type: BlockType.HEADING, title: '', content: { level: 3, text: '4. Hướng dẫn về việc sử dụng hồ sơ sổ sách điện tử' }, order: 22 },
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: '', content: { html: '- [Hướng dẫn sử dụng, quy định về hồ sơ sổ sách điện tử...]' }, order: 23 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'V. CÁC CHỈ TIÊU PHẤN ĐẤU TRONG NĂM HỌC 2025 - 2026', content: { html: '<b>1/ Giáo viên:</b><br><i>- Chỉ tiêu Chiến sĩ thi đua, Lao động tiên tiến...</i><br><br><b>2/ Học sinh:</b><br><i>- Tỷ lệ hoàn thành chương trình, chứng chỉ quốc tế...</i>' }, order: 17 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'VI. TỔ CHỨC THỰC HIỆN', content: { html: '<b>1. Trách nhiệm của tổ trưởng tổ chuyên môn</b><br><i>...</i><br><br><b>2. Trách nhiệm của các thành viên trong khối</b><br><i>...</i>' }, order: 18 },
        
        { id: crypto.randomUUID(), type: BlockType.TEXT, title: 'PHỤ LỤC', content: { html: '<b>1. Lịch công tác tháng</b><br><i>(Chi tiết xem bảng đính kèm)</i><br><br><b>2. Các kế hoạch giáo dục tập thể</b><br><i>(Chi tiết xem bảng đính kèm)</i>' }, order: 19 },
        { id: crypto.randomUUID(), type: BlockType.SUBJECT_PLAN, title: 'Phụ lục 2. Kế hoạch dạy học các môn học', content: { subjectIds: [] }, order: 20 }
      ];
    }
    
    setBlocks(templateBlocks);
  };

  const renderStep1 = () => (
    <div className="space-y-8 pb-20">
      {/* Hướng dẫn bước 1 */}
      <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-start gap-4">
        <div className="p-3 bg-white/20 rounded-2xl">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-black text-lg">Bước 1/5: Khai báo thông tin chung</h4>
          <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
            Tại bước này, bạn cần nhập các thông tin hành chính của trường và cấu hình nhân sự thực hiện ký duyệt hồ sơ. Các thông tin về đặc điểm tình hình sẽ được thiết lập linh hoạt bằng các "Khối nội dung" ở Bước 3.
          </p>
        </div>
      </div>

      {/* Thông tin hành chính */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
            <Info className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Thông tin hành chính</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Cấu hình các thông tin cơ bản hiển thị trên đầu văn bản</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cơ quan chủ quản</label>
            <input 
              type="text" 
              placeholder="VD: Ủy ban nhân dân Phường Tân Mỹ"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              value={data.departmentName}
              onChange={(e) => setData({ ...data, departmentName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tên trường</label>
            <input 
              type="text" 
              placeholder="VD: Trường Tiểu học Lê Văn Tám"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              value={data.schoolName}
              onChange={(e) => setData({ ...data, schoolName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Địa danh</label>
            <input 
              type="text" 
              placeholder="VD: Tân Mỹ"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              value={data.location}
              onChange={(e) => setData({ ...data, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Ngày ban hành</label>
            <input 
              type="text" 
              placeholder="VD: ngày 10 tháng 9 năm 2025"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {subjectGroupName ? 'Tổ bộ môn' : 'Khối lớp'}
            </label>
            {subjectGroupName ? (
              <input 
                type="text" 
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
                value={`Tổ ${subjectGroupName}`}
                readOnly
              />
            ) : (
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  value={data.gradeLevel}
                  onChange={(e) => setData({ ...data, gradeLevel: e.target.value })}
                >
                  <option value="" disabled>Chọn khối lớp</option>
                  <option value="Khối 1">Khối lớp 1</option>
                  <option value="Khối 2">Khối lớp 2</option>
                  <option value="Khối 3">Khối lớp 3</option>
                  <option value="Khối 4">Khối lớp 4</option>
                  <option value="Khối 5">Khối lớp 5</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Năm học</label>
            <input 
              type="text" 
              readOnly
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 cursor-not-allowed"
              value={data.year}
            />
          </div>
        </div>
      </section>

      {/* Cấu hình nhân sự ký duyệt */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Cấu hình nhân sự ký duyệt</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Thiết lập thông tin người ký và chức danh hiển thị cuối văn bản</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tổ trưởng */}
          <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Người lập kế hoạch (Tổ trưởng)</label>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Họ và tên Tổ trưởng</label>
              <input 
                type="text" 
                placeholder="VD: Nguyễn Mai Lan Anh"
                className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                value={data.headTeacherName}
                onChange={(e) => setData({ ...data, headTeacherName: e.target.value })}
              />
            </div>
          </div>

          {/* Ban giám hiệu */}
          <div className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-pink-500 rounded-full" />
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Người phê duyệt (Ban giám hiệu)</label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Chức danh ký</label>
                <div className="relative">
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-pink-500 transition-all appearance-none cursor-pointer shadow-sm"
                    value={data.principalTitleType}
                    onChange={(e) => setData({ ...data, principalTitleType: e.target.value as 'principal' | 'vice-principal' })}
                  >
                    <option value="principal">Hiệu trưởng</option>
                    <option value="vice-principal">Phó Hiệu trưởng</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Họ và tên người ký</label>
                <input 
                  type="text" 
                  placeholder="VD: Trần Duy Thị Bảo Tuyền"
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-pink-500 transition-all shadow-sm"
                  value={data.principalName}
                  onChange={(e) => setData({ ...data, principalName: e.target.value })}
                />
              </div>
            </div>

            {data.principalTitleType === 'vice-principal' && (
              <div className="flex gap-2 items-start p-3 bg-pink-50 rounded-xl border border-pink-100">
                <Info className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-pink-700 font-medium leading-relaxed">
                  Khi chọn <strong>Phó Hiệu trưởng</strong>, tiêu đề ký sẽ tự động hiển thị là <strong>KT. HIỆU TRƯỞNG / PHÓ HIỆU TRƯỞNG</strong> theo đúng quy định hành chính.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );

  const renderStep2 = () => {
    return (
      <div className="space-y-8 pb-20">
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg">Bước 2/5: Hợp nhất môn học</h4>
            <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
              Chọn và sắp xếp thứ tự các môn học sẽ xuất hiện trong kế hoạch tổng thể.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Available Subjects */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-6">Danh sách môn học khả dụng</h3>
            
            {filteredAvailableSubjects.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-bold">Không có môn học nào khả dụng.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAvailableSubjects.map(subject => {
                  const isSelected = selectedSubjectIds.includes(subject.id);
                  return (
                    <div 
                      key={subject.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSubjectIds(prev => prev.filter(id => id !== subject.id));
                        } else {
                          setSelectedSubjectIds(prev => [...prev, subject.id]);
                        }
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-indigo-50 border-indigo-500 shadow-md opacity-50' 
                          : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            {subject.grade ? `Khối ${subject.grade}` : 'Môn học'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-700">{subject.name}</h4>
                      </div>
                      {isSelected ? (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Subjects & Ordering */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span>Môn học đã chọn</span>
                <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-lg text-xs">{selectedSubjectIds.length}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Sử dụng mũi tên <span className="font-bold text-indigo-600">Lên/Xuống</span> để sắp xếp thứ tự ưu tiên của các môn học trong kế hoạch.
              </p>
            </div>
            
            {selectedSubjectIds.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-400 font-bold text-sm">Chưa chọn môn học nào.</p>
                <p className="text-slate-400 text-xs mt-1">Chọn môn học từ danh sách bên trái.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedSubjectIds.map((id, index) => {
                  const subject = filteredAvailableSubjects.find(s => s.id === id);
                  if (!subject) return null;
                  return (
                    <motion.div 
                      layout
                      key={id}
                      className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50 flex items-center gap-4 group"
                    >
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (index > 0) {
                              const newIds = [...selectedSubjectIds];
                              [newIds[index - 1], newIds[index]] = [newIds[index], newIds[index - 1]];
                              setSelectedSubjectIds(newIds);
                            }
                          }}
                          disabled={index === 0}
                          className="p-1 bg-white border border-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <ChevronUp className="w-4 h-4 stroke-[3]" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (index < selectedSubjectIds.length - 1) {
                              const newIds = [...selectedSubjectIds];
                              [newIds[index], newIds[index + 1]] = [newIds[index + 1], newIds[index]];
                              setSelectedSubjectIds(newIds);
                            }
                          }}
                          disabled={index === selectedSubjectIds.length - 1}
                          className="p-1 bg-white border border-indigo-100 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-indigo-600 transition-all shadow-sm"
                        >
                          <ChevronDown className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-indigo-900">{subject.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase text-indigo-500 bg-white px-2 py-0.5 rounded-md border border-indigo-100">
                            {subject.grade ? `Khối ${subject.grade}` : 'Môn học'}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            subject.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                            subject.status === 'needs_sync' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {subject.status === 'completed' ? 'Sẵn sàng' :
                             subject.status === 'needs_sync' ? 'Cần đồng bộ' : 'Đang soạn thảo'}
                          </span>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubjectIds(prev => prev.filter(sid => sid !== id));
                        }}
                        className="p-2 text-indigo-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-8 pb-20">
        {/* Hướng dẫn bước 3 */}
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg">Bước 3/5: Thiết kế cấu trúc hồ sơ</h4>
            <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
              Sử dụng các "Khối nội dung" (Content Blocks) để lắp ghép bố cục cho bản kế hoạch. Bạn có thể thêm văn bản, bảng số liệu, danh mục hoặc chèn kế hoạch môn học từ Bước 1.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          {/* Left: Block Toolbox */}
          <aside className={`transition-all duration-300 ease-in-out flex-shrink-0 space-y-6 ${isSidebarCollapsed ? 'w-full lg:w-20' : 'w-full lg:w-1/4'}`}>
            <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm sticky top-24 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'p-3' : 'p-6'}`}>
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-4' : 'justify-between mb-4'}`}>
                {!isSidebarCollapsed && <h4 className="text-sm font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">Thành phần cơ bản</h4>}
                <button 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all animate-pulse ring-2 ring-indigo-300 ring-offset-2"
                  title={isSidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                >
                  {isSidebarCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
              </div>

              <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                <p className="text-[11px] text-slate-500 font-bold mb-6 bg-slate-50 p-3 rounded-xl text-center leading-tight">
                  Nhấn chọn hoặc kéo thả khối nội dung vào bên phải để soạn thảo
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button onClick={() => addBlock(BlockType.HEADING, 1)} className="p-3 bg-white border border-slate-100 hover:border-blue-200 rounded-xl shadow-sm text-center font-bold text-slate-700 hover:bg-blue-50 transition-all">Tiêu đề lớn</button>
                  <button onClick={() => addBlock(BlockType.HEADING, 2)} className="p-3 bg-white border border-slate-100 hover:border-blue-200 rounded-xl shadow-sm text-center font-bold text-slate-700 hover:bg-blue-50 transition-all">Tiêu đề vừa</button>
                  <button onClick={() => addBlock(BlockType.HEADING, 3)} className="p-3 bg-white border border-slate-100 hover:border-blue-200 rounded-xl shadow-sm text-center font-bold text-slate-700 hover:bg-blue-50 transition-all">Tiêu đề nhỏ</button>
                  <button onClick={() => addBlock(BlockType.IMAGE)} className="p-3 bg-white border border-slate-100 hover:border-blue-200 rounded-xl shadow-sm text-center font-bold text-slate-700 hover:bg-blue-50 transition-all">Hình ảnh</button>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <div 
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('blockType', BlockType.TEXT)}
                    onClick={() => addBlock(BlockType.TEXT)}
                    className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-2xl transition-all group w-full cursor-grab active:cursor-grabbing border border-slate-100 hover:border-blue-200 shadow-sm"
                  >
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">Văn bản</div>
                      <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Dùng để viết nội dung, đoạn văn, hướng dẫn.</div>
                    </div>
                  </div>

                  <div 
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('blockType', BlockType.TABLE)}
                    onClick={() => addBlock(BlockType.TABLE)}
                    className="flex items-center gap-4 p-4 bg-white hover:bg-emerald-50 rounded-2xl transition-all group w-full cursor-grab active:cursor-grabbing border border-slate-100 hover:border-emerald-200 shadow-sm"
                  >
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                      <LayoutGrid className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">Bảng số liệu</div>
                      <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Dùng để trình bày dữ liệu dạng bảng.</div>
                    </div>
                  </div>

                  <div 
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('blockType', BlockType.CHECKLIST)}
                    onClick={() => addBlock(BlockType.CHECKLIST)}
                    className="flex items-center gap-4 p-4 bg-white hover:bg-amber-50 rounded-2xl transition-all group w-full cursor-grab active:cursor-grabbing border border-slate-100 hover:border-amber-200 shadow-sm"
                  >
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                      <CheckSquare className="w-6 h-6" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-black text-slate-800 truncate">Danh mục</div>
                      <div className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Dùng để liệt kê các đầu việc, yêu cầu.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsed View Icons */}
              {isSidebarCollapsed && (
                <div className="flex flex-col gap-4 items-center animate-in fade-in zoom-in duration-300">
                  <button onClick={() => addBlock(BlockType.HEADING, 1)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-700 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Tiêu đề lớn"><span className="font-black text-xs">H1</span></button>
                  <button onClick={() => addBlock(BlockType.HEADING, 2)} className="p-2 hover:bg-blue-50 rounded-lg text-slate-700 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Tiêu đề vừa"><span className="font-black text-xs">H2</span></button>
                  <button onClick={() => addBlock(BlockType.TEXT)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Văn bản"><FileText className="w-5 h-5" /></button>
                  <button onClick={() => addBlock(BlockType.TABLE)} className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Bảng số liệu"><LayoutGrid className="w-5 h-5" /></button>
                  <button onClick={() => addBlock(BlockType.CHECKLIST)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Danh mục"><CheckSquare className="w-5 h-5" /></button>
                  <button onClick={() => addBlock(BlockType.IMAGE)} className="p-2 hover:bg-purple-50 rounded-lg text-purple-600 w-10 h-10 flex items-center justify-center border border-slate-200 shadow-sm" title="Hình ảnh"><span className="font-black text-xs">IMG</span></button>
                </div>
              )}
            </div>
          </aside>

          {/* Right: Block Canvas */}
          <main className="flex-1 space-y-6 min-w-0 w-full">
            {blocks.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-indigo-600" />
                <p className="text-xs text-indigo-800 font-medium">
                  Mẹo: Bạn có thể nhấn vào các mũi tên <span className="font-black text-indigo-600">Lên/Xuống</span> đậm ở bên trái mỗi khối để sắp xếp lại thứ tự hiển thị.
                </p>
              </div>
            )}
            {blocks.length === 0 ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Plus className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-xl font-black text-slate-400">Chưa có thành phần nào</h4>
                <p className="text-slate-400 mt-2 mb-8">Hãy chọn các khối nội dung từ menu bên trái để bắt đầu lắp ghép.</p>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="h-[1px] w-32 bg-slate-200" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hoặc sử dụng mẫu đề xuất</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {!subjectGroupName ? (
                      <button 
                        onClick={() => applyTemplate('grade')}
                        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        Mẫu Kế hoạch Tổ
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => applyTemplate('english')}
                          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          Mẫu Kế hoạch Tổ Tiếng Anh
                        </button>
                        <button 
                          onClick={() => applyTemplate('subject_group', 'Tổ Năng khiếu')}
                          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          Mẫu Kế hoạch Tổ Năng khiếu
                        </button>
                        <button 
                          onClick={() => applyTemplate('subject_group', 'Tổ Tin học - Công nghệ')}
                          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          Mẫu Kế hoạch Tổ Tin học - Công nghệ
                        </button>
                        <button 
                          onClick={() => applyTemplate('subject_group', 'Tổ Giáo dục thể chất')}
                          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                        >
                          Mẫu Kế hoạch Tổ Giáo dục thể chất
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Reorder.Group axis="y" values={blocks} onReorder={setBlocks} className="space-y-6">
                {blocks.map((block, index) => (
                  <Reorder.Item 
                    key={block.id}
                    value={block}
                    className={block.type === BlockType.HEADING 
                      ? "bg-transparent" 
                      : "bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group cursor-grab active:cursor-grabbing"}
                  >
                    {/* Block Header */}
                    {block.type !== BlockType.HEADING && (
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex flex-col gap-1">
                            <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="text-blue-500 hover:text-blue-700 disabled:opacity-30 p-1 hover:bg-blue-50 rounded-lg transition-all">
                              <ChevronUp className="w-6 h-6 stroke-[3]" />
                            </button>
                            <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="text-blue-500 hover:text-blue-700 disabled:opacity-30 p-1 hover:bg-blue-50 rounded-lg transition-all">
                              <ChevronDown className="w-6 h-6 stroke-[3]" />
                            </button>
                          </div>
                          <div className="flex flex-col w-full gap-1">
                            <textarea 
                              value={block.title}
                              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                              className="bg-transparent border-none font-black text-slate-800 focus:ring-0 p-0 text-lg w-full resize-none overflow-hidden"
                              placeholder="Nhập tiêu đề mục..."
                              rows={1}
                              onInput={(e) => {
                                e.currentTarget.style.height = 'auto';
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                              }}
                              style={{ height: 'auto' }}
                            />
                            <span className="text-[11px] text-blue-600 font-bold italic">Nhấn vào tiêu đề để chỉnh sửa</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeBlock(block.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Block Content Editor */}
                    <div className={block.type === BlockType.TABLE ? "p-0" : "p-2 sm:p-4"}>
                      {block.type === BlockType.HEADING && (
                        <div
                          className="flex items-center gap-2 group cursor-grab active:cursor-grabbing -my-4"
                        >
                          <div className="flex flex-col">
                            <button onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="text-slate-600 hover:text-blue-700 disabled:opacity-30 p-1 hover:bg-blue-50 rounded-lg transition-all">
                              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                            </button>
                            <button onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="text-slate-600 hover:text-blue-700 disabled:opacity-30 p-1 hover:bg-blue-50 rounded-lg transition-all">
                              <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                            </button>
                          </div>
                          {(() => {
                            const Tag = block.content.level === 1 ? 'h1' : block.content.level === 2 ? 'h2' : 'h3';
                            const styles = {
                              h1: 'text-4xl font-extrabold text-slate-900',
                              h2: 'text-2xl font-bold text-slate-800',
                              h3: 'text-xl font-semibold text-slate-700'
                            };
                            const placeholders = {
                              h1: 'Nhập tiêu đề lớn...',
                              h2: 'Nhập tiêu đề vừa...',
                              h3: 'Nhập tiêu đề nhỏ...'
                            };
                            return (
                              <Tag className="w-full">
                                <input 
                                  type="text"
                                  className={`w-full bg-transparent border-none p-2 ${styles[Tag]} placeholder-slate-400`}
                                  placeholder={placeholders[Tag]}
                                  value={block.content.text}
                                  onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
                                />
                              </Tag>
                            );
                          })()}
                          <button 
                            onClick={() => removeBlock(block.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {block.type === BlockType.IMAGE && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tải lên hình ảnh</label>
                            <input 
                              type="file"
                              accept="image/*"
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    updateBlock(block.id, { content: { ...block.content, url: reader.result as string } });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                          {block.content.url && (
                            <div className="mt-4">
                              <img 
                                src={block.content.url} 
                                alt={block.content.caption || 'Hình ảnh'} 
                                className="max-w-full h-auto rounded-2xl shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <input 
                                type="text"
                                className="w-full mt-2 bg-transparent border-none text-sm text-slate-500 italic text-center"
                                placeholder="Nhập chú thích ảnh (tùy chọn)..."
                                value={block.content.caption}
                                onChange={(e) => updateBlock(block.id, { content: { ...block.content, caption: e.target.value } })}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {block.type === BlockType.TEXT && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 italic">Nhập nội dung văn bản chi tiết cho mục này. Hỗ trợ định dạng xuống dòng và bảng biểu.</p>
                          <div 
                            className="w-full min-h-[150px] p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all text-slate-700 font-medium overflow-auto [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-slate-300 [&_th]:border [&_th]:border-slate-300 [&_th]:p-2 [&_th]:bg-slate-100 [&_td]:border [&_td]:border-slate-300 [&_td]:p-2"
                            contentEditable
                            suppressContentEditableWarning
                            dangerouslySetInnerHTML={{ __html: block.content.html }}
                            onBlur={(e) => updateBlock(block.id, { content: { ...block.content, html: e.currentTarget.innerHTML } })}
                          />
                        </div>
                      )}

                      {block.type === BlockType.SUBJECT_PLAN && (
                        <div className="space-y-6">
                          <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-black text-indigo-900">Danh sách môn học đã chọn</h4>
                                <p className="text-xs text-indigo-600 font-medium">Được đồng bộ từ Bước 2 - Các môn học này sẽ được tự động tạo bảng kế hoạch chi tiết.</p>
                              </div>
                            </div>
                            
                            {(block.content.subjectIds.length > 0 ? block.content.subjectIds : selectedSubjectIds).length === 0 ? (
                              <p className="text-sm text-slate-500 italic text-center py-4 border-2 border-dashed border-indigo-200 rounded-xl bg-white/50">
                                Chưa có môn học nào được chọn ở Bước 2.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(block.content.subjectIds.length > 0 ? block.content.subjectIds : selectedSubjectIds).map((id: string) => {
                                  const subject = availableSubjects.find(s => s.id === id);
                                  return (
                                    <div key={id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      <span className="text-sm font-bold text-slate-700 truncate">{subject?.name}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-slate-400" />
                            <p className="text-xs text-slate-500 font-medium">
                              Hệ thống sẽ tự động trích xuất Phụ lục 2 của các môn học trên và chèn vào vị trí này trong file PDF tổng.
                            </p>
                          </div>
                        </div>
                      )}

                      {block.type === BlockType.TABLE && (
                        <div className="space-y-4">
                          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100">
                                {block.content.headerRows ? (
                                  block.content.headerRows.map((row: TableHeaderCell[], rowIndex: number) => (
                                    <tr key={rowIndex}>
                                      {row.map((cell: TableHeaderCell, cellIndex: number) => (
                                        <th
                                          key={cellIndex}
                                          rowSpan={cell.rowSpan}
                                          colSpan={cell.colSpan}
                                          className="p-1 font-black text-slate-600 uppercase text-[11px] tracking-widest border-r border-b border-slate-200 text-center"
                                          style={{ width: cell.width }}
                                        >
                                          {cell.text}
                                        </th>
                                      ))}
                                      {rowIndex === 0 && (
                                        <th rowSpan={block.content.headerRows.length} className="w-12 bg-slate-100 border-l border-slate-200"></th>
                                      )}
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    {block.content.columns.map((col: TableColumn) => {
                                      const headerText = col.header.toLowerCase();
                                      const isNumericCol = headerText.includes('số lượng') || 
                                                         headerText.includes('phân phối') || 
                                                         headerText.includes('tiết') || 
                                                         headerText.includes('tt') ||
                                                         headerText.includes('stt');
                                      
                                      return (
                                        <th key={col.id} className="p-1 font-black text-slate-600 uppercase text-[11px] tracking-widest border-r border-slate-200 text-left">
                                          <textarea 
                                            value={col.header} 
                                            onChange={(e) => {
                                              const newColumns = block.content.columns.map((c: TableColumn) => c.id === col.id ? { ...c, header: e.target.value } : c);
                                              updateBlock(block.id, { content: { ...block.content, columns: newColumns } });
                                            }}
                                            ref={(el) => {
                                              if (el) {
                                                el.style.height = 'auto';
                                                el.style.height = el.scrollHeight + 'px';
                                              }
                                            }}
                                            onInput={(e) => {
                                              const target = e.target as HTMLTextAreaElement;
                                              target.style.height = 'auto';
                                              target.style.height = target.scrollHeight + 'px';
                                            }}
                                            className="bg-transparent border-none focus:ring-0 p-0 w-full font-black uppercase text-[11px] tracking-widest text-slate-700 placeholder-slate-400 resize-none overflow-hidden text-left"
                                            placeholder="TÊN CỘT"
                                            rows={1}
                                          />
                                        </th>
                                      );
                                    })}
                                    <th className="w-12 bg-slate-100 border-l border-slate-200"></th>
                                  </tr>
                                )}
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {block.content.rows.length === 0 ? (
                                  <tr>
                                    <td colSpan={block.content.columns.length + 1} className="px-4 py-8 text-center text-slate-400 text-xs font-bold italic">
                                      Bảng chưa có dữ liệu. Nhấn "Thêm dòng mới" để bắt đầu.
                                    </td>
                                  </tr>
                                ) : (
                                  block.content.rows.map((row: any, rIndex: number) => (
                                    <tr key={rIndex} className="hover:bg-slate-50 transition-colors">
                                      {block.content.columns.map((col: TableColumn) => {
                                        const headerText = col.header.toLowerCase();
                                        const isNumericCol = headerText.includes('số lượng') || 
                                                           headerText.includes('phân phối') || 
                                                           headerText.includes('tiết') || 
                                                           headerText.includes('tt') ||
                                                           headerText.includes('stt');

                                        return (
                                          <td key={col.id} className="px-1 py-1 border-r border-slate-100 text-center">
                                            <textarea 
                                              value={row[col.id] || ''} 
                                              onChange={(e) => {
                                                const newRows = [...block.content.rows];
                                                newRows[rIndex] = { ...newRows[rIndex], [col.id]: e.target.value };
                                                updateBlock(block.id, { content: { ...block.content, rows: newRows } });
                                              }}
                                              ref={(el) => {
                                                if (el) {
                                                  el.style.height = 'auto';
                                                  el.style.height = el.scrollHeight + 'px';
                                                }
                                              }}
                                              onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = target.scrollHeight + 'px';
                                              }}
                                              className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-700 placeholder-slate-300 resize-none overflow-hidden text-center"
                                              placeholder=""
                                              rows={1}
                                            />
                                          </td>
                                        );
                                      })}
                                      <td className="px-2 text-center bg-slate-50/30">
                                        <button 
                                          onClick={() => {
                                            const newRows = block.content.rows.filter((_: any, i: number) => i !== rIndex);
                                            updateBlock(block.id, { content: { ...block.content, rows: newRows } });
                                          }}
                                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                          title="Xóa dòng"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-center pt-4">
                            <button 
                              onClick={() => {
                                const newRow = block.content.columns.reduce((acc: any, col: TableColumn) => ({ ...acc, [col.id]: '' }), {});
                                updateBlock(block.id, { content: { ...block.content, rows: [...block.content.rows, newRow] } });
                              }}
                              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-black text-sm"
                            >
                              <Plus className="w-5 h-5" />
                              Thêm dòng mới
                            </button>
                          </div>
                        </div>
                      )}

                      {block.type === BlockType.CHECKLIST && (
                        <div className="space-y-3">
                          <p className="text-xs text-slate-500 italic">Danh sách kiểm tra các hạng mục công việc hoặc thiết bị.</p>
                          {block.content.items.map((item: ChecklistItem, iIndex: number) => (
                            <div key={item.id} className="flex items-center gap-3 group/item">
                              <input 
                                type="checkbox" 
                                checked={item.checked}
                                onChange={(e) => {
                                  const newItems = [...block.content.items];
                                  newItems[iIndex] = { ...newItems[iIndex], checked: e.target.checked };
                                  updateBlock(block.id, { content: { ...block.content, items: newItems } });
                                }}
                                className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500"
                              />
                              <textarea 
                                value={item.label}
                                onChange={(e) => {
                                  const newItems = [...block.content.items];
                                  newItems[iIndex] = { ...newItems[iIndex], label: e.target.value };
                                  updateBlock(block.id, { content: { ...block.content, items: newItems } });
                                }}
                                ref={(el) => {
                                  if (el) {
                                    el.style.height = 'auto';
                                    el.style.height = el.scrollHeight + 'px';
                                  }
                                }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-slate-700 font-medium placeholder-slate-300 resize-none overflow-hidden"
                                placeholder="Nhập nội dung công việc/thiết bị..."
                                rows={1}
                              />
                              <button 
                                onClick={() => {
                                  const newItems = block.content.items.filter((_: any, i: number) => i !== iIndex);
                                  updateBlock(block.id, { content: { ...block.content, items: newItems } });
                                }}
                                className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              const newItem = { id: `i-${crypto.randomUUID()}`, label: '', checked: false };
                              updateBlock(block.id, { content: { ...block.content, items: [...block.content.items, newItem] } });
                            }}
                            className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                          >
                            <Plus className="w-4 h-4" /> Thêm mục mới
                          </button>
                        </div>
                      )}


                      {block.type === BlockType.GROUNDS && (
                        <div className="space-y-4">
                          <p className="text-xs text-slate-500 italic">Liệt kê các văn bản pháp lý, thông tư, hướng dẫn làm căn cứ xây dựng kế hoạch.</p>
                          {block.content.grounds.map((ground: string, gIndex: number) => (
                            <div key={gIndex} className="flex gap-3">
                              <textarea 
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all min-h-[80px]"
                                placeholder="Ví dụ: Căn cứ Thông tư số 32/2018/TT-BGDĐT..."
                                value={ground}
                                onChange={(e) => {
                                  const newGrounds = [...block.content.grounds];
                                  newGrounds[gIndex] = e.target.value;
                                  updateBlock(block.id, { content: { ...block.content, grounds: newGrounds } });
                                }}
                              />
                              <button 
                                onClick={() => {
                                  const newGrounds = block.content.grounds.filter((_: any, i: number) => i !== gIndex);
                                  updateBlock(block.id, { content: { ...block.content, grounds: newGrounds } });
                                }}
                                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors self-start"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => {
                              updateBlock(block.id, { content: { ...block.content, grounds: [...block.content.grounds, ''] } });
                            }}
                            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all w-full"
                          >
                            <Plus className="w-5 h-5" /> Thêm căn cứ mới
                          </button>
                        </div>
                      )}

                      {block.type === BlockType.STUDENT_STATS && (
                        <div className="space-y-6">
                          <p className="text-xs text-slate-500 italic">Nhập số liệu thống kê học sinh theo từng khối/lớp và mô tả đặc điểm tình hình học sinh.</p>
                          <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="px-4 py-3 text-left">Khối/Lớp</th>
                                  <th className="px-2 py-3 text-center">Số lớp</th>
                                  <th className="px-2 py-3 text-center">Tổng HS</th>
                                  <th className="px-2 py-3 text-center">Nữ</th>
                                  <th className="px-2 py-3 text-center">Dân tộc</th>
                                  <th className="px-2 py-3 text-center">Khuyết tật</th>
                                  <th className="w-10"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {block.content.students.map((row: any, sIndex: number) => (
                                  <tr key={sIndex}>
                                    <td className="px-4 py-2">
                                      <input 
                                        type="text" 
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-700 font-bold placeholder-slate-300"
                                        placeholder="Tên lớp"
                                        value={row.grade}
                                        onChange={(e) => {
                                          const newStudents = [...block.content.students];
                                          newStudents[sIndex].grade = e.target.value;
                                          updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-12 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.classes} onChange={(e) => {
                                        const newStudents = [...block.content.students];
                                        newStudents[sIndex].classes = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-12 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.total} onChange={(e) => {
                                        const newStudents = [...block.content.students];
                                        newStudents[sIndex].total = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-12 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.female} onChange={(e) => {
                                        const newStudents = [...block.content.students];
                                        newStudents[sIndex].female = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-12 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.ethnic} onChange={(e) => {
                                        const newStudents = [...block.content.students];
                                        newStudents[sIndex].ethnic = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-12 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.disability} onChange={(e) => {
                                        const newStudents = [...block.content.students];
                                        newStudents[sIndex].disability = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <button 
                                        onClick={() => {
                                          const newStudents = block.content.students.filter((_: any, i: number) => i !== sIndex);
                                          updateBlock(block.id, { content: { ...block.content, students: newStudents } });
                                        }}
                                        className="p-1 text-slate-300 hover:text-red-500"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <button 
                            onClick={() => {
                              const newRow = { grade: '', classes: 0, total: 0, female: 0, ethnic: 0, disability: 0 };
                              updateBlock(block.id, { content: { ...block.content, students: [...block.content.students, newRow] } });
                            }}
                            className="flex items-center gap-2 text-xs font-black text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                          >
                            <Plus className="w-4 h-4" /> Thêm dòng mới
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đặc điểm đối tượng học sinh</label>
                            <p className="text-xs text-slate-500 italic">Mô tả thuận lợi, khó khăn về tình hình học sinh (VD: Học sinh chăm ngoan, tích cực...)</p>
                            <textarea 
                              className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                              placeholder="Nhập mô tả đặc điểm học sinh..."
                              value={block.content.characteristics}
                              onChange={(e) => updateBlock(block.id, { content: { ...block.content, characteristics: e.target.value } })}
                            />
                          </div>
                        </div>
                      )}

                      {block.type === BlockType.TEACHER_STATS && (
                        <div className="space-y-6">
                          <p className="text-xs text-slate-500 italic">Thống kê số lượng, trình độ giáo viên và mô tả đặc điểm đội ngũ.</p>
                          <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <th className="px-4 py-3 text-left">Phân loại</th>
                                  <th className="px-2 py-3 text-center">Tổng</th>
                                  <th className="px-2 py-3 text-center">Nữ</th>
                                  <th className="px-2 py-3 text-center">ĐH</th>
                                  <th className="px-2 py-3 text-center">CĐ</th>
                                  <th className="w-10"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {block.content.teachers.map((row: any, tIndex: number) => (
                                  <tr key={tIndex}>
                                    <td className="px-4 py-2">
                                      <input 
                                        type="text" 
                                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-slate-700 font-bold placeholder-slate-300"
                                        placeholder="Loại giáo viên"
                                        value={row.category}
                                        onChange={(e) => {
                                          const newTeachers = [...block.content.teachers];
                                          newTeachers[tIndex].category = e.target.value;
                                          updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                        }}
                                      />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-10 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.total} onChange={(e) => {
                                        const newTeachers = [...block.content.teachers];
                                        newTeachers[tIndex].total = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-10 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.female} onChange={(e) => {
                                        const newTeachers = [...block.content.teachers];
                                        newTeachers[tIndex].female = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-10 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.university} onChange={(e) => {
                                        const newTeachers = [...block.content.teachers];
                                        newTeachers[tIndex].university = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <input type="number" className="w-10 mx-auto block bg-transparent border-none text-center placeholder-slate-300" placeholder="0" value={row.college} onChange={(e) => {
                                        const newTeachers = [...block.content.teachers];
                                        newTeachers[tIndex].college = parseInt(e.target.value) || 0;
                                        updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                      }} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <button 
                                        onClick={() => {
                                          const newTeachers = block.content.teachers.filter((_: any, i: number) => i !== tIndex);
                                          updateBlock(block.id, { content: { ...block.content, teachers: newTeachers } });
                                        }}
                                        className="p-1 text-slate-300 hover:text-red-500"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <button 
                            onClick={() => {
                              const newRow = { category: '', total: 0, female: 0, university: 0, college: 0, intermediate: 0, other: 0, note: '' };
                              updateBlock(block.id, { content: { ...block.content, teachers: [...block.content.teachers, newRow] } });
                            }}
                            className="flex items-center gap-2 text-xs font-black text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all"
                          >
                            <Plus className="w-4 h-4" /> Thêm dòng mới
                          </button>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đặc điểm đội ngũ giáo viên</label>
                            <p className="text-xs text-slate-500 italic">Mô tả phẩm chất, năng lực, kinh nghiệm của đội ngũ giáo viên.</p>
                            <textarea 
                              className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                              placeholder="Nhập mô tả đặc điểm giáo viên..."
                              value={block.content.characteristics}
                              onChange={(e) => updateBlock(block.id, { content: { ...block.content, characteristics: e.target.value } })}
                            />
                          </div>
                        </div>
                      )}

                      {block.type === BlockType.LEARNING_RESOURCES && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.title}</label>
                          <textarea 
                            className="w-full min-h-[200px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                            placeholder="Nhập nội dung tài liệu và thời lượng..."
                            value={block.content.text}
                            onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
                          />
                        </div>
                      )}

                      {block.type === BlockType.TEACHING_EQUIPMENT && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.title}</label>
                          <textarea 
                            className="w-full min-h-[150px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                            placeholder="Nhập nội dung thiết bị dạy học..."
                            value={block.content.equipment}
                            onChange={(e) => updateBlock(block.id, { content: { ...block.content, equipment: e.target.value } })}
                          />
                        </div>
                      )}

                      {block.type === BlockType.OTHER_ACTIVITIES && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{block.title}</label>
                          <textarea 
                            className="w-full min-h-[100px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                            placeholder="Nhập nội dung..."
                            value={block.content.text}
                            onChange={(e) => updateBlock(block.id, { content: { ...block.content, text: e.target.value } })}
                          />
                        </div>
                      )}

                      {block.type === BlockType.EDUCATIONAL_CONTENT && (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5.1. Môn học bắt buộc</label>
                            <p className="text-xs text-slate-500 italic">Liệt kê các môn học và hoạt động giáo dục bắt buộc.</p>
                            <textarea 
                              className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                              placeholder="Ví dụ: Tiếng Việt, Toán, Đạo đức, Tự nhiên và Xã hội..."
                              value={block.content.compulsory}
                              onChange={(e) => updateBlock(block.id, { content: { ...block.content, compulsory: e.target.value } })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5.2. Môn học tự chọn</label>
                            <p className="text-xs text-slate-500 italic">Liệt kê các môn học tự chọn (nếu có).</p>
                            <textarea 
                              className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                              placeholder="Ví dụ: Tiếng Anh tăng cường, Tin học..."
                              value={block.content.optional}
                              onChange={(e) => updateBlock(block.id, { content: { ...block.content, optional: e.target.value } })}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5.3. Thời lượng giáo dục</label>
                            <p className="text-xs text-slate-500 italic">Mô tả thời lượng dạy học (số buổi/ngày, số tiết/tuần).</p>
                            <textarea 
                              className="w-full min-h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium"
                              placeholder="Ví dụ: Tổ chức dạy học 2 buổi/ngày, mỗi ngày 7 tiết, 35 tiết/tuần..."
                              value={block.content.duration}
                              onChange={(e) => updateBlock(block.id, { content: { ...block.content, duration: e.target.value } })}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </main>
        </div>
      </div>
    );
  };

  const renderDocumentPreview = () => {
    return (
      <div className="w-full min-h-[1100px] p-0 font-serif text-slate-900 relative leading-normal" style={{ fontFamily: "'Libre Baskerville', serif" }}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 text-center text-[13px]">
          <div className="w-1/2">
            <p className="uppercase">{data.departmentName}</p>
            <p className="font-bold uppercase">{data.schoolName}</p>
            <div className="w-32 h-[1px] bg-black mx-auto mt-1" />
          </div>
          <div className="w-1/2">
            <p className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-32 h-[1px] bg-black mx-auto mt-1" />
            <p className="italic mt-4">{data.location}, {data.date}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-lg font-bold uppercase leading-tight">KẾ HOẠCH</h1>
          <h2 className="text-lg font-bold uppercase leading-tight">Dạy học các môn học và hoạt động giáo dục</h2>
          <p className="font-bold mt-1">{data.gradeLevel} - Năm học {data.year}</p>
          <div className="w-16 h-[1px] bg-black mx-auto mt-2" />
        </div>

        {/* Dynamic Blocks Rendering */}
        <div className="space-y-8 text-[14px] text-justify">
          {blocks.map((block) => (
            <section key={block.id}>
              <h2 className="font-bold uppercase mb-2">{block.title}</h2>
              
              {block.type === BlockType.HEADING && (
                <div className={`font-bold uppercase ${block.content.level === 1 ? 'text-2xl' : block.content.level === 2 ? 'text-xl' : 'text-lg'}`}>
                  {block.content.text}
                </div>
              )}

              {block.type === BlockType.IMAGE && block.content.url && (
                <div className="mt-4 mb-6">
                  <img 
                    src={block.content.url} 
                    alt={block.content.caption || 'Hình ảnh'} 
                    className="max-w-full h-auto rounded-2xl shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  {block.content.caption && (
                    <p className="text-sm text-slate-500 italic text-center mt-2">{block.content.caption}</p>
                  )}
                </div>
              )}

              {block.type === BlockType.TEXT && (
                <div className="whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: block.content.html || '................................' }} />
              )}

              {block.type === BlockType.TABLE && (
                <table className="w-full border-collapse border border-black mt-2 text-[11px]">
                  <thead>
                    {block.content.headerRows ? (
                      block.content.headerRows.map((row: TableHeaderCell[], rowIndex: number) => (
                        <tr key={rowIndex} className="bg-slate-50 text-center font-bold">
                          {row.map((cell: TableHeaderCell, cellIndex: number) => (
                            <th
                              key={cellIndex}
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              className="border border-black p-1 font-bold uppercase tracking-tighter"
                              style={{ width: cell.width }}
                            >
                              {cell.text}
                            </th>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-slate-50 text-center font-bold">
                        {block.content.columns.map((col: TableColumn) => (
                          <th key={col.id} className="border border-black p-1 font-bold uppercase tracking-tighter" style={{ width: col.width }}>
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {block.content.rows.length === 0 ? (
                      <tr>
                        <td colSpan={block.content.columns.length} className="border border-black p-4 text-center italic text-slate-400">
                          (Chưa có dữ liệu bảng)
                        </td>
                      </tr>
                    ) : (
                      block.content.rows.map((row: any, rIndex: number) => (
                        <tr key={rIndex}>
                          {block.content.columns.map((col: TableColumn) => {
                            return (
                              <td key={col.id} className="border border-black p-1 text-center">
                                {row[col.id]}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {block.type === BlockType.CHECKLIST && (
                <ul className="list-none space-y-1 mt-2">
                  {block.content.items.map((item: ChecklistItem) => (
                    <li key={item.id} className="flex items-start gap-2">
                      <span className="mt-1">
                        {item.checked ? '☑' : '☐'}
                      </span>
                      <span>{item.label || '................................'}</span>
                    </li>
                  ))}
                </ul>
              )}

              {block.type === BlockType.SUBJECT_PLAN && (
                <div className="space-y-6 mt-4">
                  {(block.content.subjectIds.length > 0 ? block.content.subjectIds : selectedSubjectIds).length === 0 ? (
                    <p className="italic text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                      (Chưa chọn môn học nào để hợp nhất)
                    </p>
                  ) : (
                    (block.content.subjectIds.length > 0 ? block.content.subjectIds : selectedSubjectIds).map((subId: string, idx: number) => {
                      const subject = availableSubjects.find(s => s.id === subId);
                      return (
                        <div key={subId} className="space-y-2">
                          <h3 className="font-bold">{idx + 1}. Môn {subject?.name}:</h3>
                          <table className="w-full border-collapse border border-black text-[11px] leading-tight">
                            <thead>
                              <tr className="bg-slate-50 text-center font-bold">
                                <th className="border border-black p-1 w-12">Tuần</th>
                                <th className="border border-black p-1 w-40">Chủ đề/ Mạch nội dung</th>
                                <th className="border border-black p-1 w-64">Tên bài học</th>
                                <th className="border border-black p-1 w-16">Thời lượng</th>
                                <th className="border border-black p-1">Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-black p-1 text-center">1</td>
                                <td className="border border-black p-1">Chủ đề 1</td>
                                <td className="border border-black p-1">Bài 1: Làm quen</td>
                                <td className="border border-black p-1 text-center">2 tiết</td>
                                <td className="border border-black p-1"></td>
                              </tr>
                              <tr>
                                <td colSpan={5} className="border border-black p-1 text-center italic text-slate-500">
                                  ... (Chi tiết xem tại Phụ lục 2 đính kèm)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {block.type === BlockType.GROUNDS && (
                <div className="space-y-1 mt-2">
                  {block.content.grounds.map((ground: string, gIdx: number) => (
                    <p key={gIdx} className="leading-relaxed">- {ground}</p>
                  ))}
                </div>
              )}

              {block.type === BlockType.STUDENT_STATS && (
                <div className="space-y-4 mt-2">
                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-center font-bold">
                        <th className="border border-black p-1">Khối/Lớp</th>
                        <th className="border border-black p-1">Số lớp</th>
                        <th className="border border-black p-1">Tổng HS</th>
                        <th className="border border-black p-1">Nữ</th>
                        <th className="border border-black p-1">Dân tộc</th>
                        <th className="border border-black p-1">Khuyết tật</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.content.students.map((row: any, sIdx: number) => (
                        <tr key={sIdx}>
                          <td className="border border-black p-1 text-center font-bold">{row.grade}</td>
                          <td className="border border-black p-1 text-center">{row.classes}</td>
                          <td className="border border-black p-1 text-center font-bold">{row.total}</td>
                          <td className="border border-black p-1 text-center">{row.female}</td>
                          <td className="border border-black p-1 text-center">{row.ethnic}</td>
                          <td className="border border-black p-1 text-center">{row.disability}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="italic leading-relaxed"><span className="font-bold">Đặc điểm đối tượng:</span> {block.content.characteristics}</p>
                </div>
              )}

              {block.type === BlockType.TEACHER_STATS && (
                <div className="space-y-4 mt-2">
                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr className="bg-slate-50 text-center font-bold">
                        <th className="border border-black p-1">Phân loại</th>
                        <th className="border border-black p-1">Tổng</th>
                        <th className="border border-black p-1">Nữ</th>
                        <th className="border border-black p-1">ĐH</th>
                        <th className="border border-black p-1">CĐ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.content.teachers.map((row: any, tIdx: number) => (
                        <tr key={tIdx}>
                          <td className="border border-black p-1 font-bold">{row.category}</td>
                          <td className="border border-black p-1 text-center font-bold">{row.total}</td>
                          <td className="border border-black p-1 text-center">{row.female}</td>
                          <td className="border border-black p-1 text-center">{row.university}</td>
                          <td className="border border-black p-1 text-center">{row.college}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="italic leading-relaxed"><span className="font-bold">Đặc điểm đội ngũ:</span> {block.content.characteristics}</p>
                </div>
              )}

              {block.type === BlockType.LEARNING_RESOURCES && (
                <div className="space-y-2 mt-2">
                  <p className="leading-relaxed whitespace-pre-line">{block.content.text}</p>
                </div>
              )}

              {block.type === BlockType.TEACHING_EQUIPMENT && (
                <div className="space-y-2 mt-2">
                  <p className="leading-relaxed whitespace-pre-line">{block.content.equipment}</p>
                </div>
              )}

              {block.type === BlockType.OTHER_ACTIVITIES && (
                <div className="space-y-2 mt-2">
                  <p className="leading-relaxed whitespace-pre-line">{block.content.text}</p>
                </div>
              )}

              {block.type === BlockType.EDUCATIONAL_CONTENT && (
                <div className="space-y-2 mt-2">
                  <p className="leading-relaxed"><span className="font-bold">5.1. Môn học bắt buộc:</span> {block.content.compulsory}</p>
                  <p className="leading-relaxed"><span className="font-bold">5.2. Môn học tự chọn:</span> {block.content.optional}</p>
                  <p className="leading-relaxed"><span className="font-bold">5.3. Thời lượng giáo dục:</span> {block.content.duration}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Closing Text */}
        <div className="mt-10 text-[14px]">
          <p>Trên đây là Kế hoạch dạy học {data.gradeLevel.toLowerCase()} năm học {data.year} của {data.schoolName}, đề nghị các thành viên nghiêm túc thực hiện./.</p>
        </div>

        {/* Signature Section */}
        <div className="mt-12 flex justify-between text-center text-[14px]">
          <div className="w-[40%]">
            <p className="font-bold uppercase">Nơi nhận</p>
            <div className="text-left text-[12px] mt-2 space-y-1">
              <p>- Phó Hiệu trưởng (để báo cáo);</p>
              <p>- GV khối {selectedGrade} (để thực hiện);</p>
              <p>- Lưu: CM, TCM.</p>
            </div>
          </div>
          <div className="w-[30%] relative">
            <p className="font-bold uppercase">NGƯỜI LẬP KẾ HOẠCH</p>
            <p className="font-bold uppercase">TỔ TRƯỞNG</p>
            <div className="h-24 flex items-center justify-center relative">
              {signatureFlow.headSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-blue-600/30 text-blue-600/40 font-black text-xl px-4 py-2 rounded-xl rotate-[-15deg] uppercase tracking-widest">
                    Đã ký số
                    <div className="text-[10px] mt-1">{signatureFlow.headSignDate}</div>
                  </div>
                </div>
              )}
            </div>
            <p className="font-bold">{data.headTeacherName || '................................'}</p>
          </div>
          <div className="w-[30%] relative">
            {data.principalTitleType === 'vice-principal' ? (
              <>
                <p className="font-bold uppercase text-[12px]">KT. HIỆU TRƯỞNG</p>
                <p className="font-bold uppercase">PHÓ HIỆU TRƯỞNG</p>
              </>
            ) : (
              <p className="font-bold uppercase">HIỆU TRƯỞNG</p>
            )}
            <div className="h-24 flex items-center justify-center relative">
              {signatureFlow.principalSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative">
                    {/* Organization Seal */}
                    <div className="w-20 h-20 border-4 border-rose-600/40 rounded-full flex items-center justify-center text-rose-600/40 font-black text-[8px] text-center p-2 uppercase rotate-[-5deg]">
                      {data.schoolName || 'TRƯỜNG TIỂU HỌC'}
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-rose-600/30 text-rose-600/40 font-black text-[10px] px-2 py-1 rounded rotate-[15deg] uppercase whitespace-nowrap bg-white/80">
                      Đã ký số
                      <div className="text-[8px] mt-0.5">{signatureFlow.principalSignDate}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="font-bold">{data.principalName || '................................'}</p>
          </div>
        </div>

        {/* Page Numbering */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold">
          {blocks.length > 0 ? '1' : ''}
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
    return (
      <div className="space-y-8 pb-20">
        {/* Hướng dẫn bước 4 */}
        <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-lg">Bước 4/5: Xem trước hồ sơ</h4>
            <p className="text-sm text-indigo-100 mt-1 leading-relaxed">
              Hệ thống đã tự động tổng hợp dữ liệu từ các khối nội dung ở Bước 3 thành một file PDF hoàn chỉnh. Hãy kiểm tra kỹ các bảng biểu, số liệu và định dạng văn bản trước khi hoàn tất.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Document Preview - Full Width */}
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Xem trước hồ sơ</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kiểm tra định dạng và nội dung</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 font-black text-sm rounded-xl hover:bg-slate-200 transition-all">
                  <Printer className="w-4 h-4" /> In thử
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <FileDown className="w-4 h-4" /> Xuất file PDF
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto min-h-[600px]">
              {renderDocumentPreview()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    const isSubmitted = activePlan?.status === 'pending' || activePlan?.status === 'issued';

    return (
      <div className="space-y-8 pb-20">
        <div className={`${isSubmitted ? 'bg-emerald-600' : 'bg-indigo-600'} p-12 rounded-[3rem] text-white shadow-2xl ${isSubmitted ? 'shadow-emerald-100' : 'shadow-indigo-100'} text-center relative overflow-hidden transition-all duration-500`}>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              {isSubmitted ? <CheckCircle2 className="w-12 h-12" /> : <FileText className="w-12 h-12" />}
            </div>
            <h2 className="text-4xl font-black mb-4">
              {isSubmitted ? 'Đã trình ký thành công!' : 'Sẵn sàng trình ký'}
            </h2>
            <p className={`${isSubmitted ? 'text-emerald-100' : 'text-indigo-100'} text-lg max-w-2xl mx-auto leading-relaxed`}>
              {isSubmitted 
                ? 'Hồ sơ đã được chuyển sang bộ phận Quản lý ký số. Vui lòng theo dõi trạng thái phê duyệt tại đó.'
                : 'Hồ sơ đã hoàn tất soạn thảo. Bạn có thể thực hiện trình ký ngay bây giờ để chuyển sang quy trình phê duyệt.'}
            </p>
            
            {!isSubmitted && (role === 'head' || role === 'teacher_assigned') && (
               <button 
                 onClick={handleCompleteAndSubmit}
                 className="mt-8 px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2 mx-auto uppercase tracking-wider"
               >
                 <Send className="w-5 h-5" /> Trình ký ngay
               </button>
            )}
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl" />
        </div>

        {/* Document Preview Modal */}
        <AnimatePresence>
          {showPreviewModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-5xl h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">Xem trước hồ sơ</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bản PDF chính thức</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 font-black text-xs rounded-xl hover:bg-slate-200 transition-all">
                      <Printer className="w-4 h-4" /> In
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                      <FileDown className="w-4 h-4" /> Tải về
                    </button>
                    <button 
                      onClick={() => setShowPreviewModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-xl transition-colors ml-2"
                    >
                      <X className="w-6 h-6 text-slate-400" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 bg-slate-200 p-0 overflow-y-auto flex justify-center">
                  <div className="bg-white shadow-2xl min-h-full w-full max-w-[210mm]">
                    {renderDocumentPreview()}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-indigo-600" /> Thông tin hồ sơ
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-bold text-sm uppercase">Tên hồ sơ</span>
                  <span className="text-slate-800 font-black text-sm">{activePlan?.title || `Kế hoạch Tổ ${data.gradeLevel}`}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-bold text-sm uppercase">Năm học</span>
                  <span className="text-slate-800 font-black text-sm">{data.year}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100">
                  <span className="text-slate-400 font-bold text-sm uppercase">Ngày tạo</span>
                  <span className="text-slate-800 font-black text-sm">{new Date().toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-slate-400 font-bold text-sm uppercase">Trạng thái</span>
                  {isSubmitted ? (
                    <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-black rounded-lg uppercase">Chờ phê duyệt</span>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase">Dự thảo</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-600" /> Hành động tiếp theo
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setShowPreviewModal(true)}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-800">Xem file PDF</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Xem trước nội dung hồ sơ</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => {
                    alert('Đang chuyển hướng đến trang Quản lý ký số...');
                  }}
                  className="flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-800">Đi đến Quản lý ký số</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Thực hiện trình ký và ban hành</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-300 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => {
                    handleSaveDraft();
                    setView('list');
                  }}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="p-3 bg-white text-slate-500 rounded-xl shadow-sm">
                      <LayoutGrid className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black">Quay lại danh sách</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Quản lý các hồ sơ khác</p>
                    </div>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-slate-300 group-hover:translate-x-1 rotate-180 transition-all" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <section className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Luồng phê duyệt</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trạng thái hiện tại</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Step 1: Head Teacher */}
                <div className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bước 1: Tổ trưởng</span>
                      <span className="text-amber-600 text-[10px] font-black uppercase">Chờ ký duyệt</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-slate-200 text-slate-500">
                      TT
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-700 truncate">{data.headTeacherName || 'Chưa cấu hình'}</p>
                      <p className="text-[10px] text-slate-400 font-bold truncate">Tổ trưởng chuyên môn</p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Principal */}
                <div className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 opacity-50 grayscale">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bước 2: Ban giám hiệu</span>
                      <span className="text-slate-400 text-[10px] font-black uppercase">Chờ Tổ trưởng ký</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 bg-slate-200 text-slate-500">
                      HT
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-700 truncate">{data.principalName || 'Chưa cấu hình'}</p>
                      <p className="text-[10px] text-slate-400 font-bold truncate">{data.principalTitleType === 'vice-principal' ? 'Phó Hiệu trưởng' : 'Hiệu trưởng'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    <strong>Thông báo:</strong> Việc ký số sẽ được thực hiện tại phân hệ <strong>Quản lý ký số</strong>. Vui lòng hoàn tất hồ sơ tại đây và chuyển sang phân hệ tương ứng.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };
  const renderConsolidatedList = () => {
    const filteredPlans = consolidatedPlans.filter(plan => {
      if (selectedGrade) return plan.grade === String(selectedGrade);
      return true;
    });

    const incompleteSubjects = filteredAvailableSubjects.filter(s => s.status !== 'completed');
    const isReadyToMerge = incompleteSubjects.length === 0;

    const handleDeletePlan = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Bạn có chắc chắn muốn xóa bản hợp nhất này không? Dữ liệu đã soạn thảo sẽ bị mất.')) {
        setConsolidatedPlans(prev => prev.filter(p => p.id !== id));
      }
    };

    return (
    <div className="space-y-8 relative">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-black text-slate-800 truncate">Hợp nhất Kế hoạch Giáo dục {subjectGroupName ? `Tổ ${subjectGroupName}` : selectedGrade ? `Khối ${selectedGrade}` : ''}</h2>
          <p className="text-slate-500 mt-1">Quản lý hồ sơ pháp lý cấp {subjectGroupName ? 'Tổ bộ môn' : 'Tổ khối'}</p>
        </div>
        <div className="flex flex-wrap items-center xl:justify-end gap-3 flex-shrink-0">
          {role === 'head' && (
            <button 
              onClick={() => setShowAssignModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-[1.5rem] font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-50 transition-all active:scale-95 whitespace-nowrap"
            >
              <Users className="w-5 h-5 flex-shrink-0" /> Phân công giáo viên
            </button>
          )}
          <button 
            disabled={(role !== 'head' && role !== 'teacher_assigned') || !isReadyToMerge || filteredPlans.length > 0}
            onClick={() => {
              if (role !== 'head' && role !== 'teacher_assigned') return;
              if (filteredPlans.length > 0) return;
              if (!isReadyToMerge) {
                const needsSyncCount = incompleteSubjects.filter(s => s.status === 'needs_sync').length;
                const draftCount = incompleteSubjects.filter(s => s.status === 'draft').length;
                
                let message = `Không thể tạo bản hợp nhất mới!\n\nCòn ${incompleteSubjects.length} môn học chưa hoàn thành:\n`;
                if (needsSyncCount > 0) message += `- ${needsSyncCount} môn Cần đồng bộ PPCT\n`;
                if (draftCount > 0) message += `- ${draftCount} môn đang soạn thảo\n`;
                message += `\nVui lòng hoàn tất soạn thảo kế hoạch môn học ở Bước 1 trước.`;
                
                alert(message);
                return;
              }
              setView('editor');
              setStep(1);
              setActivePlan(null);
              setData({ ...INITIAL_DATA, gradeLevel: selectedGrade ? `Khối ${selectedGrade}` : '' });
              setSelectedSubjectIds([]);
              setBlocks([]); // Start with empty canvas as requested
              setSignatureFlow({ headSigned: false, principalSigned: false });
            }}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-[1.5rem] font-black text-sm shadow-2xl transition-all active:scale-95 whitespace-nowrap ${
              (role === 'head' || role === 'teacher_assigned') && isReadyToMerge && filteredPlans.length === 0
                ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Plus className="w-5 h-5 flex-shrink-0" /> Tạo bản hợp nhất mới
          </button>
        </div>
      </div>

      {role === 'teacher_unassigned' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-amber-800 text-base uppercase tracking-tight">Chỉ xem</h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Giáo viên, không được phân quyền để tạo lập hoặc chỉnh sửa.
            </p>
          </div>
        </div>
      )}
      {role === 'principal' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-amber-800 text-base uppercase tracking-tight">Chỉ xem</h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Ban giám hiệu, không được phân quyền để tạo lập hoặc chỉnh sửa.
            </p>
          </div>
        </div>
      )}

      {!isReadyToMerge && filteredPlans.length === 0 && (role === 'head' || role === 'teacher_assigned') && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-amber-800 text-base uppercase tracking-tight">Chưa đủ điều kiện hợp nhất</h4>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">
              Hiện tại còn <span className="font-black">{incompleteSubjects.length} môn học</span> chưa hoàn thành soạn thảo (trạng thái <span className="italic">Đang soạn thảo</span> hoặc <span className="italic">Cần đồng bộ PPCT</span>). 
              Vui lòng hoàn tất tất cả các kế hoạch môn học ở Bước 1 trước khi tiến hành hợp nhất.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {incompleteSubjects.map(s => (
                <span key={s.id} className="px-3 py-1.5 bg-white border border-amber-200 rounded-lg text-xs font-bold text-amber-700 shadow-sm">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlans.length === 0 ? (
           <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
             <p className="text-slate-400 font-bold">Chưa có kế hoạch hợp nhất nào cho khối lớp này.</p>
           </div>
        ) : filteredPlans.map(plan => {
          const isDraft = plan.status === 'draft';
          const pendingUpdatesCount = isDraft ? plan.subjects.filter(subjectId => {
            const subject = availableSubjects.find(s => s.id === subjectId);
            return subject?.hasUpdates;
          }).length : 0;

          return (
          <div key={plan.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {plan.status === 'draft' && (role === 'head' || role === 'teacher_assigned') && (
                      <button 
                        onClick={(e) => handleDeletePlan(plan.id, e)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90 mr-1"
                        title="Xóa bản hợp nhất"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {plan.status === 'issued' ? (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Đã ban hành</span>
                    ) : plan.status === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest">Chờ phê duyệt</span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">Dự thảo</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Cập nhật: {plan.lastUpdated}</p>
                </div>
              </div>

              {pendingUpdatesCount > 0 && (
                <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 animate-pulse">
                  <div className="p-1.5 bg-rose-100 rounded-full">
                    <RefreshCw className="w-4 h-4 text-rose-600 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-rose-700 uppercase">Cần đồng bộ dữ liệu</p>
                    <p className="text-[10px] text-rose-500 font-medium">Có {pendingUpdatesCount} môn học vừa cập nhật nội dung</p>
                  </div>
                </div>
              )}

              <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{plan.title}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Năm học {plan.year}</span>
              </div>
              {assignedMergers.length > 0 && (
                <div className="flex justify-between text-xs font-bold tracking-tight mt-4 bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-500">Người phụ trách:</span>
                  <span className="text-indigo-600">{assignedMergers.join(', ')}</span>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-end justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Môn học trong kế hoạch:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.subjects.slice(0, 6).map(id => {
                      const subject = AVAILABLE_SUBJECTS.find(s => s.id === id || s.id.replace('_', '') === id);
                      return (
                        <span key={id} className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl text-[10px] font-bold whitespace-nowrap">
                          {subject?.name || id}
                        </span>
                      );
                    })}
                    {plan.subjects.length > 6 && (
                      <div className="relative group">
                        <span className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl text-[10px] font-bold whitespace-nowrap cursor-help flex items-center gap-1">
                          +{plan.subjects.length - 6} môn khác
                        </span>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-20 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl min-w-[240px] border border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest border-b border-white/10 pb-2 mb-2 text-indigo-400">Các môn học khác trong kế hoạch:</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            {plan.subjects.slice(6).map(id => {
                              const subject = AVAILABLE_SUBJECTS.find(s => s.id === id || s.id.replace('_', '') === id);
                              return (
                                <span key={id} className="text-[10px] text-slate-300 font-medium truncate">
                                  • {subject?.name || id}
                                </span>
                              );
                            })}
                          </div>
                          <div className="absolute top-full left-6 border-8 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setActivePlan(plan);
                    setView('editor');
                    if (plan.data) {
                      setData(plan.data);
                    } else {
                      setData({ ...INITIAL_DATA, gradeLevel: `Khối ${plan.grade}` });
                    }
                    setSelectedSubjectIds(plan.subjects);
                    setBlocks(plan.blocks || []);
                    setSignatureFlow(plan.signatureFlow || { headSigned: false, principalSigned: false });
                    
                    if (plan.status === 'pending' || plan.status === 'issued') {
                      setStep(5);
                    } else {
                      setStep(plan.currentStep || 2);
                    }
                  }}
                  className={`px-6 py-3 rounded-xl text-xs font-black transition-all flex items-center gap-2 flex-shrink-0 whitespace-nowrap ${
                    role === 'head' && pendingUpdatesCount > 0 
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-200' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600'
                  }`}
                >
                  {role === 'head' && pendingUpdatesCount > 0 ? (
                    <>
                      <RefreshCw className="w-4 h-4" /> Cập nhật ngay
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Chi tiết hồ sơ
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
  };

  return (
    <div className="flex flex-col min-h-full">
      {view === 'list' ? (
        renderConsolidatedList()
      ) : (
        <div className="flex flex-col w-full min-h-full">
          {/* Header with Progress */}
          <header className="mb-8 flex flex-col gap-4 flex-none">
            {role === 'teacher_unassigned' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">Chỉ xem</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Giáo viên, không được phân quyền để tạo lập hoặc chỉnh sửa.
                  </p>
                </div>
              </div>
            )}
            {role === 'principal' && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">Chỉ xem</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Ban giám hiệu, không được phân quyền để tạo lập hoặc chỉnh sửa.
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 flex-nowrap">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <button 
                  onClick={() => {
                    handleSaveDraft();
                    setView('list');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 font-black text-xs rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group shrink-0 whitespace-nowrap"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform shrink-0" />
                  <span className="hidden sm:inline">Quay lại danh sách</span>
                </button>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 shrink-0 hidden sm:flex">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight truncate">
                    {activePlan ? activePlan.title : `Kế hoạch Giáo dục Tổ ${subjectGroupName || data.gradeLevel}`}
                  </h2>
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-nowrap">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-indigo-500 rounded-lg animate-ping opacity-25"></div>
                      <span className="relative px-2 py-1 sm:px-3 sm:py-1 bg-indigo-600 text-white text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest shadow-md shadow-indigo-200 whitespace-nowrap">Bước {step}/5</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                    <span className="text-[10px] sm:text-xs font-bold text-blue-600 truncate min-w-0">
                      {step === 1 ? 'Khai báo chung - Thiết lập thông tin hành chính & đặc điểm tình hình' : 
                       step === 2 ? 'Hợp nhất môn học - Lựa chọn & sắp xếp các môn học' :
                       step === 3 ? 'Thiết kế cấu trúc - Lắp ghép bố cục hồ sơ & nội dung chi tiết' : 
                       step === 4 ? 'Xem trước - Kiểm tra nội dung trước khi hoàn tất' : 
                       'Hoàn tất - Hồ sơ đã được lưu và sẵn sàng trình ký'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0 hidden md:flex">
                {[1, 2, 3, 4, 5].map(s => (
                  <div 
                    key={s}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      step >= s ? 'w-12 bg-indigo-600' : 'w-4 bg-indigo-200'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 pr-2 pb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <footer className="w-full mt-4 pb-8">
            <div className="bg-white border border-slate-200 p-4 rounded-[2.5rem] shadow-sm flex items-center justify-between">
              <button 
                disabled={step === 1}
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-3 px-8 py-4 bg-slate-100 text-slate-700 font-black text-sm hover:bg-slate-200 rounded-2xl transition-all disabled:opacity-30 border border-slate-200"
              >
                <ChevronLeft className="w-5 h-5" /> Quay lại
              </button>

              <div className="flex items-center gap-3">
                {activePlan?.status !== 'pending' && activePlan?.status !== 'issued' && (role === 'head' || role === 'teacher_assigned') && (
                  <button 
                    onClick={() => {
                      handleSaveDraft();
                      alert('Đã lưu bản nháp thành công!');
                    }}
                    className="flex items-center gap-2 px-6 py-4 text-indigo-600 font-black text-sm hover:bg-indigo-50 rounded-2xl transition-all"
                  >
                    <Save className="w-5 h-5" /> Lưu nháp
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (role !== 'head' && role !== 'teacher_assigned') {
                      setView('list');
                      return;
                    }
                    if (activePlan?.status === 'pending' || activePlan?.status === 'issued') {
                      setView('list');
                    } else if (step === 5) {
                      handleCompleteAndSubmit();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group"
                >
                  {role !== 'head' && role !== 'teacher_assigned' ? 'Đóng' : activePlan?.status === 'pending' || activePlan?.status === 'issued' ? 'Đóng' : (step === 5 ? 'Trình ký' : (step === 4 ? 'Hoàn tất soạn thảo' : 'Tiếp theo'))}
                  {(role === 'head' || role === 'teacher_assigned') && activePlan?.status !== 'pending' && activePlan?.status !== 'issued' && (
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
      {/* Assign Modal */}
      <AnimatePresence>
        {showAssignModal && (
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
                    onClick={() => setShowAssignModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl flex gap-3 items-start">
                  <Info className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                    Tổ trưởng có thể chỉ định một giáo viên phụ trách việc hợp nhất các kế hoạch bộ môn thành một bản kế hoạch giáo dục tổng thể của khối, giúp đảm bảo tính thống nhất và chuyên nghiệp cho hồ sơ chuyên môn.
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Chọn giáo viên phụ trách hợp nhất cho {subjectGroupName ? `Tổ ${subjectGroupName}` : `Khối ${selectedGrade}`}:</p>
                <div className="space-y-2">
                  {MOCK_TEACHERS.map(teacher => {
                    const isSelected = assignedMergers.includes(teacher);
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
                          name="assignedMerger"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedMergers([teacher]);
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
                  onClick={() => setShowAssignModal(false)}
                  className="px-6 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => setShowAssignModal(false)}
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
