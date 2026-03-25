import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Save, 
  Wand2, 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Target,
  MonitorPlay,
  Users,
  AlertCircle,
  PenTool,
  ArrowLeft,
  Search,
  Filter,
  Edit3,
  Eye,
  FileSignature,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Activity {
  id: string;
  type: 'opening' | 'new_knowledge' | 'practice' | 'application';
  title: string;
  goal: string;
  content: string;
  product: string;
  teacherAction: string;
  studentAction: string;
  duration: number;
}

interface LessonPlan {
  department: string;
  subject: string;
  grade: string;
  week: number;
  lessonName: string;
  periods: number;
  date: string; // Ngày bắt đầu
  endDate?: string; // Ngày kết thúc (nếu > 1 tiết)
  teacher: string;
  status: 'not_started' | 'draft' | 'pending_submission' | 'submitted' | 'waiting_for_department' | 'returned' | 'waiting_for_school' | 'approved';
  objectives: {
    performance: string[]; // Học sinh thực hiện được việc gì
    application: string[]; // Vận dụng giải quyết vấn đề thực tế
    competencies: string[]; // Phẩm chất, năng lực
  };
  equipment: string[];
  activities: Activity[];
  adjustments: string;
}

const GRADES = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'];
const DEPARTMENTS = [
  { name: 'Tổ khối 1', subjects: ['Tiếng Việt', 'Toán', 'Tự nhiên và Xã hội', 'Đạo đức', 'Âm nhạc', 'Mỹ thuật', 'Tin học', 'Công nghệ', 'Giáo dục thể chất'] },
  { name: 'Tổ khối 2', subjects: ['Tiếng Việt', 'Toán', 'Tự nhiên và Xã hội', 'Đạo đức', 'Âm nhạc', 'Mỹ thuật', 'Tin học', 'Công nghệ', 'Giáo dục thể chất'] },
  { name: 'Tổ khối 3', subjects: ['Tiếng Việt', 'Toán', 'Ngoại ngữ (Tiếng Anh)', 'Tự nhiên xã hội', 'Đạo đức', 'Âm nhạc', 'Mĩ thuật', 'Tin học', 'Công nghệ', 'Giáo dục thể chất', 'Hoạt động trải nghiệm'] },
  { name: 'Tổ khối 4', subjects: ['Tiếng Việt', 'Toán', 'Ngoại ngữ (Tiếng Anh)', 'Lịch sử và Địa lý', 'Khoa học', 'Đạo đức', 'Âm nhạc', 'Mĩ thuật', 'Tin học', 'Công nghệ', 'Giáo dục thể chất', 'Hoạt động trải nghiệm'] },
  { name: 'Tổ khối 5', subjects: ['Tiếng Việt', 'Toán', 'Ngoại ngữ (Tiếng Anh)', 'Lịch sử và Địa lý', 'Khoa học', 'Đạo đức', 'Âm nhạc', 'Mĩ thuật', 'Tin học', 'Công nghệ', 'Giáo dục thể chất', 'Hoạt động trải nghiệm'] },
  { name: 'Tổ Tiếng Anh', subjects: ['Tiếng Anh'] },
  { name: 'Tổ Năng khiếu', subjects: ['Âm nhạc', 'Mỹ thuật'] },
  { name: 'Tổ Tin học - Công nghệ', subjects: ['Tin học', 'Công nghệ'] },
  { name: 'Tổ Giáo dục thể chất', subjects: ['Giáo dục thể chất'] },
];

const MOCK_SYLLABUS = [
  { id: 'l1', department: 'Tổ khối 4', subject: 'Tiếng Việt', teacher: 'Nguyễn Văn A', week: 23, topic: 'Vẻ đẹp quê hương', name: 'Bài 14: Trăng ơi... từ đâu đến?', periods: 2, status: 'approved', grade: '4A1' },
  { id: 'l2', department: 'Tổ khối 4', subject: 'Tiếng Việt', teacher: 'Trần Thị B', week: 24, topic: 'Vẻ đẹp quê hương', name: 'Bài 15: Chợ Tết', periods: 2, status: 'submitted', grade: '4A1' },
  { id: 'l3', department: 'Tổ khối 4', subject: 'Toán', teacher: 'Nguyễn Văn A', week: 24, topic: 'Số học', name: 'Bài 1: Phép cộng phân số', periods: 2, status: 'not_started', grade: '4A2' },
  { id: 'l4', department: 'Tổ khối 4', subject: 'Toán', teacher: 'Trần Thị B', week: 24, topic: 'Số học', name: 'Bài 2: Phép trừ phân số', periods: 2, status: 'returned', grade: '4A2' },
  { id: 'l5', department: 'Tổ khối 4', subject: 'Tiếng Việt', teacher: 'Nguyễn Văn A', week: 25, topic: 'Khám phá thế giới', name: 'Bài 16: Hoa học trò', periods: 2, status: 'waiting_for_school', grade: '4A3' },
  { id: 'l6', department: 'Tổ khối 4', subject: 'Toán', teacher: 'Trần Thị B', week: 25, topic: 'Số học', name: 'Bài 3: Phép nhân phân số', periods: 2, status: 'draft', grade: '4A3' },
  // Demo data for Tổ khối 1 - Tiếng Việt
  { id: 'k1-tv-1', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Lê Văn C', week: 24, topic: 'Chủ đề 1: Em yêu trường em', name: 'Bài 1: Làm quen với chữ cái', periods: 2, status: 'approved', grade: '1A1' },
  { id: 'k1-tv-2', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Phạm Thị D', week: 24, topic: 'Chủ đề 1: Em yêu trường em', name: 'Bài 2: Vần a, c', periods: 2, status: 'waiting_for_department', grade: '1A1' },
  { id: 'k1-tv-3', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Lê Văn C', week: 24, topic: 'Chủ đề 2: Thế giới quanh em', name: 'Bài 3: Vần o, ô', periods: 2, status: 'not_started', grade: '1A2' },
  { id: 'k1-tv-4', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Phạm Thị D', week: 24, topic: 'Chủ đề 2: Thế giới quanh em', name: 'Bài 4: Vần e, ê', periods: 2, status: 'returned', grade: '1A2' },
  { id: 'k1-tv-5', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Lê Văn C', week: 24, topic: 'Chủ đề 2: Thế giới quanh em', name: 'Bài 5: Vần i, u', periods: 2, status: 'waiting_for_school', grade: '1A3' },
  { id: 'k1-tv-6', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Phạm Thị D', week: 24, topic: 'Chủ đề 3: Gia đình thân thương', name: 'Bài 6: Vần ư, y', periods: 2, status: 'draft', grade: '1A3' },
  { id: 'k1-tv-7', department: 'Tổ khối 1', subject: 'Tiếng Việt', teacher: 'Lê Văn C', week: 24, topic: 'Chủ đề 3: Gia đình thân thương', name: 'Bài 7: Trình ký demo', periods: 2, status: 'pending_submission', grade: '1A1' },
];

const MOCK_EQUIPMENT_FROM_PLAN: Record<string, string[]> = {
  'Bài 15: Chợ Tết': ['Tranh ảnh về chợ Tết miền núi.', 'Video clip về lễ hội mùa xuân.', 'Phiếu học tập nhóm.'],
  'Bài 1: Phép cộng phân số': ['Bộ đồ dùng dạy học Toán lớp 4.', 'Thẻ phân số.', 'Bảng phụ.'],
  'Bài 14: Trăng ơi... từ đâu đến?': ['Tranh minh họa bài thơ.', 'Băng đĩa ngâm thơ.', 'Giấy vẽ, bút màu.'],
  'Bài 1: Làm quen với chữ cái': ['Bộ thẻ chữ cái tiếng Việt.', 'Tranh vẽ các con vật tương ứng chữ cái.', 'Bảng con, phấn.'],
};

// ... (rest of the file remains the same until the component state)

const INITIAL_PLAN: LessonPlan = {
  department: 'Tổ khối 1',
  subject: 'Tiếng Việt',
  grade: '1A1',
  week: 24,
  lessonName: 'Bài 15: Chợ Tết',
  periods: 2,
  date: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  teacher: 'Nguyễn Văn A',
  status: 'draft',
  objectives: {
    performance: [],
    application: [],
    competencies: [],
  },
  equipment: [],
  activities: [
    {
      id: 'act-opening',
      type: 'opening',
      title: 'Hoạt động Mở đầu: Khởi động, kết nối',
      goal: '',
      content: '',
      product: '',
      teacherAction: '',
      studentAction: '',
      duration: 5
    },
    {
      id: 'act-knowledge',
      type: 'new_knowledge',
      title: 'Hoạt động Hình thành kiến thức mới: Trải nghiệm, khám phá, phân tích, hình thành kiến thức mới',
      goal: '',
      content: '',
      product: '',
      teacherAction: '',
      studentAction: '',
      duration: 15
    },
    {
      id: 'act-practice',
      type: 'practice',
      title: 'Hoạt động Luyện tập, thực hành',
      goal: '',
      content: '',
      product: '',
      teacherAction: '',
      studentAction: '',
      duration: 10
    },
    {
      id: 'act-application',
      type: 'application',
      title: 'Hoạt động Vận dụng, trải nghiệm',
      goal: '',
      content: '',
      product: '',
      teacherAction: '',
      studentAction: '',
      duration: 5
    }
  ],
  adjustments: ''
};

export default function LessonPlanEditor() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [currentWeek, setCurrentWeek] = useState(24);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'not_started' | 'draft' | 'pending_submission' | 'submitted' | 'waiting_for_department' | 'returned' | 'waiting_for_school' | 'approved'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0].name);
  const [selectedSubject, setSelectedSubject] = useState(DEPARTMENTS[0].subjects[0]);
  const [selectedTeacher, setSelectedTeacher] = useState('Tất cả');
  const [plan, setPlan] = useState<LessonPlan>(INITIAL_PLAN);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [syllabusData, setSyllabusData] = useState(MOCK_SYLLABUS);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activityRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (view === 'editor' && expandedActivity && activityRefs.current[expandedActivity]) {
      const element = activityRefs.current[expandedActivity];
      
      if (element) {
        // Use a slightly longer timeout to ensure the DOM is ready and expansion animation has started
        const timer = setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [expandedActivity, view]);

  const cycleStatus = () => {
    const nextStatus = {
        'all': 'not_started',
        'not_started': 'draft',
        'draft': 'pending_submission',
        'pending_submission': 'submitted',
        'submitted': 'waiting_for_department',
        'waiting_for_department': 'returned',
        'returned': 'waiting_for_school',
        'waiting_for_school': 'approved',
        'approved': 'all'
    }[selectedStatus] as 'all' | 'not_started' | 'draft' | 'submitted' | 'waiting_for_department' | 'returned' | 'waiting_for_school' | 'approved';
    setSelectedStatus(nextStatus);
  };

  const filteredSyllabus = syllabusData.filter(item => 
    item.week === currentWeek && 
    item.subject === selectedSubject && 
    item.department === selectedDepartment &&
    (selectedTeacher === 'Tất cả' || item.teacher === selectedTeacher) &&
    (selectedStatus === 'all' || item.status === selectedStatus) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditLesson = (item: any) => {
    const preDefinedEquipment = MOCK_EQUIPMENT_FROM_PLAN[item.name] || [];
    
    setPlan({
      ...INITIAL_PLAN,
      department: item.department,
      subject: item.subject,
      grade: item.grade || '1A1',
      lessonName: item.name,
      week: item.week,
      periods: item.periods,
      teacher: item.teacher,
      status: item.status,
      endDate: item.periods > 1 ? INITIAL_PLAN.date : undefined,
      equipment: preDefinedEquipment.length > 0 ? preDefinedEquipment : INITIAL_PLAN.equipment,
      activities: item.status === 'not_started' ? INITIAL_PLAN.activities : INITIAL_PLAN.activities // For demo, always use initial structure
    });
    setView('editor');
  };

  const handleAddActivity = () => {
    const defaultType = 'practice';
    const typeTitles: Record<string, string> = {
      opening: 'Hoạt động 1: Mở đầu (Khởi động, kết nối)',
      new_knowledge: 'Hoạt động 2: Hình thành kiến thức mới (Trải nghiệm, khám phá, phân tích, hình thành kiến thức mới)',
      practice: 'Hoạt động 3: Luyện tập, thực hành',
      application: 'Hoạt động 4: Vận dụng, trải nghiệm'
    };
    
    const newActivity: Activity = {
      id: `act-${crypto.randomUUID()}`,
      type: defaultType,
      title: typeTitles[defaultType],
      goal: '',
      content: '',
      product: '',
      teacherAction: '',
      studentAction: '',
      duration: 10
    };
    setPlan({ ...plan, activities: [...plan.activities, newActivity] });
    setExpandedActivity(newActivity.id);
  };

  const handleRemoveActivity = (id: string) => {
    setPlan({ ...plan, activities: plan.activities.filter(a => a.id !== id) });
  };

  const updateActivity = (id: string, field: keyof Activity, value: any) => {
    setPlan(prev => {
      const newActivities = prev.activities.map(a => {
        if (a.id === id) {
          const updated = { ...a, [field]: value };
          // If changing type, also update the default title to match the official template
          if (field === 'type') {
            const typeTitles: Record<string, string> = {
              opening: 'Hoạt động 1: Mở đầu (Khởi động, kết nối)',
              new_knowledge: 'Hoạt động 2: Hình thành kiến thức mới (Trải nghiệm, khám phá, phân tích, hình thành kiến thức mới)',
              practice: 'Hoạt động 3: Luyện tập, thực hành',
              application: 'Hoạt động 4: Vận dụng, trải nghiệm'
            };
            updated.title = typeTitles[value as string] || updated.title;
          }
          return updated;
        }
        return a;
      });
      return { ...prev, activities: newActivities };
    });
  };

  const getActivityPlaceholders = (type: string) => {
    const placeholders = {
      opening: {
        goal: "Tạo tâm thế hứng thú, kết nối kiến thức cũ với bài mới, xác định vấn đề cần giải quyết...",
        content: "Câu hỏi gợi mở, trò chơi, video clip hoặc tình huống thực tế dẫn dắt vào bài...",
        teacher: "Giao nhiệm vụ, quan sát, tổ chức trò chơi, dẫn dắt và kết nối vào bài học mới...",
        student: "Thực hiện nhiệm vụ, trả lời câu hỏi, tham gia hoạt động khởi động tích cực..."
      },
      new_knowledge: {
        goal: "Giúp học sinh chiếm lĩnh kiến thức, kĩ năng mới; hình thành năng lực chuyên môn...",
        content: "Các đơn vị kiến thức mới, câu hỏi thảo luận, phiếu học tập, học liệu khám phá...",
        teacher: "Tổ chức cho HS khám phá, giảng giải, điều phối thảo luận, chốt kiến thức trọng tâm...",
        student: "Đọc sách, thảo luận nhóm, quan sát, thực hiện thí nghiệm, rút ra kết luận..."
      },
      practice: {
        goal: "Củng cố, khắc sâu kiến thức và rèn luyện kĩ năng vừa học thông qua bài tập...",
        content: "Hệ thống bài tập, câu hỏi trắc nghiệm, thực hành thao tác, giải quyết vấn đề...",
        teacher: "Giao bài tập, hướng dẫn cách làm, theo dõi hỗ trợ, sửa lỗi sai, nhận xét kết quả...",
        student: "Làm bài tập cá nhân/nhóm, trình bày kết quả, tự đánh giá và đánh giá lẫn nhau..."
      },
      application: {
        goal: "Vận dụng kiến thức đã học vào giải quyết tình huống thực tiễn, mở rộng không gian học tập...",
        content: "Tình huống thực tế, dự án nhỏ, bài tập mở rộng, liên hệ đời sống...",
        teacher: "Giao nhiệm vụ thực tế, định hướng cách thực hiện, khơi gợi sáng tạo, đánh giá sản phẩm...",
        student: "Tìm tòi, sáng tạo, thực hiện nhiệm vụ ở nhà hoặc cộng đồng, báo cáo kết quả..."
      }
    };
    return placeholders[type as keyof typeof placeholders] || placeholders.practice;
  };

  const renderListView = () => (
    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-slate-200 bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          {/* Title & Info */}
          <div className="flex items-center gap-4 shrink-0">
            <div>
              <h2 className="text-xl font-black text-slate-900">Soạn kế hoạch bài dạy</h2>
              
              {/* Improved Filter Bar */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-sm mt-2 w-fit">
                <select 
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedSubject(DEPARTMENTS.find(d => d.name === e.target.value)!.subjects[0]);
                    setSearchTerm('');
                  }}
                  className="px-2 py-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 rounded-md"
                >
                  {DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
                <div className="w-px h-3 bg-slate-300" />
                <select 
                  value={selectedSubject}
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    setSearchTerm('');
                  }}
                  className="px-2 py-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 rounded-md"
                >
                  {DEPARTMENTS.find(d => d.name === selectedDepartment)?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="w-px h-3 bg-slate-300" />
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="px-2 py-1 bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 cursor-pointer hover:text-indigo-600 rounded-md"
                >
                  <option>Tất cả</option>
                  {Array.from(new Set(MOCK_SYLLABUS.map(i => i.teacher))).map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Week Nav (Left), Search/Filter (Right) */}
        <div className="flex items-center justify-between gap-4">
          {/* Week Navigation */}
          <div className="flex items-center gap-1 bg-indigo-50 p-1 rounded-2xl border border-indigo-100 w-fit shrink-0 shadow-inner">
            <button 
              onClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
              className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 text-center min-w-[60px]">
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block">Tuần</span>
              <span className="text-lg font-black text-indigo-950">{currentWeek}</span>
            </div>
            <button 
              onClick={() => setCurrentWeek(prev => Math.min(35, prev + 1))}
              className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm bài học..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 shadow-sm"
              />
            </div>
            <button 
              onClick={cycleStatus}
              className={`p-2 bg-white border rounded-xl hover:bg-slate-50 transition-colors shadow-sm ${
                selectedStatus !== 'all' ? 'border-indigo-500 text-indigo-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-center text-sm">
            <thead className="bg-indigo-50 text-indigo-900 font-bold border-b-2 border-slate-300">
              <tr>
                <th className="px-6 py-4 w-48 border-r border-slate-300">Chủ đề/Mạch nội dung</th>
                <th className="px-6 py-4 border-r border-slate-300">Tên bài học</th>
                <th className="px-6 py-4 w-24 border-r border-slate-300">Số tiết</th>
                <th className="px-6 py-4 w-56 border-r border-slate-300">Trạng thái</th>
                <th className="px-6 py-4 w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredSyllabus.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không có dữ liệu phân phối chương trình cho {selectedDepartment} - {selectedSubject} - Tuần {currentWeek}
                  </td>
                </tr>
              ) : (
                (() => {
                  const rows: React.ReactElement[] = [];
                  let lastTopic = '';
                  let rowSpan = 1;

                  // First pass: Calculate rowspans
                  const rowSpans = new Array(filteredSyllabus.length).fill(1);
                  let currentSpanStart = 0;
                  for (let i = 1; i < filteredSyllabus.length; i++) {
                    if (filteredSyllabus[i].topic === filteredSyllabus[currentSpanStart].topic) {
                      rowSpans[currentSpanStart]++;
                      rowSpans[i] = 0;
                    } else {
                      currentSpanStart = i;
                    }
                  }

                  // Second pass: Render
                  return filteredSyllabus.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      {rowSpans[index] > 0 && (
                        <td rowSpan={rowSpans[index]} className="px-6 py-4 font-medium text-slate-700 border-r border-slate-300 text-left align-top">
                          {item.topic}
                        </td>
                      )}
                      <td className="px-6 py-4 font-bold text-slate-900 border-r border-slate-300 text-left">{item.name}</td>
                      <td className="px-6 py-4 font-bold text-slate-900 border-r border-slate-300">{item.periods}</td>
                      <td className="px-6 py-4 border-r border-slate-300">
                        {item.status === 'not_started' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Chưa soạn
                          </span>
                        )}
                        {item.status === 'draft' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Đang soạn
                          </span>
                        )}
                        {item.status === 'pending_submission' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-500" /> Chờ trình ký
                          </span>
                        )}
                        {item.status === 'submitted' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Đã trình ký
                          </span>
                        )}
                        {item.status === 'waiting_for_department' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Chờ tổ trưởng ký
                          </span>
                        )}
                        {item.status === 'returned' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Đã trả lại
                          </span>
                        )}
                        {item.status === 'waiting_for_school' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Chờ BGH ký
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> Đã ban hành
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-2">
                        {item.status === 'pending_submission' && (
                          <button 
                            onClick={() => setSyllabusData(prev => prev.map(s => s.id === item.id ? { ...s, status: 'waiting_for_department' } : s))}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 whitespace-nowrap"
                          >
                            <FileSignature className="w-3.5 h-3.5" /> Trình ký
                          </button>
                        )}
                        <button 
                          onClick={() => handleEditLesson(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                            ['approved', 'waiting_for_school', 'waiting_for_department', 'submitted'].includes(item.status)
                              ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200' 
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                          }`}
                        >
                          {['approved', 'waiting_for_school', 'waiting_for_department', 'submitted'].includes(item.status) ? (
                            <><Eye className="w-3.5 h-3.5" /> Xem</>
                          ) : (
                            <><Edit3 className="w-3.5 h-3.5" /> Soạn</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEditorView = () => (
    <div className="flex h-full flex-col bg-slate-50 overflow-hidden">
      {/* Header - Minimal & Clean */}
      <div className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            Quay lại danh sách
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          {['not_started', 'draft', 'returned'].includes(plan.status) && (
            <button className="px-4 py-2 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2 border border-slate-200">
              <Clock className="w-4 h-4" /> Lưu nháp
            </button>
          )}
          
          <button 
            onClick={() => {
              setPlan({...plan, status: 'pending_submission'});
              setShowPdfPreview(true);
            }}
            className="px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100 active:scale-95"
          >
            {['not_started', 'draft', 'returned'].includes(plan.status) ? (
              <><CheckCircle2 className="w-4 h-4" /> Hoàn thành & Xem PDF</>
            ) : (
              <><Eye className="w-4 h-4" /> Xem PDF</>
            )}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
      >
        
        {/* Metadata Section - Compact & Professional */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/30 rounded-full -mr-24 -mt-24 blur-3xl" />
          
          <div className="relative flex flex-col gap-6">
            {/* Top Side: Lesson Identity */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded border border-indigo-100 whitespace-nowrap">
                    Tuần {plan.week}
                  </span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {plan.subject}
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight" title={plan.lessonName}>
                  {plan.lessonName}
                </h2>
              </div>
            </div>

            {/* Bottom Side: Stats & Date - Full Width */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 bg-indigo-50/40 px-6 py-4 rounded-xl border border-indigo-100/80 shadow-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                  <Users className="w-3.5 h-3.5" /> Lớp
                </span>
                <span className="text-base font-black text-slate-800">{plan.grade}</span>
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-indigo-300/60" />
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5" /> Thời lượng
                </span>
                <span className="text-base font-black text-slate-800">{plan.periods} tiết</span>
              </div>

              <div className="hidden sm:block w-px h-8 bg-indigo-300/60" />

              <div className="flex flex-col gap-0.5 min-w-[120px]">
                <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="w-3 h-3" /> {plan.periods > 1 ? 'Từ ngày' : 'Ngày dạy'}
                </label>
                <input 
                  type="date" 
                  value={plan.date} 
                  onChange={(e) => setPlan({...plan, date: e.target.value})} 
                  className="text-base font-black text-slate-900 border-none p-0 focus:ring-0 bg-transparent cursor-pointer w-full" 
                />
              </div>

              {plan.periods > 1 && (
                <>
                  <div className="hidden sm:block w-px h-8 bg-indigo-300/60" />
                  <div className="flex flex-col gap-0.5 min-w-[120px]">
                    <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="w-3 h-3" /> Đến ngày
                    </label>
                    <input 
                      type="date" 
                      value={plan.endDate || plan.date} 
                      onChange={(e) => setPlan({...plan, endDate: e.target.value})} 
                      className="text-base font-black text-slate-900 border-none p-0 focus:ring-0 bg-transparent cursor-pointer w-full" 
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
          
          {/* Objectives & Equipment */}
          <div className="space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                I. Yêu cầu cần đạt
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">1. Học sinh thực hiện được việc gì</label>
                  <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/60" 
                    placeholder="Nêu cụ thể các kiến thức, kĩ năng học sinh cần thực hiện được trong bài học để hình thành năng lực đặc thù (Ví dụ: Đọc trôi chảy, viết đúng vần, nhận biết được...)"
                    value={plan.objectives.performance.join('\n')} 
                    onChange={(e) => setPlan({...plan, objectives: {...plan.objectives, performance: e.target.value.split('\n')}})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">2. Vận dụng giải quyết vấn đề thực tế</label>
                  <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/60" 
                    placeholder="Mô tả các tình huống, vấn đề thực tiễn mà học sinh có thể vận dụng kiến thức, kĩ năng đã học để giải quyết trong cuộc sống hàng ngày..."
                    value={plan.objectives.application.join('\n')} 
                    onChange={(e) => setPlan({...plan, objectives: {...plan.objectives, application: e.target.value.split('\n')}})} 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">3. Phẩm chất, năng lực hình thành</label>
                  <textarea 
                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/60" 
                    placeholder="Xác định các phẩm chất chủ yếu (yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm) và năng lực chung được hình thành qua bài học..."
                    value={plan.objectives.competencies.join('\n')} 
                    onChange={(e) => setPlan({...plan, objectives: {...plan.objectives, competencies: e.target.value.split('\n')}})} 
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <MonitorPlay className="w-5 h-5 text-indigo-600" />
                II. Đồ dùng dạy học
              </h3>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-medium border border-emerald-100">
                <AlertCircle className="w-3.5 h-3.5" />
                Hệ thống đã tự động tải danh mục đồ dùng từ Kế hoạch giáo dục tổ chuyên môn. Bạn có thể chỉnh sửa hoặc bổ sung thêm.
              </div>

              <textarea 
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/60"
                placeholder="Liệt kê các thiết bị dạy học và học liệu cần chuẩn bị (Ví dụ: Tranh ảnh, video clip, phiếu học tập, đồ dùng tự làm, máy chiếu...)"
                value={plan.equipment.join('\n')}
                onChange={(e) => setPlan({...plan, equipment: e.target.value.split('\n')})}
              />
            </section>
          </div>

            {/* III. Các hoạt động dạy học */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  III. Các hoạt động dạy học chủ yếu
                </h3>
                <button 
                  onClick={handleAddActivity}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Thêm hoạt động
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {plan.activities.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium">
                      Chưa có hoạt động nào. Hãy thêm hoạt động hoặc sử dụng AI để gợi ý.
                    </div>
                  )}
                  {plan.activities.map((activity) => (
                    <motion.div 
                      key={activity.id}
                      ref={el => activityRefs.current[activity.id] = el}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-indigo-200 transition-colors"
                    >
                      {/* Activity Header */}
                      <div 
                        className="p-4 bg-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedActivity(expandedActivity === activity.id ? null : activity.id)}
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                          <select 
                            value={activity.type}
                            onChange={(e) => updateActivity(activity.id, 'type', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border-none rounded-lg px-2 py-1 focus:ring-0 cursor-pointer"
                          >
                            <option value="opening">1. Mở đầu</option>
                            <option value="new_knowledge">2. Hình thành kiến thức mới</option>
                            <option value="practice">3. Luyện tập, thực hành</option>
                            <option value="application">4. Vận dụng, trải nghiệm</option>
                          </select>
                          <input 
                            type="text"
                            value={activity.title}
                            onChange={(e) => updateActivity(activity.id, 'title', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-slate-800 bg-transparent border-none p-0 focus:ring-0 w-64 text-sm"
                          />
                          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" />
                            <input 
                              type="number" 
                              value={activity.duration}
                              onChange={(e) => updateActivity(activity.id, 'duration', parseInt(e.target.value) || 0)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 text-center bg-transparent border-none p-0 focus:ring-0"
                            /> phút
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveActivity(activity.id); }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {expandedActivity === activity.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>
                      </div>

                      {/* Activity Body */}
                      <AnimatePresence>
                        {expandedActivity === activity.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-6"
                          >
                             {/* Left Col */}
                             <div className="space-y-4">
                               <div>
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Mục tiêu</label>
                                 <textarea 
                                   value={activity.goal}
                                   onChange={(e) => updateActivity(activity.id, 'goal', e.target.value)}
                                   className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/50"
                                   placeholder={getActivityPlaceholders(activity.type).goal}
                                 />
                               </div>
                               <div>
                                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Nội dung & Sản phẩm</label>
                                 <textarea 
                                   value={activity.content}
                                   onChange={(e) => updateActivity(activity.id, 'content', e.target.value)}
                                   className="w-full h-24 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/50"
                                   placeholder={getActivityPlaceholders(activity.type).content}
                                 />
                               </div>
                             </div>
 
                             {/* Right Col */}
                             <div className="space-y-4">
                               <div>
                                 <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-wider mb-1.5">Hoạt động của Giáo viên</label>
                                 <textarea 
                                   value={activity.teacherAction}
                                   onChange={(e) => updateActivity(activity.id, 'teacherAction', e.target.value)}
                                   className="w-full h-20 bg-white border border-indigo-100 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/50"
                                   placeholder={getActivityPlaceholders(activity.type).teacher}
                                 />
                               </div>
                               <div>
                                 <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-wider mb-1.5">Hoạt động của Học sinh</label>
                                 <textarea 
                                   value={activity.studentAction}
                                   onChange={(e) => updateActivity(activity.id, 'studentAction', e.target.value)}
                                   className="w-full h-24 bg-white border border-emerald-100 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none placeholder:text-slate-400/50"
                                   placeholder={getActivityPlaceholders(activity.type).student}
                                 />
                               </div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* IV. Điều chỉnh sau bài dạy */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-5">
                <PenTool className="w-5 h-5 text-indigo-600" />
                IV. Điều chỉnh sau bài dạy
              </h3>
              <textarea 
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none placeholder:text-slate-400/50"
                value={plan.adjustments}
                onChange={(e) => setPlan({...plan, adjustments: e.target.value})}
                placeholder="Ghi chú những điểm cần điều chỉnh cho lần dạy sau (nếu có)..."
              />
            </section>
          </div>
        </div>
  );



  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
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
          <motion.div 
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full"
          >
            {renderEditorView()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-5xl h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Xem trước giáo án</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chuẩn công văn 2345</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {['not_started', 'draft', 'returned'].includes(plan.status) && (
                    <button 
                      onClick={() => setShowPdfPreview(false)}
                      className="px-4 py-2 bg-white text-slate-600 border border-slate-200 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" /> Tiếp tục chỉnh sửa
                    </button>
                  )}
                  <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 font-bold text-xs rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> Tải xuống PDF
                  </button>
                  {['not_started', 'draft', 'returned'].includes(plan.status) && (
                    <button 
                      onClick={() => setShowSubmitSuccess(true)}
                      className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-md shadow-emerald-100 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Trình ký giáo án
                    </button>
                  )}
                  <button 
                    onClick={() => setShowPdfPreview(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors ml-2"
                  >
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Simulated PDF */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-12 bg-slate-200 custom-scrollbar">
                <div className="bg-white w-full max-w-[210mm] min-h-[297mm] mx-auto shadow-xl p-8 sm:p-[20mm] font-sans text-slate-900 space-y-8 h-max">
                  {/* PDF Header */}
                  <div className="grid grid-cols-[4fr_6fr] text-sm font-bold">
                    <div className="text-center space-y-1 uppercase">
                      <p>TRƯỜNG TIỂU HỌC ABC</p>
                      <p>TỔ CHUYÊN MÔN: {plan.department}</p>
                      <div className="w-24 h-px bg-slate-900 mx-auto mt-2" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                      <p>Độc lập - Tự do - Hạnh phúc</p>
                      <div className="w-40 h-px bg-slate-900 mx-auto mt-2" />
                    </div>
                  </div>

                  <div className="text-center space-y-2 pt-8">
                    <h1 className="text-xl font-bold uppercase">KẾ HOẠCH BÀI DẠY</h1>
                    <p className="text-base font-bold italic">Môn học: {plan.subject}; lớp: {plan.grade}</p>
                    <p className="text-base font-bold italic">Tên bài học: {plan.lessonName}; số tiết: {plan.periods}</p>
                    <p className="text-sm italic">Thời gian thực hiện: {plan.date} {plan.endDate ? `đến ${plan.endDate}` : ''}</p>
                  </div>

                  {/* PDF Content Sections */}
                  <div className="space-y-6 text-sm leading-relaxed">
                    <section className="space-y-3">
                      <h2 className="font-bold uppercase">I. YÊU CẦU CẦN ĐẠT</h2>
                      <div className="pl-4 space-y-2">
                        <p><strong>1. Năng lực đặc thù:</strong> {plan.objectives.performance.join(', ')}</p>
                        <p><strong>2. Năng lực chung:</strong> {plan.objectives.competencies.join(', ')}</p>
                        <p><strong>3. Phẩm chất:</strong> {plan.objectives.application.join(', ')}</p>
                      </div>
                    </section>

                    <section className="space-y-3">
                      <h2 className="font-bold uppercase">II. ĐỒ DÙNG DẠY HỌC</h2>
                      <p className="pl-4">{plan.equipment.join(', ')}</p>
                    </section>

                    <section className="space-y-3">
                      <h2 className="font-bold uppercase">III. CÁC HOẠT ĐỘNG DẠY HỌC CHỦ YẾU</h2>
                      {plan.activities.map((act) => (
                        <div key={act.id} className="pl-4 space-y-2 mb-4">
                          <p className="font-bold">{act.title}</p>
                          <p><strong>1. Mục tiêu:</strong> {act.goal || '...'}</p>
                          <p><strong>2. Nội dung:</strong> {act.content || '...'}</p>
                          <p><strong>3. Sản phẩm:</strong> {act.product || '...'}</p>
                          <p><strong>4. Tổ chức thực hiện:</strong></p>
                          <div className="pl-4">
                            <p><em>- Hoạt động của GV:</em> {act.teacherAction || '...'}</p>
                            <p><em>- Hoạt động của HS:</em> {act.studentAction || '...'}</p>
                          </div>
                        </div>
                      ))}
                    </section>

                    <section className="space-y-3">
                      <h2 className="font-bold uppercase">IV. ĐIỀU CHỈNH SAU BÀI DẠY</h2>
                      <p className="pl-4 italic">{plan.adjustments || 'Không có điều chỉnh.'}</p>
                    </section>
                  </div>

                  {/* PDF Footer - Signatures */}
                  <div className="pt-12 grid grid-cols-2 text-sm">
                    <div className="text-center">
                      <p className="italic invisible mb-1">........, ngày .... tháng .... năm 20...</p>
                      <p className="font-bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN</p>
                      <p className="italic text-slate-500">(Ký và ghi rõ họ tên)</p>
                      <div className="h-24"></div>
                    </div>
                    <div className="text-center">
                      <p className="italic mb-1">........, ngày .... tháng .... năm 20...</p>
                      <p className="font-bold uppercase">GIÁO VIÊN LẬP KẾ HOẠCH</p>
                      <p className="italic text-slate-500">(Ký và ghi rõ họ tên)</p>
                      <div className="h-24"></div>
                      <p className="font-bold">{plan.teacher}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Submit Success Modal */}
        {showSubmitSuccess && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Trình ký thành công!</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Giáo án <strong>{plan.lessonName}</strong> đã được gửi đi trình ký. 
                  <br/><br/>
                  Vui lòng chuyển sang phân hệ <strong>Quản lý ký số</strong> để thực hiện ký số điện tử trước khi gửi lên Tổ trưởng chuyên môn.
                </p>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button
                  onClick={() => {
                    // Update the syllabus data to reflect the new status
                    setSyllabusData(prev => prev.map(item => 
                      item.name === plan.lessonName && item.grade === plan.grade 
                        ? { ...item, status: 'submitted' } 
                        : item
                    ));
                    setShowSubmitSuccess(false);
                    setShowPdfPreview(false);
                    setPlan({...plan, status: 'submitted'});
                    setView('list');
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Hoàn tất & Về danh sách
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
