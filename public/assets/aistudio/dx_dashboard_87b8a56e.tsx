import React, { useState, useMemo, useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { 
  LayoutDashboard, List, PlusCircle, TrendingUp, CheckCircle, 
  Clock, AlertCircle, DollarSign, Briefcase, Globe, Edit, User, Trash2
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
    legendCR: "Total CR Amount (VNĐ)", legendTime: "Total Time (Hrs)"
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
    legendCR: "Tổng Số tiền CR (VNĐ)", legendTime: "Tổng thời gian giảm (Giờ)"
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
    legendCR: "総CR金額 (VNĐ)", legendTime: "総時間 (時間)"
  }
};

const I18nContext = React.createContext();

// --- MOCK DATA ---
const INITIAL_PROJECTS = [
  { id: 1, name: "Paperless Office Initiative", pic: "Alice Wang", department: "GA", year: 2026, month: "Jan", status: "Completed", category: "Internal", currentMethod: "Manual Forms", improvement: "Digital Forms", priority: "1", implementationMethod: "IT Support", tools: "GAS", timeSavedPerTime: 30, timesPerMonth: 100, calculatedTotalTime: 50, moneyFactor: 100000, calculatedCR: 5000000, totalTasks: 20, completedTasks: 20 },
  { id: 2, name: "Automated Onboarding", pic: "Bob Smith", department: "RE", year: 2026, month: "Feb", status: "Completed", category: "Cross-dept", currentMethod: "Emails", improvement: "Portal", priority: "2", implementationMethod: "Self", tools: "VBA", timeSavedPerTime: 60, timesPerMonth: 20, calculatedTotalTime: 20, moneyFactor: 150000, calculatedCR: 3000000, totalTasks: 50, completedTasks: 50 },
  { id: 3, name: "Invoice Processing", pic: "Charlie Lee", department: "GA", year: 2026, month: "Mar", status: "In Progress", category: "Internal", currentMethod: "Manual typing", improvement: "OCR", priority: "1", implementationMethod: "Outsourced", tools: "API", timeSavedPerTime: 10, timesPerMonth: 300, calculatedTotalTime: 50, moneyFactor: 80000, calculatedCR: 4000000, totalTasks: 30, completedTasks: 15 },
  { id: 4, name: "Employee Training Sync", pic: "Diana", department: "RE", year: 2026, month: "May", status: "In Progress", category: "Cross-dept", currentMethod: "Excel", improvement: "GAS Sync", priority: "3", implementationMethod: "Self", tools: "GAS", timeSavedPerTime: 45, timesPerMonth: 10, calculatedTotalTime: 7.5, moneyFactor: 200000, calculatedCR: 1500000, totalTasks: 25, completedTasks: 10 },
  { id: 5, name: "Payroll Automation", pic: "Eve", department: "HR", year: 2026, month: "Jul", status: "Pending", category: "Internal", currentMethod: "Manual Export", improvement: "Script", priority: "1", implementationMethod: "IT Support", tools: "Python", timeSavedPerTime: 120, timesPerMonth: 2, calculatedTotalTime: 4, moneyFactor: 500000, calculatedCR: 2000000, totalTasks: 40, completedTasks: 0 },
];

const DEPARTMENTS = ["GA", "RE", "HR"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const YEARS = [2026, 2027, 2028, 2029, 2030];
const STATUS_COLORS = { "Completed": "#10b981", "In Progress": "#f59e0b", "Pending": "#94a3b8" };

// --- COMPONENTS ---

// 1. Dashboard View
const DashboardView = ({ projects, selectedYear, setSelectedYear }) => {
  const { t } = useContext(I18nContext);
  
  // Derived State for Dashboard
  const filteredProjects = selectedYear === 'All' ? projects : projects.filter(p => p.year === parseInt(selectedYear));
  
  const totalSavings = filteredProjects.reduce((sum, p) => sum + (p.calculatedCR || 0), 0);
  const totalTimeSavingsMo = filteredProjects.reduce((sum, p) => sum + (p.calculatedTotalTime || 0), 0);
  const totalProjects = filteredProjects.length;
  
  let totalTasks = 0;
  let totalCompletedTasks = 0;
  filteredProjects.forEach(p => {
    totalTasks += (p.totalTasks || 1); // Fallback to avoid division by zero
    totalCompletedTasks += (p.completedTasks || 0);
  });
  const completionRate = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

  // Chart Data: Status Breakdown
  const statusCounts = filteredProjects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData = Object.keys(statusCounts).map(key => ({ name: t(`status_${key}`), rawName: key, value: statusCounts[key] }));

  // Chart Data: Savings by Month (for selected year) - Aggregating both CR and Time
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
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">{t('overview')}</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-600">{t('filterYear')}</label>
          <select 
            className="border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-slate-50"
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Briefcase size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('totalProjects')}</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalProjects}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><DollarSign size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('totalSavings')}</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {totalSavings.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-500">VNĐ</span>
            </h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('timeSavings')}</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalTimeSavingsMo.toLocaleString(undefined, {maximumFractionDigits: 1})} <span className="text-sm font-normal text-slate-500">h/mo</span></h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('completionRate')}</p>
            <h3 className="text-2xl font-bold text-slate-800">{completionRate}%</h3>
            <p className="text-xs text-slate-400 mt-1">{totalCompletedTasks} / {totalTasks} {t('tasksDone')}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('statusDist')}</h3>
          <div className="h-64">
            {totalProjects > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.rawName]} />
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {t('expectedSavings')} {selectedYear !== 'All' ? `(${selectedYear})` : t('selectYear')}
          </h3>
          <div className="h-64">
            {selectedYear !== 'All' ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={savingsByMonthData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b'}} 
                    tickFormatter={(value) => {
                      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
                      if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
                      return value;
                    }} 
                  />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `${value}h`} />
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
const ProjectListView = ({ projects, onEdit, onDelete }) => {
  const { t } = useContext(I18nContext);
  const [filterYear, setFilterYear] = useState('All');
  
  const displayProjects = filterYear === 'All' 
    ? projects 
    : projects.filter(p => p.year === parseInt(filterYear));

  // Sort by Year then Month index
  displayProjects.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month);
  });

  const getStatusBadge = (status) => {
    const translatedStatus = t(`status_${status}`);
    switch(status) {
      case 'Completed': return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800"><CheckCircle size={14} className="mr-1" /> {translatedStatus}</span>;
      case 'In Progress': return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800"><Clock size={14} className="mr-1" /> {translatedStatus}</span>;
      default: return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800"><AlertCircle size={14} className="mr-1" /> {translatedStatus}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">{t('portfolio')}</h2>
        <select 
          className="border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="All">{t('allYears')}</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colName')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colDept')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colPIC')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colTimeline')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colStatus')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colTime')}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colSavings')}</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('colActions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {displayProjects.length > 0 ? displayProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{project.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">{t(`dept_${project.department}`)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-600 flex items-center"><User size={14} className="mr-1 text-slate-400"/> {project.pic || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-500">{t(`month_${project.month}`)}, {project.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(project.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {project.calculatedTotalTime ? `${project.calculatedTotalTime.toLocaleString(undefined, {maximumFractionDigits: 1})}h` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {project.calculatedCR ? `${project.calculatedCR.toLocaleString('vi-VN')} VNĐ` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onEdit(project)} className="text-indigo-600 hover:text-indigo-900 transition-colors bg-indigo-50 p-2 rounded-md hover:bg-indigo-100 mr-2">
                    <Edit size={16} />
                  </button>
                  {onDelete && (
                    <button onClick={() => onDelete(project.id)} className="text-rose-600 hover:text-rose-900 transition-colors bg-rose-50 p-2 rounded-md hover:bg-rose-100">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
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
const ProjectForm = ({ initialData, onSave, onCancel }) => {
  const { t } = useContext(I18nContext);
  const isEdit = !!initialData;
  
  const [formData, setFormData] = useState(initialData || {
    name: '', pic: '', department: 'GA', year: 2026, month: 'Jan', status: 'Pending', 
    category: 'Internal', currentMethod: '', improvement: '', priority: '1', 
    implementationMethod: 'Self', tools: '', timeSavedPerTime: '', timesPerMonth: '', moneyFactor: '', 
    totalTasks: '1', completedTasks: '0'
  });

  const calculatedTotalTime = ((parseFloat(formData.timeSavedPerTime) || 0) * (parseFloat(formData.timesPerMonth) || 0)) / 60;
  const calculatedCR = calculatedTotalTime * (parseFloat(formData.moneyFactor) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      id: isEdit ? initialData.id : Date.now(),
      year: parseInt(formData.year),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        {isEdit ? <Edit className="mr-2 text-indigo-600" /> : <PlusCircle className="mr-2 text-indigo-600" />} 
        {isEdit ? t('editTitle') : t('addTitle')}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">{t('formName')}</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" 
              placeholder={t('formNamePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formDepartment')}</label>
            <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white">
              <option value="GA">GA</option>
              <option value="RE">RE</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formPIC')}</label>
            <input required type="text" name="pic" value={formData.pic} onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" 
              placeholder={t('formPICPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formCategory')}</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              <option value="Internal">{t('cat_Internal')}</option>
              <option value="Cross-dept">{t('cat_Cross')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formStartYear')}</label>
            <select name="year" value={formData.year} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formStartMonth')}</label>
            <select name="month" value={formData.month} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              {MONTHS.map(m => <option key={m} value={m}>{t(`month_${m}`)}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formCurrentMethod')}</label>
            <textarea name="currentMethod" value={formData.currentMethod} onChange={handleChange} rows="2"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formImprovement')}</label>
            <textarea name="improvement" value={formData.improvement} onChange={handleChange} rows="2"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formPriority')}</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formImplMethod')}</label>
            <select name="implementationMethod" value={formData.implementationMethod} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              <option value="Self">{t('impl_Self')}</option>
              <option value="IT Support">{t('impl_IT')}</option>
              <option value="Outsourced">{t('impl_Outsource')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formTools')}</label>
            <input type="text" name="tools" value={formData.tools} onChange={handleChange} placeholder="GAS, VBA..."
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formStatus')}</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border">
              <option value="Pending">{t('status_Pending')}</option>
              <option value="In Progress">{t('status_In Progress')}</option>
              <option value="Completed">{t('status_Completed')}</option>
            </select>
          </div>
        </div>

        {/* Calculation Panel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTimePerTime')}</label>
            <input required type="number" name="timeSavedPerTime" value={formData.timeSavedPerTime} onChange={handleChange} min="0" step="any"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTimesPerMonth')}</label>
            <input required type="number" name="timesPerMonth" value={formData.timesPerMonth} onChange={handleChange} min="0" step="any"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTotalTime')}</label>
            <input disabled type="text" value={calculatedTotalTime.toFixed(2)}
              className="block w-full rounded-md border-slate-200 bg-slate-100 shadow-sm p-2 border text-sm font-semibold text-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formMoneyFactor')}</label>
            <input required type="number" name="moneyFactor" value={formData.moneyFactor} onChange={handleChange} min="0" step="any" placeholder="vd. 150000"
              className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">{t('formTotalCR')}</label>
            <input disabled type="text" value={`${calculatedCR.toLocaleString('vi-VN')} VNĐ`}
              className="block w-full rounded-md border-slate-200 bg-indigo-50 shadow-sm p-2 border text-sm font-bold text-indigo-700" />
          </div>
        </div>

        {/* Task Progress Tracker */}
        <div className="grid grid-cols-2 gap-6 pb-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formTotalTasks')}</label>
            <input required type="number" name="totalTasks" value={formData.totalTasks} onChange={handleChange} min="1"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">{t('formCompletedTasks')}</label>
            <input required type="number" name="completedTasks" value={formData.completedTasks} onChange={handleChange} min="0" max={formData.totalTasks || 9999}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border" 
            />
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {t('btnCancel')}
          </button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {isEdit ? t('btnUpdate') : t('btnSave')}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [globalYearFilter, setGlobalYearFilter] = useState('2026'); 
  const [language, setLanguage] = useState('vi'); // Default VI
  const [editingProject, setEditingProject] = useState(null);

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === projectData.id ? projectData : p));
    } else {
      setProjects([...projects, projectData]);
    }
    setActiveTab('list');
    setEditingProject(null);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setActiveTab('form');
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setActiveTab('form');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const filteredProjectsByDept = activeDepartment === 'All' 
    ? projects 
    : projects.filter(p => p.department === activeDepartment);

  return (
    <I18nContext.Provider value={{ t, language, setLanguage }}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* Header Navigation */}
        <nav className="bg-indigo-900 text-white shadow-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight hidden sm:block">{t('appTitle')}</span>
                <span className="font-bold text-xl tracking-tight sm:hidden">DX Tracker</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} className="mr-2 hidden md:block" /> <span className="hidden sm:block">{t('dashboard')}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
                >
                  <List size={18} className="mr-2 hidden md:block" /> <span className="hidden sm:block">{t('projectsList')}</span>
                </button>
                <button 
                  onClick={handleAddClick}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' && !editingProject ? 'bg-emerald-600 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                >
                  <PlusCircle size={18} className="mr-2 hidden md:block" /> <span className="hidden sm:block">{t('newProject')}</span>
                </button>
                
                <div className="relative flex items-center ml-2 border-l border-indigo-700 pl-3">
                  <Globe size={18} className="text-indigo-200 mr-1" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent text-white text-sm font-medium rounded border-none focus:ring-0 p-1 cursor-pointer outline-none hover:text-indigo-200 transition-colors"
                  >
                    <option value="en" className="text-slate-900">EN</option>
                    <option value="vi" className="text-slate-900">VI</option>
                    <option value="ja" className="text-slate-900">JA</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Department Secondary Nav */}
        {(activeTab === 'dashboard' || activeTab === 'list') && (
          <>
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-10 hidden sm:block">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 overflow-x-auto">
                  {['All', 'GA', 'RE', 'HR'].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDepartment(dept)}
                      className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeDepartment === dept
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {t(`dept_${dept}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="sm:hidden bg-white p-4 border-b border-slate-200 shadow-sm sticky top-16 z-10">
                <select 
                  value={activeDepartment}
                  onChange={(e) => setActiveDepartment(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white shadow-sm"
                >
                  <option value="All">{t('dept_All')}</option>
                  <option value="GA">{t('dept_GA')}</option>
                  <option value="RE">{t('dept_RE')}</option>
                  <option value="HR">{t('dept_HR')}</option>
                </select>
            </div>
          </>
        )}

        {/* Main View Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}} />
      </div>
    </I18nContext.Provider>
  );
}