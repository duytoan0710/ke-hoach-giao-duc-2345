import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  User, 
  ChevronDown, 
  Eye, 
  Edit3, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  LayoutGrid,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import TeachingScheduleEditor from './TeachingScheduleEditor';

interface WeeklySchedule {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: 
    | 'not_allowed'      // 1. Chưa được soạn
    | 'not_started'      // 2. Chưa soạn
    | 'draft'            // 3. Bản nháp
    | 'ready_to_sign'    // 4. Chờ trình ký
    | 'pending_leader'   // 5. Chờ tổ trưởng ký
    | 'pending_board'    // 6. Chờ BGH ký
    | 'pending_clerk'    // 7. Chờ Văn thư ký
    | 'issued';          // 8. Đã ban hành
  teacherName: string;
  grade: string;
}

const MOCK_TEACHERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E'
];

const MOCK_GRADES = ['Khối 1', 'Khối 2', 'Khối 3', 'Khối 4', 'Khối 5'];

// Helper to generate weeks for a school year (starting Sept 2025)
const generateWeeks = (currentWeekNum: number): WeeklySchedule[] => {
  const weeks: WeeklySchedule[] = [];
  const startDate = new Date('2025-09-01');
  
  for (let i = 1; i <= 40; i++) {
    const weekStart = new Date(startDate);
    weekStart.setDate(startDate.getDate() + (i - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    let status: WeeklySchedule['status'] = 'not_started';
    
    if (i > currentWeekNum + 1) {
      status = 'not_allowed';
    } else if (i === currentWeekNum) {
      status = 'draft';
    } else if (i === currentWeekNum + 1) {
      status = 'not_started';
    } else if (i === currentWeekNum - 1) {
      status = 'pending_leader';
    } else if (i === currentWeekNum - 2) {
      status = 'pending_board';
    } else if (i === currentWeekNum - 3) {
      status = 'pending_clerk';
    } else if (i < currentWeekNum - 3) {
      status = 'issued';
    }
    
    weeks.push({
      id: `W${i}`,
      weekNumber: i,
      startDate: weekStart.toLocaleDateString('vi-VN'),
      endDate: weekEnd.toLocaleDateString('vi-VN'),
      status,
      teacherName: 'Nguyễn Văn A',
      grade: 'Khối 3'
    });
  }
  return weeks;
};

export default function TeachingScheduleManager() {
  const [filterGrade, setFilterGrade] = useState('Khối 3');
  const [filterTeacher, setFilterTeacher] = useState('Nguyễn Văn A');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingWeek, setEditingWeek] = useState<WeeklySchedule | null>(null);

  // Current date for grouping (simulated as Mar 19, 2026)
  const currentDate = new Date('2026-03-19');
  const currentWeekNum = 29; // Based on Mar 19, 2026
  
  const ALL_WEEKS = useMemo(() => generateWeeks(currentWeekNum), [currentWeekNum]);
  
  const groupedWeeks = useMemo(() => {
    const filtered = ALL_WEEKS.filter(w => {
      const matchesSearch = w.weekNumber.toString().includes(searchQuery);
      return matchesSearch;
    });

    return {
      current: filtered.filter(w => w.weekNumber === currentWeekNum),
      next: filtered.filter(w => w.weekNumber === currentWeekNum + 1),
      past: filtered.filter(w => w.weekNumber < currentWeekNum).sort((a, b) => b.weekNumber - a.weekNumber),
      future: filtered.filter(w => w.weekNumber > currentWeekNum + 1)
    };
  }, [searchQuery, ALL_WEEKS, currentWeekNum]);

  const getStatusBadge = (status: WeeklySchedule['status']) => {
    const baseClass = "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border w-[120px] justify-center";
    
    switch (status) {
      case 'not_allowed':
        return (
          <span className={`${baseClass} bg-slate-50 text-slate-400 border-slate-100`}>
            <AlertCircle className="w-2.5 h-2.5" /> Chưa được soạn
          </span>
        );
      case 'not_started':
        return (
          <span className={`${baseClass} bg-slate-100 text-slate-500 border-slate-200`}>
            <Edit3 className="w-2.5 h-2.5" /> Chưa soạn
          </span>
        );
      case 'draft':
        return (
          <span className={`${baseClass} bg-indigo-50 text-indigo-600 border-indigo-100`}>
            <Edit3 className="w-2.5 h-2.5" /> Bản nháp
          </span>
        );
      case 'ready_to_sign':
        return (
          <span className={`${baseClass} bg-blue-50 text-blue-600 border-blue-100`}>
            <Send className="w-2.5 h-2.5" /> Chờ trình ký
          </span>
        );
      case 'pending_leader':
        return (
          <span className={`${baseClass} bg-amber-50 text-amber-600 border-amber-100`}>
            <Clock className="w-2.5 h-2.5" /> Chờ tổ trưởng ký
          </span>
        );
      case 'pending_board':
        return (
          <span className={`${baseClass} bg-orange-50 text-orange-600 border-orange-100`}>
            <Clock className="w-2.5 h-2.5" /> Chờ BGH ký
          </span>
        );
      case 'pending_clerk':
        return (
          <span className={`${baseClass} bg-cyan-50 text-cyan-600 border-cyan-100`}>
            <Clock className="w-2.5 h-2.5" /> Chờ Văn thư ký
          </span>
        );
      case 'issued':
        return (
          <span className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-100`}>
            <CheckCircle2 className="w-2.5 h-2.5" /> Đã ban hành
          </span>
        );
    }
  };

  const renderTable = (weeks: WeeklySchedule[], title: string, color: string) => {
    if (weeks.length === 0) return null;

    return (
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-4 rounded-full ${color}`} />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{title}</h3>
          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold">
            {weeks.length} tuần
          </span>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 divide-x divide-slate-200">
                <th className="w-[20%] px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">Tuần</th>
                <th className="w-[30%] px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">Thời gian</th>
                <th className="w-[25%] px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider border-r border-slate-200">Trạng thái</th>
                <th className="w-[25%] px-3 py-2 text-[9px] font-black text-slate-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeks.map((week) => (
                <tr key={week.id} className="hover:bg-slate-50/50 transition-colors group divide-x divide-slate-100">
                  <td className="w-[20%] px-3 py-1.5 whitespace-nowrap border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center font-black text-[10px] ${
                        title === 'Tuần hiện tại' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {week.weekNumber}
                      </div>
                      <span className="font-bold text-slate-700 text-[13px]">Tuần {week.weekNumber}</span>
                    </div>
                  </td>
                  <td className="w-[30%] px-3 py-1.5 whitespace-nowrap border-r border-slate-100">
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-600 font-medium">
                      <Calendar className="w-2.5 h-2.5 text-slate-400" />
                      <span>{week.startDate}</span>
                      <ChevronRight className="w-2 h-2 text-slate-300" />
                      <span>{week.endDate}</span>
                    </div>
                  </td>
                  <td className="w-[25%] px-3 py-1.5 whitespace-nowrap border-r border-slate-100">
                    {getStatusBadge(week.status)}
                  </td>
                  <td className="w-[25%] px-3 py-1.5 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {/* Action buttons based on status */}
                      {week.status === 'not_started' && (
                        <button 
                          onClick={() => setEditingWeek(week)}
                          className="flex items-center gap-1 px-2 py-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded text-[10px] font-bold transition-all" 
                          title="Soạn lịch"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Soạn</span>
                        </button>
                      )}

                      {week.status === 'draft' && (
                        <>
                          <button 
                            className="flex items-center gap-1 px-2 py-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded text-[10px] font-bold transition-all" 
                            title="Xem"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem</span>
                          </button>
                          <button 
                            onClick={() => setEditingWeek(week)}
                            className="flex items-center gap-1 px-2 py-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded text-[10px] font-bold transition-all" 
                            title="Sửa"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Sửa</span>
                          </button>
                        </>
                      )}

                      {week.status === 'ready_to_sign' && (
                        <button className="flex items-center gap-1 px-2 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded text-[10px] font-bold transition-all" title="Trình ký">
                          <Send className="w-3 h-3" />
                          <span>Trình ký</span>
                        </button>
                      )}

                      {['pending_leader', 'pending_board', 'pending_clerk', 'issued'].includes(week.status) && (
                        <button className="flex items-center gap-1 px-2 py-1 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded text-[10px] font-bold transition-all" title="Xem">
                          <Eye className="w-3 h-3" />
                          <span>Xem</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4 w-full">
      <AnimatePresence mode="wait">
        {editingWeek ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1"
          >
            <TeachingScheduleEditor 
              weekNumber={editingWeek.weekNumber}
              startDate={editingWeek.startDate}
              endDate={editingWeek.endDate}
              onBack={() => setEditingWeek(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full gap-4 w-full"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0">
              <div className="space-y-0">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Quản lý lịch báo giảng</h2>
                <p className="text-[12px] text-slate-400 font-medium">Lập kế hoạch giảng dạy và báo giảng hàng tuần</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Tìm theo số tuần..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <div className="relative flex-1 sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-indigo-400" />
                </div>
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm font-medium text-slate-700 appearance-none"
                >
                  {MOCK_GRADES.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-emerald-400" />
                </div>
                <select
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm font-medium text-slate-700 appearance-none"
                >
                  {MOCK_TEACHERS.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTable(groupedWeeks.current, 'Tuần hiện tại', 'bg-indigo-500')}
                {renderTable(groupedWeeks.next, 'Tuần tới', 'bg-emerald-500')}
                {renderTable(groupedWeeks.past, 'Tuần đã qua', 'bg-slate-400')}
                {renderTable(groupedWeeks.future, 'Tuần sắp tới', 'bg-blue-400')}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
