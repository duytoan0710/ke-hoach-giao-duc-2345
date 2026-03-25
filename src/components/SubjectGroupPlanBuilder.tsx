import React, { useState } from 'react';
import { 
  Layers, 
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SubjectPlanEditor from './SubjectPlanEditor';
import MasterPlanMerger from './MasterPlanMerger';
import { SUBJECT_GROUPS } from '../constants/subjectGroups';

export default function SubjectGroupPlanBuilder({ 
  role = 'head', 
  subjectGroup, 
  setSubjectGroup,
  selectedGrade,
  setSelectedGrade
}: { 
  role?: 'teacher_unassigned' | 'teacher_assigned' | 'head' | 'principal',
  subjectGroup: string,
  setSubjectGroup: (val: string) => void,
  selectedGrade: number,
  setSelectedGrade: (val: number) => void
}) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [config] = useState({
    subjectGroups: SUBJECT_GROUPS
  });

  const selectedGroupConfig = config.subjectGroups.find(g => g.name === subjectGroup);
  const subjectGroupSubjects = selectedGroupConfig ? selectedGroupConfig.subjects : [];

  return (
    <div className="flex flex-col w-full min-h-full">
      {/* Top Navigation Tabs */}
      <div className="flex-none flex items-center gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit mx-auto">
        <button
          onClick={() => setCurrentStep(1)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
            currentStep === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Bước 1: Lập KHGD môn học
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
            currentStep === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Bước 2: Hợp nhất kế hoạch và trình ký
        </button>
      </div>

      {role === 'teacher_unassigned' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">Chế độ chỉ xem</h4>
            <p className="text-xs text-amber-700 mt-1">
              Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Giáo viên, không được phân quyền để tạo lập hoặc chỉnh sửa.
            </p>
          </div>
        </div>
      )}
      {role === 'principal' && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">Chế độ chỉ xem</h4>
            <p className="text-xs text-amber-700 mt-1">
              Nhiệm vụ lập kế hoạch tổ là của Tổ trưởng chuyên môn. Bạn đang xem với quyền Ban giám hiệu, không được phân quyền để tạo lập hoặc chỉnh sửa.
            </p>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {currentStep === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
            >
              <SubjectPlanEditor 
                role={role} 
                subjectGroupSubjects={subjectGroupSubjects} 
                subjectGroupName={subjectGroup} 
                selectedGrade={selectedGrade}
                setSelectedGrade={setSelectedGrade}
                onNextStep={() => setCurrentStep(2)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col"
            >
              <MasterPlanMerger 
                role={role}
                subjectGroupSubjects={subjectGroupSubjects} 
                subjectGroupName={subjectGroup} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
