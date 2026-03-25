import React, { useState, useMemo } from 'react';
import { 
  Archive, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileArchive,
  Printer,
  Share2,
  ExternalLink,
  ShieldCheck,
  School,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

const EVIDENCE_LIST = [
  {
    id: 'EV001',
    name: 'Kế hoạch giáo dục nhà trường',
    type: 'PL1',
    date: '2025-09-05',
    status: 'signed',
    size: '2.4 MB',
    author: 'Hiệu trưởng',
    schoolYear: '2025-2026'
  },
  {
    id: 'EV002',
    name: 'Kế hoạch giáo dục Tổ khối 4',
    type: 'PL2',
    date: '2025-09-10',
    status: 'signed',
    size: '1.8 MB',
    author: 'Tổ trưởng Khối 4',
    schoolYear: '2025-2026'
  },
  {
    id: 'EV003',
    name: 'Lịch báo giảng - Tuần 12 - Khối 4',
    type: 'SCHEDULE',
    date: '2026-03-20',
    status: 'signed',
    size: '0.5 MB',
    author: 'Nguyễn Văn An',
    schoolYear: '2025-2026',
    group: 'Khối 4',
    week: 'Tuần 12'
  },
  {
    id: 'EV003-1',
    name: 'Lịch báo giảng - Tuần 11 - Khối 4',
    type: 'SCHEDULE',
    date: '2026-03-13',
    status: 'signed',
    size: '0.5 MB',
    author: 'Nguyễn Văn An',
    schoolYear: '2025-2026',
    group: 'Khối 4',
    week: 'Tuần 11'
  },
  {
    id: 'EV003-2',
    name: 'Lịch báo giảng - Tuần 12 - Khối 1',
    type: 'SCHEDULE',
    date: '2026-03-20',
    status: 'signed',
    size: '0.5 MB',
    author: 'Trần Thị Bình',
    schoolYear: '2025-2026',
    group: 'Khối 1',
    week: 'Tuần 12'
  },
  {
    id: 'EV003-3',
    name: 'Lịch báo giảng - Tuần 12 - Tổ tiếng Anh',
    type: 'SCHEDULE',
    date: '2026-03-20',
    status: 'signed',
    size: '0.5 MB',
    author: 'Lê Văn Cường',
    schoolYear: '2025-2026',
    group: 'Tổ tiếng Anh',
    week: 'Tuần 12'
  },
  {
    id: 'EV004',
    name: 'Kế hoạch bài dạy Toán - Tuần 12 - Nguyễn Văn A',
    type: 'PL3',
    date: '2026-03-21',
    status: 'signed',
    size: '1.2 MB',
    author: 'Nguyễn Văn A',
    schoolYear: '2025-2026',
    grade: 'Khối 4',
    subject: 'Toán',
    week: 'Tuần 12'
  },
  {
    id: 'EV005',
    name: 'Kế hoạch bài dạy Tiếng Việt - Tuần 12 - Trần Thị B',
    type: 'PL3',
    date: '2026-03-22',
    status: 'pending',
    size: '1.1 MB',
    author: 'Trần Thị B',
    schoolYear: '2025-2026',
    grade: 'Khối 4',
    subject: 'Tiếng Việt',
    week: 'Tuần 12'
  },
  {
    id: 'EV007',
    name: 'Kế hoạch bài dạy Toán - Tuần 12 - Lê Văn C',
    type: 'PL3',
    date: '2026-03-21',
    status: 'signed',
    size: '1.3 MB',
    author: 'Lê Văn C',
    schoolYear: '2025-2026',
    grade: 'Khối 1',
    subject: 'Toán',
    week: 'Tuần 12'
  },
  {
    id: 'EV008',
    name: 'Kế hoạch bài dạy Tiếng Việt - Tuần 12 - Phạm Thị D',
    type: 'PL3',
    date: '2026-03-22',
    status: 'signed',
    size: '1.0 MB',
    author: 'Phạm Thị D',
    schoolYear: '2025-2026',
    grade: 'Khối 1',
    subject: 'Tiếng Việt',
    week: 'Tuần 12'
  },
  {
    id: 'EV006',
    name: 'Kế hoạch giáo dục nhà trường (Cũ)',
    type: 'PL1',
    date: '2024-09-05',
    status: 'signed',
    size: '2.2 MB',
    author: 'Hiệu trưởng',
    schoolYear: '2024-2025'
  }
];

const EvidenceExtraction = () => {
  const [activeTab, setActiveTab] = useState('PL1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState('all');

  const SCHOOL_YEARS = ['2025-2026', '2024-2025', '2023-2024'];

  const TABS = [
    { id: 'PL1', label: '1. Kế hoạch trường', icon: School },
    { id: 'PL2', label: '2. Kế hoạch tổ', icon: BookOpen },
    { id: 'SCHEDULE', label: '3. Lịch báo giảng', icon: Calendar },
    { id: 'PL3', label: '4. Kế hoạch bài dạy', icon: FileText },
  ];

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === filteredEvidence.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredEvidence.map(i => i.id));
    }
  };

  const filteredEvidence = EVIDENCE_LIST.filter(item => {
    const matchesTab = item.type === activeTab;
    const matchesYear = item.schoolYear === selectedYear;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesGrade = true;
    let matchesTeacher = true;
    let matchesSubject = true;
    let matchesWeek = true;

    if (activeTab === 'SCHEDULE' || activeTab === 'PL3') {
      if (selectedGrade !== 'all') {
        matchesGrade = item.grade === selectedGrade || item.group === selectedGrade;
      }
      if (selectedTeacher !== 'all') {
        matchesTeacher = item.author === selectedTeacher;
      }
      if (activeTab === 'PL3' && selectedSubject !== 'all') {
        matchesSubject = item.subject === selectedSubject;
      }
      if (selectedWeek !== 'all') {
        matchesWeek = item.week === selectedWeek;
      }
    }

    return matchesTab && matchesYear && matchesSearch && matchesGrade && matchesTeacher && matchesSubject && matchesWeek;
  });

  // Get unique grades, teachers, and subjects for filters
  const filtersData = useMemo(() => {
    const items = EVIDENCE_LIST.filter(item => (item.type === 'SCHEDULE' || item.type === 'PL3') && item.schoolYear === selectedYear);
    const grades = Array.from(new Set(items.map(item => item.grade || item.group).filter(Boolean)));
    const teachers = Array.from(new Set(items.map(item => item.author).filter(Boolean)));
    const subjects = Array.from(new Set(items.map(item => item.subject).filter(Boolean)));
    const weeks = Array.from(new Set(items.map(item => item.week).filter(Boolean))).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
    return { grades, teachers, subjects, weeks };
  }, [selectedYear]);

  // Grouping logic for SCHEDULE
  const groupedSchedule = activeTab === 'SCHEDULE' ? filteredEvidence.reduce((acc: any, item: any) => {
    const group = item.group || 'Khác';
    const week = item.week || 'Khác';
    if (!acc[group]) acc[group] = {};
    if (!acc[group][week]) acc[group][week] = [];
    acc[group][week].push(item);
    return acc;
  }, {}) : null;

  // Grouping logic for PL3 (Lesson Plans)
  const groupedPL3 = activeTab === 'PL3' ? filteredEvidence.reduce((acc: any, item: any) => {
    const grade = item.grade || 'Khác';
    const subject = item.subject || 'Khác';
    const teacher = item.author || 'Khác';
    if (!acc[grade]) acc[grade] = {};
    if (!acc[grade][subject]) acc[grade][subject] = {};
    if (!acc[grade][subject][teacher]) acc[grade][subject][teacher] = [];
    acc[grade][subject][teacher].push(item);
    return acc;
  }, {}) : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      default: return <AlertCircle className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Global Header & Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 shrink-0">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Kho minh chứng</h3>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <div className="w-1 h-1 bg-indigo-400 rounded-full" />
              Lưu trữ & Trích xuất hồ sơ chuyên môn
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-1.5 pl-5 rounded-[20px] border-2 border-indigo-600/10 shadow-sm hover:border-indigo-600/30 transition-all group">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] leading-none mb-1">Đang xem năm học</span>
            <div className="relative">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none pl-0 pr-10 py-0 bg-transparent text-slate-900 rounded-xl text-sm font-black uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {SCHOOL_YEARS.map(year => (
                  <option key={year} value={year} className="text-slate-900 font-bold">Năm học {year}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-indigo-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Classification Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedItems([]);
              // Reset filters when switching to PL3 or from PL3
              if (tab.id === 'PL3' || activeTab === 'PL3') {
                setSelectedGrade('all');
                setSelectedTeacher('all');
                setSelectedSubject('all');
                setSelectedWeek('all');
              }
            }}
            className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-xl text-[13px] font-black uppercase tracking-wider transition-all ${
              activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'PL3' ? (
        <div className="space-y-6">
          {/* PL3 Specific Filters - Inspired by Monitoring Progress */}
          <div className="flex flex-wrap items-end gap-6 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            {/* Grade Select */}
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] pl-1">Chọn Khối Lớp</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                  <School className="w-4.5 h-4.5" />
                </div>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full pl-14 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-900 appearance-none cursor-pointer hover:border-indigo-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all outline-none shadow-sm"
                >
                  <option value="all">Tất cả khối</option>
                  {filtersData.grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Subject Select */}
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] pl-1">Chọn Môn Học</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                  <BookOpen className="w-4.5 h-4.5" />
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full pl-14 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-900 appearance-none cursor-pointer hover:border-emerald-300 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none shadow-sm"
                >
                  <option value="all">Tất cả môn học</option>
                  {filtersData.subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Week Select */}
            <div className="flex flex-col gap-1.5 min-w-[180px]">
              <label className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] pl-1">Chọn Tuần Học</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full pl-14 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-900 appearance-none cursor-pointer hover:border-amber-300 focus:border-amber-600 focus:bg-white focus:ring-4 focus:ring-amber-600/5 transition-all outline-none shadow-sm"
                >
                  <option value="all">Tất cả các tuần</option>
                  {filtersData.weeks.map(week => (
                    <option key={week} value={week}>{week}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Teacher Select */}
            <div className="flex flex-col gap-1.5 min-w-[220px]">
              <label className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] pl-1">Chọn Giáo Viên</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-200 group-focus-within:scale-110 transition-transform pointer-events-none z-10">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <select
                  value={selectedTeacher}
                  onChange={(e) => setSelectedTeacher(e.target.value)}
                  className="w-full pl-14 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-black text-slate-900 appearance-none cursor-pointer hover:border-rose-300 focus:border-rose-600 focus:bg-white focus:ring-4 focus:ring-rose-600/5 transition-all outline-none shadow-sm"
                >
                  <option value="all">Tất cả giáo viên</option>
                  {filtersData.teachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-1">Tìm kiếm bài dạy</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Nhập tên bài dạy..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Master-Detail Layout for PL3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Pane: Teacher List (Master) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Danh sách giáo viên</h4>
              </div>
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {filtersData.teachers.length > 0 ? (
                  filtersData.teachers.map((teacher, idx) => {
                    const teacherItems = filteredEvidence.filter(item => item.author === teacher);
                    if (teacherItems.length === 0 && selectedTeacher !== 'all' && selectedTeacher !== teacher) return null;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedTeacher(teacher === selectedTeacher ? 'all' : teacher)}
                        className={`w-full text-left p-4 border-b border-slate-100 transition-all duration-200 hover:bg-slate-50 ${
                          selectedTeacher === teacher
                            ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${selectedTeacher === teacher ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {teacher.split(' ').pop()?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${selectedTeacher === teacher ? 'text-indigo-900' : 'text-slate-700'}`}>
                              {teacher}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              {teacherItems.length} minh chứng
                            </p>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedTeacher === teacher ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm font-bold text-slate-400">Không tìm thấy giáo viên</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Evidence List (Detail) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên file</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest w-48">Giáo viên</th>
                      <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvidence.length > 0 ? (
                      filteredEvidence.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-left">
                                <p className="text-sm font-black text-slate-800 leading-tight">{item.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">{item.grade}</span>
                                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{item.subject}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1 whitespace-nowrap">{item.week}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-bold text-slate-600">{item.author}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem trực tuyến">
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Tải xuống">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                              <Search className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Không tìm thấy minh chứng nào phù hợp</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Content Card for other tabs */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-end gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab !== 'PL1' && (
              <>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Tìm tên hồ sơ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48"
                  />
                </div>
                
                {(activeTab === 'SCHEDULE' || activeTab === 'PL3') && (
                  <>
                    <select 
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">Tất cả khối/tổ</option>
                      {filtersData.grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>

                    {activeTab === 'PL3' && (
                      <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="all">Tất cả môn học</option>
                        {filtersData.subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    )}

                    <select 
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="all">Tất cả giáo viên</option>
                      {filtersData.teachers.map(teacher => (
                        <option key={teacher} value={teacher}>{teacher}</option>
                      ))}
                    </select>
                  </>
                )}

                {activeTab !== 'PL2' && activeTab !== 'SCHEDULE' && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-slate-100 transition-all">
                    <Filter className="w-3.5 h-3.5" />
                    Lọc
                  </button>
                )}

                <div className="w-px h-6 bg-slate-200 mx-1" />

                <button className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  <FileArchive className="w-3.5 h-3.5" />
                  Đóng gói (.zip)
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-50/50">
                {activeTab !== 'PL1' && (
                  <th className="px-6 py-4 w-12 text-center border border-slate-200">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === filteredEvidence.length && filteredEvidence.length > 0}
                      onChange={selectAll}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </th>
                )}
                <th className="px-6 py-4 text-[13px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">
                  {activeTab === 'PL1' ? 'Tên hồ sơ' : 'Tên hồ sơ / Minh chứng'}
                </th>
                <th className="px-6 py-4 text-[13px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">
                  {activeTab === 'SCHEDULE' ? 'Tên giáo viên' : 'Người soạn'}
                </th>
                {activeTab !== 'SCHEDULE' && (
                  <th className="px-6 py-4 text-[13px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">
                    {(activeTab === 'PL1' || activeTab === 'PL2') ? 'Ngày ban hành' : 'Ngày lưu'}
                  </th>
                )}
                {(activeTab !== 'PL1' && activeTab !== 'PL2' && activeTab !== 'SCHEDULE') && (
                  <th className="px-6 py-4 text-[13px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">Trạng thái ký</th>
                )}
                <th className="px-6 py-4 text-[13px] font-black text-slate-700 uppercase tracking-widest border border-slate-200">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'SCHEDULE' && groupedSchedule ? (
                Object.entries(groupedSchedule).map(([groupName, weeks]: [string, any]) => (
                  <React.Fragment key={groupName}>
                    {/* Group Header */}
                    <tr className="bg-indigo-50">
                      <td colSpan={4} className="px-6 py-3 border border-slate-200 text-left pl-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-indigo-900 uppercase tracking-widest">{groupName}</span>
                        </div>
                      </td>
                    </tr>
                    {Object.entries(weeks).map(([weekName, items]: [string, any]) => (
                      <React.Fragment key={`${groupName}-${weekName}`}>
                        {/* Week Header */}
                        <tr className="bg-slate-100/50">
                          <td colSpan={4} className="px-6 py-2 border border-slate-200 text-left pl-6">
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-indigo-400" />
                              <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">{weekName}</span>
                              <span className="text-[10px] font-bold text-slate-400 ml-2">({items.length} hồ sơ)</span>
                            </div>
                          </td>
                        </tr>
                        {items.map((item: any) => (
                          <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${selectedItems.includes(item.id) ? 'bg-indigo-50/30' : ''}`}>
                            <td className="px-6 py-4 text-center border border-slate-200">
                              <input 
                                type="checkbox" 
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItem(item.id)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="px-6 py-4 border border-slate-200">
                              <div className="flex items-center gap-3">
                                <div className="text-left">
                                  <p className="text-sm font-black text-slate-800 leading-tight">{item.name}</p>
                                  <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{item.id} • {item.size}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 border border-slate-200">
                              <span className="text-sm font-bold text-slate-600">{item.author}</span>
                            </td>
                            <td className="px-6 py-4 border border-slate-200">
                              <div className="flex items-center justify-center gap-2">
                                <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem trực tuyến">
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Tải xuống">
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                filteredEvidence.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors ${selectedItems.includes(item.id) ? 'bg-indigo-50/30' : ''}`}>
                    {activeTab !== 'PL1' && (
                      <td className="px-6 py-4 text-center border border-slate-200">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    )}
                    <td className="px-6 py-4 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-800 leading-tight">{item.name}</p>
                          <p className="text-xs text-slate-400 font-bold mt-0.5 uppercase tracking-wider">{item.id} • {item.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border border-slate-200">
                      <span className="text-sm font-bold text-slate-600">{item.author}</span>
                    </td>
                    <td className="px-6 py-4 border border-slate-200">
                      <span className="text-sm font-bold text-slate-500">{item.date}</span>
                    </td>
                    {(activeTab !== 'PL1' && activeTab !== 'PL2') && (
                      <td className="px-6 py-4 border border-slate-200">
                        <div className="flex items-center justify-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`text-xs font-black uppercase tracking-wider ${item.status === 'signed' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {item.status === 'signed' ? 'Đã ký số' : 'Chờ ký'}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 border border-slate-200">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem trực tuyến">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Tải xuống">
                          <Download className="w-4 h-4" />
                        </button>
                        {(activeTab !== 'PL1' && activeTab !== 'PL2') && (
                          <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Chia sẻ">
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEvidence.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-slate-200" />
            </div>
            <h5 className="text-lg font-bold text-slate-800">Không tìm thấy hồ sơ nào</h5>
            <p className="text-slate-500 text-sm max-w-xs mt-1">Không có hồ sơ nào cho năm học {selectedYear} trong danh mục này.</p>
          </div>
        )}

        {/* Footer */}
        {activeTab !== 'PL1' && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-xs font-black text-slate-500 uppercase tracking-wider">Trang 1 / 1</button>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
                  <ChevronDown className="w-4 h-4 rotate-90" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-50" disabled>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* Quick Actions Floating Bar */}
      {selectedItems.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-8 z-50 border border-white/20 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 pr-8 border-r border-white/20">
            <div className="w-8 h-8 bg-white text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black">
              {selectedItems.length}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Hồ sơ đã chọn</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:text-indigo-200 transition-colors">
              <Download className="w-4 h-4" />
              Tải hàng loạt
            </button>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:text-indigo-200 transition-colors">
              <Printer className="w-4 h-4" />
              In hàng loạt
            </button>
            <button 
              onClick={() => setSelectedItems([])}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-200 hover:text-rose-100 transition-colors"
            >
              Hủy chọn
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EvidenceExtraction;
