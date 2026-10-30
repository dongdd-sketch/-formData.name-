import React, { useState, useMemo, useContext, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  LayoutDashboard, List, PlusCircle, TrendingUp, CheckCircle, 
  Clock, AlertCircle, DollarSign, Briefcase, Globe, Edit, User, Trash2,
  Search, Download, RefreshCw, Filter, Layers, Percent
} from 'lucide-react';

// --- I18N SETUP ---
const translations = {
  en: {
    appTitle: "Enterprise DX Tracker", dashboard: "Dashboard", projectsList: "Projects List", newProject: "New Project",
    dept_All: "All Departments", dept_GA: "General Affairs (GA)", dept_RE: "Recruitment & Training (RE)", dept_HR: "Human Resources (HR)", formDepartment: "Department", colDept: "Dept",
    overview: "Overview Dashboard", filterYear: "Filter Year:", allYears: "All Years",
    totalProjects: "Total Projects", totalSavings: "Total CR Amount (VNĐ)", timeSavings: "Time Saved/Mo", completionRate: "Task Completion", tasksDone: "tasks done",
    statusDist: "Project Status Distribution", noData: "No data for selected period", expectedSavings: "Monthly CR and Time Savings", selectYear: "(Select a specific year)", pleaseSelectYear: "Please select a specific year from the filter above to view monthly savings distribution.",
    portfolio: "DX Project Portfolio", colName: "Project Name", colPIC: "PIC", colTimeline: "Timeline", colStatus: "Status", colSavings: "Total CR (VNĐ)", colTime: "Time Saved", colProgress: "Progress", colActions: "Actions", noProjects: "No projects found for selected criteria.",
    addTitle: "Add New DX Project", editTitle: "Update DX Project", formName: "Project Name", formNamePlaceholder: "e.g. AI Customer Service", formPIC: "Person In Charge", formPICPlaceholder: "e.g. John Doe", formStartYear: "Start Year", formStartMonth: "Start Month", formStatus: "Status", formTotalTasks: "Total Tasks", formCompletedTasks: "Completed Tasks", btnCancel: "Cancel", btnSave: "Save Project", btnUpdate: "Update Project",
    status_Completed: "Completed", "status_In Progress": "In Progress", status_Pending: "Pending",
    month_Jan: "Jan", month_Feb: "Feb", month_Mar: "Mar", month_Apr: "Apr", month_May: "May", month_Jun: "Jun", month_Jul: "Jul", month_Aug: "Aug", month_Sep: "Sep", month_Oct: "Oct", month_Nov: "Nov", month_Dec: "Dec",
    formCategory: "Category", cat_Internal: "Internal", cat_Cross: "Cross-dept",
    formCurrentMethod: "Current Method", formImprovement: "Improvement",
    formPriority: "Priority", formImplMethod: "Implementation By", impl_Self: "Self", impl_IT: "IT Support", impl_Outsource: "Outsourced",
    formTools: "Tools (GAS, VBA...)", formTimePerTime: "Mins Saved/Time", formTimesPerMonth: "Times/Month", formTotalTime: "Total Time Saved (Hrs)",
    formMoneyFactor: "Money Factor (VNĐ/Hr)", formTotalCR: "Total CR (VNĐ)",
    legendCR: "Total CR Amount (VNĐ)", legendTime: "Total Time (Hrs)",
    searchPlaceholder: "Search by project name, PIC, tools...",
    exportCsv: "Export CSV",
    resetData: "Reset Data",
    confirmReset: "Are you sure you want to reset to default sample data?",
    confirmDelete: "Are you sure you want to delete this project?",
    completedCount: "tasks done"
  },
  vi: {
    appTitle: "Theo dõi chuyển đổi số (DX)", dashboard: "Tổng quan", projectsList: "Danh sách dự án", newProject: "Dự án mới",
    dept_All: "Tất cả phòng ban", dept_GA: "Hành chính (GA)", dept_RE: "Tuyển dụng & Đào tạo (RE)", dept_HR: "Nhân sự (HR)", formDepartment: "Phòng ban", colDept: "Phòng ban",
    overview: "Bảng điều khiển Tổng quan", filterYear: "Lọc theo năm:", allYears: "Tất cả các năm",
    totalProjects: "Tổng số dự án", totalSavings: "Tổng số tiền CR (VNĐ)", timeSavings: "TG Tiết kiệm/Tháng", completionRate: "Tỷ lệ hoàn thành", tasksDone: "công việc đã xong",
    statusDist: "Phân bổ trạng thái", noData: "Không có dữ liệu", expectedSavings: "Tổng số tiền CR & Thời gian giảm theo tháng", selectYear: "(Chọn một năm)", pleaseSelectYear: "Vui lòng chọn một năm cụ thể để xem.",
    portfolio: "Danh mục dự án DX", colName: "Tên công việc", colPIC: "Tên PIC", colTimeline: "Thời gian", colStatus: "Trạng thái", colSavings: "Tổng tiền CR (VNĐ)", colTime: "Tổng TG (Giờ)", colProgress: "Tiến độ", colActions: "Thao tác", noProjects: "Không tìm thấy dự án.",
    addTitle: "Thêm dự án DX", editTitle: "Cập nhật dự án", formName: "Tên công việc", formNamePlaceholder: "vd. Tự động hóa...", formPIC: "Tên PIC", formPICPlaceholder: "vd. Nguyễn Văn A", formStartYear: "Năm bắt đầu", formStartMonth: "Tháng bắt đầu", formStatus: "Trạng thái", formTotalTasks: "Tổng công việc", formCompletedTasks: "Đã hoàn thành", btnCancel: "Hủy", btnSave: "Lưu dự án", btnUpdate: "Cập nhật",
    status_Completed: "Hoàn thành", "status_In Progress": "Đang thực hiện", status_Pending: "Chờ xử lý",
    month_Jan: "Th 1", month_Feb: "Th 2", month_Mar: "Th 3", month_Apr: "Th 4", month_May: "Th 5", month_Jun: "Th 6", month_Jul: "Th 7", month_Aug: "Th 8", month_Sep: "Th 9", month_Oct: "Th 10", month_Nov: "Th 11", month_Dec: "Th 12",
    formCategory: "Phân loại", cat_Internal: "Nội bộ", cat_Cross: "Liên phòng",
    formCurrentMethod: "Cách làm hiện tại", formImprovement: "Thay đổi/Cải tiến",
    formPriority: "Thứ tự ưu tiên", formImplMethod: "Phương pháp thực hiện", impl_Self: "Tự thực hiện", impl_IT: "IT hỗ trợ", impl_Outsource: "Thuê ngoài",
    formTools: "Công cụ hỗ trợ (GAS, VBA...)", formTimePerTime: "TG giảm/lần (Phút)", formTimesPerMonth: "Số lần/tháng", formTotalTime: "Tổng TG giảm/tháng (Giờ)",
    formMoneyFactor: "Hệ số tiền (VNĐ/Giờ)", formTotalCR: "Tổng Số tiền CR (VNĐ)",
    legendCR: "Tổng Số tiền CR (VNĐ)", legendTime: "Tổng thời gian giảm (Giờ)",
    searchPlaceholder: "Tìm kiếm theo tên công việc, PIC, công cụ...",
    exportCsv: "Xuất dữ liệu CSV",
    resetData: "Đặt lại mẫu",
    confirmReset: "Bạn có chắc chắn muốn đặt lại dữ liệu về mẫu ban đầu?",
    confirmDelete: "Bạn có chắc chắn muốn xóa dự án này?",
    completedCount: "công việc đã xong"
  },
  ja: {
    appTitle: "DXプロジェクト トラッカー", dashboard: "ダッシュボード", projectsList: "プロジェクト一覧", newProject: "新規プロジェクト",
    dept_All: "全部署", dept_GA: "総務 (GA)", dept_RE: "採用・教育 (RE)", dept_HR: "人事 (HR)", formDepartment: "部署", colDept: "部署",
    overview: "概要ダッシュボード", filterYear: "年で絞り込み:", allYears: "すべての年",
    totalProjects: "総プロジェクト数", totalSavings: "総CR金額 (VNĐ)", timeSavings: "節約時間 (月)", completionRate: "タスク完了率", tasksDone: "タスク完了",
    statusDist: "プロジェクト状況の分布", noData: "データはありません", expectedSavings: "月別のCR金額と節約時間", selectYear: "(特定の年を選択)", pleaseSelectYear: "特定の年を選択してください。",
    portfolio: "DX プロジェクト", colName: "業務名", colPIC: "担当者", colTimeline: "開始月", colStatus: "ステータス", colSavings: "総CR (VNĐ)", colTime: "節約時間(時)", colProgress: "進捗", colActions: "操作", noProjects: "プロジェクトは見つかりませんでした。",
    addTitle: "新規プロジェクトの追加", editTitle: "プロジェクトの更新", formName: "業務名", formNamePlaceholder: "例: 自動化", formPIC: "担当者 (PIC)", formPICPlaceholder: "例: 山田 太郎", formStartYear: "開始年", formStartMonth: "開始月", formStatus: "ステータス", formTotalTasks: "総タスク数", formCompletedTasks: "完了タスク数", btnCancel: "キャンセル", btnSave: "保存", btnUpdate: "更新",
    status_Completed: "完了", "status_In Progress": "進行中", status_Pending: "保留中",
    month_Jan: "1月", month_Feb: "2月", month_Mar: "3月", month_Apr: "4月", month_May: "5月", month_Jun: "6月", month_Jul: "7月", month_Aug: "8月", month_Sep: "9月", month_Oct: "10月", month_Nov: "11月", month_Dec: "12月",
    formCategory: "分類", cat_Internal: "内部", cat_Cross: "部門間",
    formCurrentMethod: "現在の方法", formImprovement: "改善",
    formPriority: "優先順位", formImplMethod: "実施方法", impl_Self: "自己実施", impl_IT: "ITサポート", impl_Outsource: "外注",
    formTools: "ツール (GAS, VBA...)", formTimePerTime: "削減時間/回 (分)", formTimesPerMonth: "回数/月", formTotalTime: "総削減時間/月 (時間)",
    formMoneyFactor: "金額係数 (VNĐ/時)", formTotalCR: "総CR金額 (VNĐ)",
    legendCR: "総CR金額 (VNĐ)", legendTime: "総時間 (時間)",
    searchPlaceholder: "業務名、担当者、ツールで検索...",
    exportCsv: "CSV出力",
    resetData: "データをリセット",
    confirmReset: "サンプルデータにリセットしてもよろしいですか？",
    confirmDelete: "このプロジェクトを削除してもよろしいですか？",
    completedCount: "完了タスク"
  }
};

interface I18nContextType {
  t: (key: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = React.createContext<I18nContextType>({
  t: (key: string) => key,
  language: 'vi',
  setLanguage: () => {}
});

export interface DXProject {
  id: number;
  name: string;
  pic: string;
  department: string;
  year: number;
  month: string;
  status: 'Completed' | 'In Progress' | 'Pending' | string;
  category: string;
  currentMethod: string;
  improvement: string;
  priority: string;
  implementationMethod: string;
  tools: string;
  timeSavedPerTime: number;
  timesPerMonth: number;
  calculatedTotalTime: number;
  moneyFactor: number;
  calculatedCR: number;
  totalTasks: number;
  completedTasks: number;
}

// --- MOCK DATA ---
const INITIAL_PROJECTS: DXProject[] = [
  { id: 1, name: "Paperless Office Initiative", pic: "Alice Wang", department: "GA", year: 2026, month: "Jan", status: "Completed", category: "Internal", currentMethod: "Manual Forms", improvement: "Digital Forms", priority: "1", implementationMethod: "IT Support", tools: "GAS", timeSavedPerTime: 30, timesPerMonth: 100, calculatedTotalTime: 50, moneyFactor: 100000, calculatedCR: 5000000, totalTasks: 20, completedTasks: 20 },
  { id: 2, name: "Automated Onboarding", pic: "Bob Smith", department: "RE", year: 2026, month: "Feb", status: "Completed", category: "Cross-dept", currentMethod: "Emails", improvement: "Portal", priority: "2", implementationMethod: "Self", tools: "VBA", timeSavedPerTime: 60, timesPerMonth: 20, calculatedTotalTime: 20, moneyFactor: 150000, calculatedCR: 3000000, totalTasks: 50, completedTasks: 50 },
  { id: 3, name: "Invoice Processing OCR", pic: "Charlie Lee", department: "GA", year: 2026, month: "Mar", status: "In Progress", category: "Internal", currentMethod: "Manual typing", improvement: "OCR", priority: "1", implementationMethod: "Outsourced", tools: "API", timeSavedPerTime: 10, timesPerMonth: 300, calculatedTotalTime: 50, moneyFactor: 80000, calculatedCR: 4000000, totalTasks: 30, completedTasks: 15 },
  { id: 4, name: "Employee Training Sync", pic: "Diana Tran", department: "RE", year: 2026, month: "May", status: "In Progress", category: "Cross-dept", currentMethod: "Excel", improvement: "GAS Sync", priority: "3", implementationMethod: "Self", tools: "GAS", timeSavedPerTime: 45, timesPerMonth: 10, calculatedTotalTime: 7.5, moneyFactor: 200000, calculatedCR: 1500000, totalTasks: 25, completedTasks: 10 },
  { id: 5, name: "Payroll Automation Script", pic: "Eve Nguyen", department: "HR", year: 2026, month: "Jul", status: "Pending", category: "Internal", currentMethod: "Manual Export", improvement: "Script", priority: "1", implementationMethod: "IT Support", tools: "Python", timeSavedPerTime: 120, timesPerMonth: 2, calculatedTotalTime: 4, moneyFactor: 500000, calculatedCR: 2000000, totalTasks: 40, completedTasks: 0 },
  { id: 6, name: "Recruitment Portal Integration", pic: "Frank Pham", department: "RE", year: 2026, month: "Aug", status: "In Progress", category: "Cross-dept", currentMethod: "Manual spreadsheets", improvement: "Web portal API", priority: "2", implementationMethod: "IT Support", tools: "Web App", timeSavedPerTime: 90, timesPerMonth: 15, calculatedTotalTime: 22.5, moneyFactor: 180000, calculatedCR: 4050000, totalTasks: 18, completedTasks: 12 },
  { id: 7, name: "Asset Tracking Dashboard", pic: "Grace Le", department: "GA", year: 2026, month: "Oct", status: "Pending", category: "Internal", currentMethod: "Paper logbook", improvement: "QR Code scanner", priority: "2", implementationMethod: "Self", tools: "GAS & AppSheet", timeSavedPerTime: 15, timesPerMonth: 200, calculatedTotalTime: 50, moneyFactor: 120000, calculatedCR: 6000000, totalTasks: 20, completedTasks: 2 }
];

const DEPARTMENTS = ["GA", "RE", "HR"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2026, 2027, 2028, 2029, 2030];
const STATUS_COLORS: Record<string, string> = { "Completed": "#10b981", "In Progress": "#f59e0b", "Pending": "#94a3b8" };

// --- COMPONENTS ---

// 1. Dashboard View
const DashboardView = ({ projects, selectedYear, setSelectedYear }: { 
  projects: DXProject[]; 
  selectedYear: string; 
  setSelectedYear: (y: string) => void; 
}) => {
  const { t } = useContext(I18nContext);
  
  // Derived State for Dashboard
  const filteredProjects = selectedYear === 'All' ? projects : projects.filter(p => p.year === parseInt(selectedYear));
  
  const totalSavings = filteredProjects.reduce((sum, p) => sum + (p.calculatedCR || 0), 0);
  const totalTimeSavingsMo = filteredProjects.reduce((sum, p) => sum + (p.calculatedTotalTime || 0), 0);
  const totalProjects = filteredProjects.length;
  
  let totalTasks = 0;
  let totalCompletedTasks = 0;
  filteredProjects.forEach(p => {
    totalTasks += (p.totalTasks || 1);
    totalCompletedTasks += (p.completedTasks || 0);
  });
  const completionRate = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  // Chart Data: Status Breakdown
  const statusCounts = filteredProjects.reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData = Object.keys(statusCounts).map(key => ({ 
    name: t(`status_${key}`), 
    rawName: key, 
    value: statusCounts[key] 
  }));

  // Chart Data: Savings by Month
  const savingsByMonthData = useMemo(() => {
    if (selectedYear === 'All') return []; 
    const monthlyData = MONTHS.map(m => ({ month: t(`month_${m}`), calculatedCR: 0, calculatedTotalTime: 0 }));
    filteredProjects.forEach(p => {
      const monthIndex = MONTHS.indexOf(p.month);
      if (monthIndex !== -1) {
        monthlyData[monthIndex].calculatedCR += (p.calculatedCR || 0);
        monthlyData[monthIndex].calculatedTotalTime += (p.calculatedTotalTime || 0);
      }
    });
    return monthlyData;
  }, [filteredProjects, selectedYear, t]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-xs border border-slate-200 gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="text-indigo-600" size={20} />
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">{t('overview')}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-600">{t('filterYear')}</label>
          <select 
            className="border-slate-300 rounded-lg shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 bg-slate-50 border font-medium text-slate-700"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">{t('allYears')}</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4 hover:border-indigo-200 transition-all">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Briefcase size={26} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('totalProjects')}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalProjects}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4 hover:border-emerald-200 transition-all">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={26} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('totalSavings')}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {totalSavings.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-500">VNĐ</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4 hover:border-amber-200 transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={26} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('timeSavings')}</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              {totalTimeSavingsMo.toLocaleString(undefined, {maximumFractionDigits: 1})} <span className="text-xs font-normal text-slate-500">h/tháng</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex items-center space-x-4 hover:border-blue-200 transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={26} /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('completionRate')}</p>
            <div className="flex items-baseline space-x-2 mt-1">
              <h3 className="text-2xl font-bold text-slate-800">{completionRate}%</h3>
              <p className="text-xs text-slate-500">({totalCompletedTasks}/{totalTasks} {t('completedCount')})</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Chart */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
            <Percent size={18} className="mr-2 text-indigo-600" />
            {t('statusDist')}
          </h3>
          <div className="h-64">
            {totalProjects > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.rawName] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">{t('noData')}</div>
            )}
          </div>
        </div>

        {/* Savings Chart (ComposedChart for CR and Time) */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
            <TrendingUp size={18} className="mr-2 text-indigo-600" />
            {t('expectedSavings')} {selectedYear !== 'All' ? `(${selectedYear})` : t('selectYear')}
          </h3>
          <div className="h-64">
            {selectedYear !== 'All' ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={savingsByMonthData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                    tickFormatter={(value) => {
                      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                      if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
                      return value;
                    }} 
                  />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value}h`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    formatter={(value, name) => [
                      name === t('legendCR') 
                        ? `${Number(value).toLocaleString('vi-VN')} VNĐ` 
                        : `${Number(value).toLocaleString(undefined, {maximumFractionDigits: 1})}h`, 
                      name
                    ]} 
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar yAxisId="left" dataKey="calculatedCR" name={t('legendCR')} fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="calculatedTotalTime" name={t('legendTime')} stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-center px-8">
                {t('pleaseSelectYear')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Project List View
const ProjectListView = ({ 
  projects, 
  onEdit, 
  onDelete,
  onExport,
  onReset
}: { 
  projects: DXProject[]; 
  onEdit: (p: DXProject) => void; 
  onDelete: (id: number) => void;
  onExport: () => void;
  onReset: () => void;
}) => {
  const { t } = useContext(I18nContext);
  const [filterYear, setFilterYear] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredByYear = filterYear === 'All' 
    ? projects 
    : projects.filter(p => p.year === parseInt(filterYear));

  const displayProjects = filteredByYear.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.pic.toLowerCase().includes(q) ||
      (p.tools && p.tools.toLowerCase().includes(q)) ||
      p.department.toLowerCase().includes(q)
    );
  });

  // Sort by Year then Month index
  displayProjects.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
  });

  const getStatusBadge = (status: string) => {
    const translatedStatus = t(`status_${status}`) || status;
    switch(status) {
      case 'Completed': return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"><CheckCircle size={13} className="mr-1" /> {translatedStatus}</span>;
      case 'In Progress': return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200"><Clock size={13} className="mr-1" /> {translatedStatus}</span>;
      default: return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200"><AlertCircle size={13} className="mr-1" /> {translatedStatus}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-stretch md:items-center bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{t('portfolio')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{displayProjects.length} {t('totalProjects').toLowerCase()}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Year filter */}
          <select 
            className="border-slate-300 rounded-lg shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 text-sm p-2 bg-white border"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="All">{t('allYears')}</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Actions */}
          <button 
            onClick={onExport}
            className="flex items-center px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors border border-indigo-200"
            title={t('exportCsv')}
          >
            <Download size={14} className="mr-1.5" />
            <span className="hidden sm:inline">{t('exportCsv')}</span>
          </button>
          <button 
            onClick={onReset}
            className="flex items-center px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-medium transition-colors border border-slate-300"
            title={t('resetData')}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colName')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colDept')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colPIC')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colTimeline')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colStatus')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colProgress')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colTime')}</th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colSavings')}</th>
              <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('colActions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {displayProjects.length > 0 ? displayProjects.map((project) => {
              const taskPct = project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;
              return (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{project.name}</div>
                    {project.tools && (
                      <span className="inline-block text-[11px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5">
                        {project.tools}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {t(`dept_${project.department}`) || project.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 flex items-center">
                      <User size={14} className="mr-1.5 text-slate-400"/> 
                      {project.pic || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600">{t(`month_${project.month}`)}, {project.year}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-28">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{project.completedTasks}/{project.totalTasks}</span>
                        <span className="font-semibold text-slate-700">{taskPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, taskPct))}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                    {project.calculatedTotalTime ? `${project.calculatedTotalTime.toLocaleString(undefined, {maximumFractionDigits: 1})}h` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 font-bold">
                    {project.calculatedCR ? `${project.calculatedCR.toLocaleString('vi-VN')} VNĐ` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEdit(project)} 
                      className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100 mr-2"
                      title={t('editTitle')}
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(project.id)} 
                      className="text-rose-600 hover:text-rose-900 transition-colors bg-rose-50 p-2 rounded-lg hover:bg-rose-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                  <Filter size={24} className="mx-auto mb-2 text-slate-300" />
                  {t('noProjects')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Add / Edit Project Form
const ProjectForm = ({ 
  initialData, 
  onSave, 
  onCancel 
}: { 
  initialData: DXProject | null; 
  onSave: (p: DXProject) => void; 
  onCancel: () => void; 
}) => {
  const { t } = useContext(I18nContext);
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    pic: initialData?.pic || '',
    department: initialData?.department || 'GA',
    year: initialData?.year || 2026,
    month: initialData?.month || 'Jan',
    status: initialData?.status || 'Pending',
    category: initialData?.category || 'Internal',
    currentMethod: initialData?.currentMethod || '',
    improvement: initialData?.improvement || '',
    priority: initialData?.priority || '1',
    implementationMethod: initialData?.implementationMethod || 'Self',
    tools: initialData?.tools || '',
    timeSavedPerTime: initialData?.timeSavedPerTime !== undefined ? String(initialData.timeSavedPerTime) : '',
    timesPerMonth: initialData?.timesPerMonth !== undefined ? String(initialData.timesPerMonth) : '',
    moneyFactor: initialData?.moneyFactor !== undefined ? String(initialData.moneyFactor) : '',
    totalTasks: initialData?.totalTasks !== undefined ? String(initialData.totalTasks) : '1',
    completedTasks: initialData?.completedTasks !== undefined ? String(initialData.completedTasks) : '0'
  });

  const calculatedTotalTime = ((parseFloat(formData.timeSavedPerTime) || 0) * (parseFloat(formData.timesPerMonth) || 0)) / 60;
  const calculatedCR = calculatedTotalTime * (parseFloat(formData.moneyFactor) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projectData: DXProject = {
      ...formData,
      id: isEdit && initialData ? initialData.id : Date.now(),
      year: parseInt(String(formData.year)),
      timeSavedPerTime: parseFloat(formData.timeSavedPerTime) || 0,
      timesPerMonth: parseFloat(formData.timesPerMonth) || 0,
      moneyFactor: parseFloat(formData.moneyFactor) || 0,
      totalTasks: parseInt(formData.totalTasks) || 1,
      completedTasks: parseInt(formData.completedTasks) || 0,
      calculatedTotalTime: calculatedTotalTime,
      calculatedCR: calculatedCR
    };
    onSave(projectData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        {isEdit ? <Edit className="mr-2.5 text-indigo-600" size={24} /> : <PlusCircle className="mr-2.5 text-indigo-600" size={24} />} 
        {isEdit ? t('editTitle') : t('addTitle')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formName')}</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" 
              placeholder={t('formNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formDepartment')}</label>
            <select name="department" value={formData.department} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              <option value="GA">GA</option>
              <option value="RE">RE</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formPIC')}</label>
            <input required type="text" name="pic" value={formData.pic} onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" 
              placeholder={t('formPICPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formCategory')}</label>
            <select name="category" value={formData.category} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              <option value="Internal">{t('cat_Internal')}</option>
              <option value="Cross-dept">{t('cat_Cross')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formStartYear')}</label>
            <select name="year" value={formData.year} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formStartMonth')}</label>
            <select name="month" value={formData.month} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              {MONTHS.map(m => <option key={m} value={m}>{t(`month_${m}`)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formCurrentMethod')}</label>
            <textarea name="currentMethod" value={formData.currentMethod} onChange={handleChange} rows={2}
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formImprovement')}</label>
            <textarea name="improvement" value={formData.improvement} onChange={handleChange} rows={2}
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formPriority')}</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formImplMethod')}</label>
            <select name="implementationMethod" value={formData.implementationMethod} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              <option value="Self">{t('impl_Self')}</option>
              <option value="IT Support">{t('impl_IT')}</option>
              <option value="Outsourced">{t('impl_Outsource')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formTools')}</label>
            <input type="text" name="tools" value={formData.tools} onChange={handleChange} placeholder="GAS, VBA..."
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formStatus')}</label>
            <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm">
              <option value="Pending">{t('status_Pending')}</option>
              <option value="In Progress">{t('status_In Progress')}</option>
              <option value="Completed">{t('status_Completed')}</option>
            </select>
          </div>
        </div>

        {/* Calculation Panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTimePerTime')}</label>
            <input required type="number" name="timeSavedPerTime" value={formData.timeSavedPerTime} onChange={handleChange} min="0" step="any"
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTimesPerMonth')}</label>
            <input required type="number" name="timesPerMonth" value={formData.timesPerMonth} onChange={handleChange} min="0" step="any"
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTotalTime')}</label>
            <input disabled type="text" value={calculatedTotalTime.toFixed(2)}
              className="block w-full rounded-lg border-slate-200 bg-slate-100 shadow-2xs p-2 border text-sm font-semibold text-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formMoneyFactor')}</label>
            <input required type="number" name="moneyFactor" value={formData.moneyFactor} onChange={handleChange} min="0" step="any" placeholder="vd. 150000"
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm bg-white" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTotalCR')}</label>
            <input disabled type="text" value={`${calculatedCR.toLocaleString('vi-VN')} VNĐ`}
              className="block w-full rounded-lg border-indigo-200 bg-indigo-50 shadow-2xs p-2 border text-sm font-bold text-indigo-700" />
          </div>
        </div>

        {/* Task Progress Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formTotalTasks')}</label>
            <input required type="number" name="totalTasks" value={formData.totalTasks} onChange={handleChange} min="1"
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('formCompletedTasks')}</label>
            <input required type="number" name="completedTasks" value={formData.completedTasks} onChange={handleChange} min="0" max={formData.totalTasks || 9999}
              className="block w-full rounded-lg border-slate-300 shadow-2xs focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm" 
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 border border-slate-300 rounded-lg shadow-2xs text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
            {t('btnCancel')}
          </button>
          <button type="submit" className="px-5 py-2.5 border border-transparent rounded-lg shadow-2xs text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            {isEdit ? t('btnUpdate') : t('btnSave')}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [projects, setProjects] = useState<DXProject[]>(() => {
    try {
      const saved = localStorage.getItem('dx_tracker_projects');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'form'>('dashboard');
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [globalYearFilter, setGlobalYearFilter] = useState('2026'); 
  const [language, setLanguage] = useState('vi'); // Default VI
  const [editingProject, setEditingProject] = useState<DXProject | null>(null);

  // Synchronize to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dx_tracker_projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  const handleSaveProject = (projectData: DXProject) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    } else {
      setProjects([...projects, projectData]);
    }
    setActiveTab('list');
    setEditingProject(null);
  };

  const handleEditProject = (project: DXProject) => {
    setEditingProject(project);
    setActiveTab('form');
  };

  const handleDeleteProject = (id: number) => {
    const confirmMsg = translations[language as keyof typeof translations]?.confirmDelete || "Delete project?";
    if (window.confirm(confirmMsg)) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setActiveTab('form');
  };

  const handleResetData = () => {
    const confirmMsg = translations[language as keyof typeof translations]?.confirmReset || "Reset to default?";
    if (window.confirm(confirmMsg)) {
      setProjects(INITIAL_PROJECTS);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID", "Project Name", "PIC", "Department", "Year", "Month", "Status", 
      "Category", "Current Method", "Improvement", "Priority", "Impl Method", 
      "Tools", "Time Saved/Time (m)", "Times/Month", "Total Time Saved (h)", 
      "Money Factor (VND/h)", "Total CR (VND)", "Total Tasks", "Completed Tasks"
    ];

    const rows = projects.map(p => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      `"${(p.pic || '').replace(/"/g, '""')}"`,
      p.department,
      p.year,
      p.month,
      p.status,
      p.category,
      `"${(p.currentMethod || '').replace(/"/g, '""')}"`,
      `"${(p.improvement || '').replace(/"/g, '""')}"`,
      p.priority,
      p.implementationMethod,
      `"${(p.tools || '').replace(/"/g, '""')}"`,
      p.timeSavedPerTime,
      p.timesPerMonth,
      p.calculatedTotalTime,
      p.moneyFactor,
      p.calculatedCR,
      p.totalTasks,
      p.completedTasks
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DX_Projects_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const t = (key: string) => {
    const currentLangDict = translations[language as keyof typeof translations];
    if (currentLangDict && key in currentLangDict) {
      return currentLangDict[key as keyof typeof currentLangDict];
    }
    return key;
  };

  const filteredProjectsByDept = activeDepartment === 'All' 
    ? projects 
    : projects.filter(p => p.department === activeDepartment);

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
        
        {/* Header Navigation */}
        <nav className="bg-indigo-950 text-white shadow-md sticky top-0 z-20 border-b border-indigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                <div className="bg-indigo-600 p-2 rounded-xl shadow-xs">
                  <TrendingUp size={22} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-lg tracking-tight hidden sm:block">{t('appTitle')}</span>
                  <span className="font-bold text-lg tracking-tight sm:hidden">DX Tracker</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-3">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white shadow-xs' : 'text-indigo-200 hover:bg-indigo-900 hover:text-white'}`}
                >
                  <LayoutDashboard size={17} className="mr-1.5 hidden md:block" /> 
                  <span>{t('dashboard')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeTab === 'list' ? 'bg-indigo-800 text-white shadow-xs' : 'text-indigo-200 hover:bg-indigo-900 hover:text-white'}`}
                >
                  <List size={17} className="mr-1.5 hidden md:block" /> 
                  <span>{t('projectsList')}</span>
                </button>
                <button 
                  onClick={handleAddClick}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeTab === 'form' && !editingProject ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                >
                  <PlusCircle size={17} className="mr-1.5 hidden md:block" /> 
                  <span>{t('newProject')}</span>
                </button>
                
                {/* Language Picker */}
                <div className="relative flex items-center ml-2 border-l border-indigo-800 pl-3">
                  <Globe size={16} className="text-indigo-300 mr-1" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-indigo-900/60 text-white text-xs font-semibold rounded-md border border-indigo-700/50 p-1 cursor-pointer outline-none hover:bg-indigo-800 transition-colors"
                  >
                    <option value="en" className="text-slate-900 bg-white">EN</option>
                    <option value="vi" className="text-slate-900 bg-white">VI</option>
                    <option value="ja" className="text-slate-900 bg-white">JA</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Department Secondary Nav */}
        {(activeTab === 'dashboard' || activeTab === 'list') && (
          <div className="bg-white border-b border-slate-200 shadow-2xs sticky top-16 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-6 sm:space-x-8 overflow-x-auto py-1">
                {['All', 'GA', 'RE', 'HR'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveDepartment(dept)}
                    className={`whitespace-nowrap py-3 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-colors ${
                      activeDepartment === dept
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {t(`dept_${dept}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
          {activeTab === 'dashboard' && (
            <DashboardView 
              projects={filteredProjectsByDept} 
              selectedYear={globalYearFilter} 
              setSelectedYear={setGlobalYearFilter} 
            />
          )}
          {activeTab === 'list' && (
            <ProjectListView 
              projects={filteredProjectsByDept} 
              onEdit={handleEditProject} 
              onDelete={handleDeleteProject}
              onExport={handleExportCSV}
              onReset={handleResetData}
            />
          )}
          {activeTab === 'form' && (
            <ProjectForm 
              key={editingProject ? editingProject.id : 'new'}
              initialData={editingProject}
              onSave={handleSaveProject} 
              onCancel={() => { setActiveTab('list'); setEditingProject(null); }} 
            />
          )}
        </main>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />
      </div>
    </I18nContext.Provider>
  );
}
