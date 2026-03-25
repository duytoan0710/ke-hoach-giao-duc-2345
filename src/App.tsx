/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  School, 
  FileText, 
  PenTool, 
  BarChart3, 
  Archive, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import GradePlanContainer from './components/GradePlanContainer';
import SubjectGroupPlanBuilder from './components/SubjectGroupPlanBuilder';
import DigitalSignatureManager from './components/DigitalSignatureManager';
import LessonPlanEditor from './components/LessonPlanEditor';
import SchoolEducationPlanBuilder from './components/SchoolEducationPlanBuilder';
import TeachingScheduleManager from './components/TeachingScheduleManager';
import MonitoringProgress from './components/MonitoringProgress';
import EvidenceExtraction from './components/EvidenceExtraction';
import WorkflowFlowchart from './components/WorkflowFlowchart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SUBJECT_GROUPS } from './constants/subjectGroups';
import { GRADES } from './constants/grades';
import { ChevronDown } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_ITEMS = [
  { 
    id: 'workflow', 
    title: 'Quy trình làm việc', 
    icon: LayoutDashboard, 
    subItems: [] 
  },
  { 
    id: 'pl1', 
    title: 'Kế hoạch Trường', 
    icon: School, 
    subItems: [
      { id: 'pl1_build', title: 'Xây dựng KHGD nhà trường' }
    ] 
  },
  { 
    id: 'pl2', 
    title: 'Kế hoạch Tổ', 
    icon: BookOpen, 
    subItems: [
      { id: 'pl2_grade', title: 'Kế hoạch tổ khối' },
      { id: 'pl2_subject', title: 'Kế hoạch tổ bộ môn' }
    ] 
  },
  { 
    id: 'schedule', 
    title: 'Lịch báo giảng', 
    icon: Calendar, 
    subItems: [
      { id: 'schedule_view', title: 'Quản lý lịch báo giảng' }
    ] 
  },
  { 
    id: 'pl3', 
    title: 'Giáo án tuần', 
    icon: FileText, 
    subItems: [
      { id: 'pl3_editor', title: 'Soạn kế hoạch bài dạy' }
    ] 
  },
  { 
    id: 'signing', 
    title: 'Quản lý Ký số', 
    icon: PenTool, 
    subItems: [
      { id: 'signing_school', title: 'Kế hoạch trường' },
      { id: 'signing_group', title: 'Kế hoạch tổ' },
      { id: 'signing_schedule', title: 'Lịch báo giảng' },
      { id: 'signing_lesson', title: 'Kế hoạch bài dạy' }
    ] 
  },
  { 
    id: 'monitoring', 
    title: 'Giám sát & Báo cáo', 
    icon: BarChart3, 
    subItems: [
      { id: 'monitoring_progress', title: 'Theo dõi tiến độ' }
    ] 
  },
  { 
    id: 'evidence', 
    title: 'Kho Minh chứng', 
    icon: Archive, 
    subItems: [
      { id: 'evidence_extract', title: 'Trích xuất thanh tra' }
    ] 
  },
];

export default function App() {
  const [activeMenu, setActiveMenu] = useState('pl2_grade');
  const [expandedMenu, setExpandedMenu] = useState<string | null>('pl2');
  const [role, setRole] = useState<'teacher_unassigned' | 'teacher_assigned' | 'head' | 'principal'>('head');
  const [subjectGroup, setSubjectGroup] = useState('Tiếng Anh');
  const [selectedGrade, setSelectedGrade] = useState(4);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLevel1Click = (item: any) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      if (item.subItems.length > 0) {
        setExpandedMenu(item.id);
      } else {
        setActiveMenu(item.id);
        setExpandedMenu(null);
      }
      return;
    }

    if (item.subItems.length > 0) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      setActiveMenu(item.id);
      setExpandedMenu(null);
    }
  };

  const renderDashboard = () => {
    switch (role) {
      case 'teacher_assigned':
      case 'teacher_unassigned':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cá nhân</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Giáo án</h3>
                <div className="flex items-end gap-2 mt-2">
                  <p className="text-3xl font-bold">85%</p>
                  <p className="text-xs text-slate-400 mb-1">34/40 bài</p>
                </div>
                <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[85%]"></div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khối 4</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Kế hoạch Tổ</h3>
                <p className="text-lg font-bold mt-2 text-emerald-600">Đã ban hành</p>
                <p className="text-xs text-slate-400 mt-1">Căn cứ để soạn giáo án</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cần sửa</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">Hồ sơ trả về</h3>
                <p className="text-3xl font-bold mt-2 text-rose-600">02</p>
                <p className="text-xs text-slate-400 mt-1">Vui lòng kiểm tra lý do</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    Tác vụ cần làm
                  </h3>
                  <button className="text-xs text-indigo-600 font-semibold">Xem tất cả</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { title: 'Sửa giáo án: Bài 15 - Tiếng Việt', status: 'Bị trả về', time: '2 giờ trước', color: 'text-rose-600' },
                    { title: 'Soạn giáo án: Bài 18 - Toán', status: 'Chưa soạn', time: 'Hạn: Thứ 6', color: 'text-amber-600' },
                    { title: 'Ký số xác nhận Kế hoạch Tổ Khối 4', status: 'Chờ ký', time: 'Hôm nay', color: 'text-indigo-600' },
                  ].map((task, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{task.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{task.time}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-100 ${task.color}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Nhắc nhở Deadline</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-indigo-900 font-bold">!</div>
                      <div>
                        <p className="text-sm font-bold">Hoàn thành giáo án Tuần 24</p>
                        <p className="text-xs text-indigo-200">Còn lại 2 ngày để nộp cho Tổ trưởng</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <Clock className="w-40 h-40" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'head':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium">Tiến độ Tổ chuyên môn</h3>
                <p className="text-3xl font-bold mt-2">72%</p>
                <div className="mt-4 flex gap-1 h-2">
                  <div className="flex-[72] bg-indigo-600 rounded-full"></div>
                  <div className="flex-[28] bg-slate-100 rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-wider">12/15 Giáo viên hoàn thành</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium">Hồ sơ chờ duyệt</h3>
                <p className="text-3xl font-bold mt-2 text-indigo-600">18</p>
                <p className="text-xs text-slate-400 mt-1">Khối: 02 | Giáo án: 16</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-500 text-sm font-medium">Chậm tiến độ</h3>
                <p className="text-3xl font-bold mt-2 text-rose-600">03</p>
                <p className="text-xs text-slate-400 mt-1">Giáo viên chưa nộp giáo án tuần</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold">Danh sách phê duyệt tập trung</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-3">Giáo viên</th>
                      <th className="px-6 py-3">Loại hồ sơ</th>
                      <th className="px-6 py-3">Nội dung</th>
                      <th className="px-6 py-3">Thời gian</th>
                      <th className="px-6 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { name: 'Nguyễn Văn A', type: 'Giáo án', content: 'Toán - Tuần 24', time: '10 phút trước' },
                      { name: 'Trần Thị B', type: 'Giáo án', content: 'Tiếng Việt - Tuần 24', time: '1 giờ trước' },
                      { name: 'Lê Văn C', type: 'Kế hoạch Tổ', content: 'Điều chỉnh KHGD Khối 4', time: '3 giờ trước' },
                    ].map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase">{item.type}</span></td>
                        <td className="px-6 py-4 text-slate-500">{item.content}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{item.time}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-indigo-600 font-bold hover:underline">Duyệt nhanh</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'principal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Kế hoạch Trường', val: '100%', sub: 'Đã ban hành', color: 'text-emerald-600' },
                { label: 'Kế hoạch Tổ', val: '92%', sub: '14/15 Khối đã duyệt', color: 'text-indigo-600' },
                { label: 'Giáo án toàn trường', val: '88%', sub: '4.500/5.100 bài', color: 'text-blue-600' },
                { label: 'Chờ Hiệu trưởng ký', val: '05', sub: 'Kế hoạch Trường, Kế hoạch Tổ', color: 'text-rose-600' },
              ].map((stat, i) => (
                <div key={stat.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</h3>
                  <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.val}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold mb-6">Tiến độ hoàn thành theo Khối lớp</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Khối 1', p: 95 },
                    { label: 'Khối 2', p: 88 },
                    { label: 'Khối 3', p: 92 },
                    { label: 'Khối 4', p: 75 },
                    { label: 'Khối 5', p: 90 },
                  ].map(k => (
                    <div key={k.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-slate-500">{k.label}</span>
                        <span className="text-indigo-600">{k.p}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${k.p}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold mb-4">Hồ sơ trình ký ban hành</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Kế hoạch Tổ</span>
                        <span className="text-[10px] text-slate-400">Hôm nay</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Kế hoạch giáo dục Khối {i + 2}</p>
                      <p className="text-xs text-slate-400 mt-1">Người trình: Tổ trưởng Khối {i + 2}</p>
                      <button className="w-full mt-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-indigo-600 transition-colors">
                        Ký ban hành
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#E2EFFF] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0`}>
        <div className={`h-20 px-4 flex items-center border-b border-slate-200 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2 leading-none whitespace-nowrap">
                <School className="w-7 h-7" />
                <span>EduPlan 2345</span>
              </h1>
              <p className="text-[10px] text-slate-500 mt-1.5 font-medium uppercase tracking-wider whitespace-nowrap">Hệ thống quản lý KHGD</p>
            </div>
          )}
          {isSidebarCollapsed && (
             <School className="w-8 h-8 text-indigo-600" />
          )}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all animate-pulse ring-2 ring-indigo-300 ring-offset-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        
        {isSidebarCollapsed && (
          <div className="flex justify-center py-4 border-b border-slate-100">
            <button 
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all animate-pulse ring-2 ring-indigo-300 ring-offset-2"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 overflow-x-hidden">
          {MENU_ITEMS.map((item) => {
            const isExpanded = expandedMenu === item.id;
            const hasActiveSubItem = item.subItems.some((sub: any) => sub.id === activeMenu);
            const isWorkflowActive = item.id === 'workflow' && activeMenu === 'workflow';

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleLevel1Click(item)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isWorkflowActive || (hasActiveSubItem && !isExpanded)
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-semibold' 
                      : 'text-black hover:bg-slate-50 hover:text-indigo-900'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.title : ''}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isWorkflowActive || (hasActiveSubItem && !isExpanded) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'
                  }`} />
                  
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</span>
                      {item.subItems.length > 0 && (
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
                          isExpanded ? 'rotate-90 text-indigo-400' : 'text-slate-300'
                        }`} />
                      )}
                    </>
                  )}
                </button>
                
                {!isSidebarCollapsed && isExpanded && item.subItems.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative ml-6 overflow-hidden"
                  >
                    {/* Vertical Line Connector */}
                    <div className="absolute left-[20px] top-0 bottom-4 w-[1px] bg-amber-500 z-0"></div>
                    
                    <div className="py-1 space-y-1">
                      {item.subItems.map((sub: any) => (
                        <button 
                          key={sub.id} 
                          onClick={() => setActiveMenu(sub.id)}
                          className={`relative w-full text-left py-2.5 pl-10 pr-4 text-xs transition-all group rounded-lg whitespace-nowrap overflow-hidden text-ellipsis ${
                            activeMenu === sub.id 
                              ? 'text-indigo-950 bg-indigo-100 font-bold' 
                              : 'text-slate-900 hover:text-indigo-950 hover:bg-indigo-50'
                          }`}
                        >
                          {/* Dot Connector */}
                          <div className={`absolute left-[16px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-amber-600 transition-colors z-10 ${
                            activeMenu === sub.id ? 'bg-amber-500' : 'bg-white group-hover:bg-amber-400'
                          }`}></div>
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            {(activeMenu === 'pl2_subject' || activeMenu === 'pl2_grade') ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-800 leading-tight">
                    {activeMenu === 'pl2_subject' ? 'Kế hoạch giáo dục Tổ bộ môn' : 'Kế hoạch giáo dục Tổ khối'}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    {activeMenu === 'pl2_subject' ? (
                      <div className="relative flex items-center group">
                        <select 
                          value={subjectGroup}
                          onChange={(e) => setSubjectGroup(e.target.value)}
                          className="text-[11px] font-black text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100/80 border border-indigo-100 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none shadow-sm"
                        >
                          {SUBJECT_GROUPS.map(g => (
                            <option key={g.id} value={g.name}>Tổ {g.name}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-indigo-500 absolute right-2.5 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    ) : (
                      <div className="relative flex items-center group">
                        <select 
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(Number(e.target.value))}
                          className="text-[11px] font-black text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100/80 border border-indigo-100 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none shadow-sm"
                        >
                          {GRADES.map(g => (
                            <option key={g.id} value={g.id}>{g.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-indigo-500 absolute right-2.5 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="text-lg font-semibold text-slate-800">
                {(() => {
                  for (const item of MENU_ITEMS) {
                    if (item.id === activeMenu) return item.title;
                    const sub = item.subItems.find((s: any) => s.id === activeMenu);
                    if (sub) return sub.title;
                  }
                  return '';
                })()}
              </h2>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Premium Role Switcher */}
            <div className="flex flex-col items-end mr-2">
              <div className="relative flex items-center group">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="text-xs font-black text-slate-700 bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all appearance-none shadow-sm hover:border-slate-300"
                >
                  <option value="teacher_unassigned">Giáo viên (Chỉ xem)</option>
                  <option value="teacher_assigned">Giáo viên (Được phân công)</option>
                  <option value="head">Tổ trưởng</option>
                  <option value="principal">Ban giám hiệu</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl text-xs font-black border border-amber-100 shadow-sm shadow-amber-100/50">
              <Clock className="w-3.5 h-3.5" />
              <span>Học kỳ II - 2025-2026</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <motion.div 
            key={`${activeMenu}-${role}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-full flex flex-col w-full"
          >
            {activeMenu === 'workflow' ? (
              <WorkflowFlowchart />
            ) : 
             activeMenu === 'pl2_grade' ? <GradePlanContainer role={role} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} /> : 
             activeMenu === 'pl2_subject' ? <SubjectGroupPlanBuilder role={role} subjectGroup={subjectGroup} setSubjectGroup={setSubjectGroup} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} /> : 
             activeMenu === 'pl3_editor' ? <LessonPlanEditor /> :
             activeMenu === 'pl1_build' ? <SchoolEducationPlanBuilder /> :
             activeMenu === 'schedule_view' ? <TeachingScheduleManager /> :
             activeMenu === 'signing_school' ? <DigitalSignatureManager role={role} filterType="PL1" /> :
             activeMenu === 'signing_group' ? <DigitalSignatureManager role={role} filterType="PL2" /> :
             activeMenu === 'signing_schedule' ? <DigitalSignatureManager role={role} filterType="SCHEDULE" /> :
             activeMenu === 'signing_lesson' ? <DigitalSignatureManager role={role} filterType="PL3" /> :
             activeMenu === 'monitoring_progress' ? <MonitoringProgress /> :
             activeMenu === 'evidence_extract' ? <EvidenceExtraction /> : (
              <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <LayoutDashboard className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Tính năng đang được thiết lập</h3>
                  <p className="text-slate-500 max-w-md">
                    Vui lòng cung cấp cấu trúc Database Schema để tôi có thể hoàn thiện logic nghiệp vụ cho module này.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

