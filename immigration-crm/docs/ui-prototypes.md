# UI/UX Prototypes - Enterprise Immigration CRM System

## Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary: #0066CC; /* Professional Blue */
  --primary-dark: #0052A3;
  --primary-light: #3388FF;
  --primary-surface: #E6F0FF;
  
  /* Secondary Colors */
  --secondary: #00A86B; /* Trust Green */
  --secondary-dark: #008A57;
  --secondary-light: #33C489;
  --secondary-surface: #E6F7EF;
  
  /* Accent Colors */
  --accent: #FF6B35; /* Alert Orange */
  --accent-dark: #E55A2A;
  --accent-light: #FF8C5D;
  --accent-surface: #FFF2EB;
  
  /* Neutral Colors */
  --gray-50: #F8F9FA;
  --gray-100: #F1F3F5;
  --gray-200: #E9ECEF;
  --gray-300: #DEE2E6;
  --gray-400: #CED4DA;
  --gray-500: #ADB5BD;
  --gray-600: #6C757D;
  --gray-700: #495057;
  --gray-800: #343A40;
  --gray-900: #212529;
  
  /* Semantic Colors */
  --success: #28A745;
  --warning: #FFC107;
  --error: #DC3545;
  --info: #17A2B8;
  
  /* Status Colors */
  --status-new: #007BFF;
  --status-active: #28A745;
  --status-pending: #FFC107;
  --status-completed: #6C757D;
  --status-overdue: #DC3545;
}
```

### Typography Scale
```css
:root {
  /* Font Families */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-loose: 2;
}
```

### Spacing Scale
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Shadows & Elevation
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

## Key Interface Prototypes

### 1. Admin Dashboard

#### Dashboard Header
```tsx
// src/components/layout/DashboardHeader.tsx
interface DashboardHeaderProps {
  title: string;
  user: User;
  notifications: Notification[];
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, user, notifications }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-surface text-primary">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Real-time
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <BellIcon className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
              )}
            </button>
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <img
                  className="h-9 w-9 rounded-full"
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0066CC&color=fff`}
                  alt={user.name}
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
```

#### Dashboard Overview Cards
```tsx
// src/components/dashboard/OverviewCards.tsx
interface OverviewCardProps {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent';
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, change, trend, icon, color }) => {
  const colorClasses = {
    primary: 'bg-primary-surface text-primary',
    secondary: 'bg-secondary-surface text-secondary',
    accent: 'bg-accent-surface text-accent'
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const trendIcon = {
    up: <TrendingUpIcon className="w-4 h-4" />,
    down: <TrendingDownIcon className="w-4 h-4" />,
    neutral: <MinusIcon className="w-4 h-4" />
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`inline-flex items-center text-sm font-medium ${trendClasses[trend]}`}>
          {trendIcon[trend]}
          <span className="ml-1">{Math.abs(change)}%</span>
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

// Dashboard Stats Component
interface DashboardStats {
  newLeads: number;
  activeCases: number;
  pendingReviews: number;
  appointmentsToday: number;
}

const DashboardStats: React.FC<DashboardStats> = ({ 
  newLeads, 
  activeCases, 
  pendingReviews, 
  appointmentsToday 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <OverviewCard
        title="New Leads"
        value={newLeads}
        change={12}
        trend="up"
        icon={<UsersIcon className="w-6 h-6" />}
        color="primary"
      />
      <OverviewCard
        title="Active Cases"
        value={activeCases}
        change={5}
        trend="up"
        icon={<BriefcaseIcon className="w-6 h-6" />}
        color="secondary"
      />
      <OverviewCard
        title="Pending Reviews"
        value={pendingReviews}
        change={-3}
        trend="down"
        icon={<DocumentTextIcon className="w-6 h-6" />}
        color="accent"
      />
      <OverviewCard
        title="Today's Appointments"
        value={appointmentsToday}
        change={2}
        trend="up"
        icon={<CalendarIcon className="w-6 h-6" />}
        color="primary"
      />
    </div>
  );
};
```

### 2. Case Management Interface

#### Case List View
```tsx
// src/components/cases/CaseListView.tsx
interface Case {
  id: string;
  caseNumber: string;
  clientFirstName: string;
  clientLastName: string;
  serviceType: ServiceType;
  status: CaseStatus;
  priority: Priority;
  assignedTo: User;
  createdAt: Date;
}

interface CaseListViewProps {
  cases: Case[];
  onCaseClick: (caseId: string) => void;
  onStatusChange: (caseId: string, status: CaseStatus) => void;
}

const CaseListView: React.FC<CaseListViewProps> = ({ cases, onCaseClick, onStatusChange }) => {
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    return cases
      .filter(case => 
        filterStatus === 'ALL' ? true : case.status === filterStatus
      )
      .filter(case =>
        searchQuery === '' ? true : case.caseNumber.includes(searchQuery) ||
          `${case.clientFirstName} ${case.clientLastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
      });
  }, [cases, filterStatus, sortBy, searchQuery]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Cases</h2>
            <Badge color="primary">{filteredCases.length} Total</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as CaseStatus | 'ALL')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              {Object.values(CaseStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'priority')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="priority">Priority</option>
            </select>
            
            {/* New Case Button */}
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center">
              <PlusIcon className="w-5 h-5 mr-2" />
              New Case
            </button>
          </div>
        </div>
      </div>
      
      {/* Cases Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Case
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCases.map(caseItem => (
              <tr 
                key={caseItem.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onCaseClick(caseItem.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {caseItem.caseNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {caseItem.clientFirstName} {caseItem.clientLastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color="secondary">
                    {caseItem.serviceType.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <CaseStatusBadge status={caseItem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    color={getPriorityColor(caseItem.priority)}
                    outline
                  >
                    {caseItem.priority}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full mr-2"
                      src={caseItem.assignedTo.avatar || `https://ui-avatars.com/api/?name=${caseItem.assignedTo.name}&background=0066CC&color=fff`}
                      alt={caseItem.assignedTo.name}
                    />
                    <span className="text-sm text-gray-900">
                      {caseItem.assignedTo.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(caseItem.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      className="text-primary hover:text-primary-dark"
                      onClick={(e) => {
                        e.stopPropagation();
                        // View details
                      }}
                    >
                      View
                    </button>
                    <button 
                      className="text-gray-600 hover:text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit case
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredCases.length}</span> results
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {page}
              </button>
            ))}
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
```

### 3. Case Detail View

```tsx
// src/components/cases/CaseDetailView.tsx
interface CaseDetailViewProps {
  case: Case;
  onBack: () => void;
  onEdit: () => void;
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ case: caseData, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'communications'>('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <InformationCircleIcon className="w-5 h-5" /> },
    { id: 'documents', label: 'Documents', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { id: 'timeline', label: 'Timeline', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'communications', label: 'Communications', icon: <ChatAltIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{caseData.caseNumber}</h1>
                <p className="text-gray-600">
                  {caseData.clientFirstName} {caseData.clientLastName} • {caseData.serviceType.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <CaseStatusBadge status={caseData.status} />
              <Badge 
                color={getPriorityColor(caseData.priority)}
                outline
              >
                {caseData.priority}
              </Badge>
              
              <div className="flex space-x-2">
                <button
                  onClick={onEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                  Add Document
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Case Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-gray-900">
                      {caseData.clientFirstName} {caseData.clientLastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{caseData.clientEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{caseData.clientPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nationality</label>
                    <p className="mt-1 text-gray-900">{caseData.nationality || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              {/* Passport Tracking */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Passport Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Passport Number</label>
                    <p className="mt-1 text-gray-900">{caseData.passportNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                    <p className="mt-1">
                      {caseData.passportExpiryDate ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isExpiringSoon(caseData.passportExpiryDate) 
                            ? 'bg-accent-surface text-accent'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formatDate(caseData.passportExpiryDate)}
                          {isExpiringSoon(caseData.passportExpiryDate) && (
                            <ExclamationIcon className="w-4 h-4 ml-1" />
                          )}
                        </span>
                      ) : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reminder</label>
                    <button className="mt-1 text-primary hover:text-primary-dark text-sm font-medium">
                      Set Reminder
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {caseData.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Timeline & Actions */}
            <div className="space-y-6">
              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {caseData.statusUpdates.map((update, index) => (
                    <div key={update.id} className="relative flex items-start mb-6 last:mb-0">
                      <div className="absolute left 4 top-6 -ml-1.5">
                        <div className={`h-3 w-3 rounded-full border-2 border-white ${
                          update.newStatus === 'COMPLETED' ? 'bg-success' :
                          update.newStatus === 'REJECTED' ? 'bg-error' :
                          'bg-primary'
                        }`} />
                      </div>
                      <div className="ml-8">
                        <div className="text-sm font-medium text-gray-900">{update.summary}</div>
                        <div className="text-sm text-gray-500">{formatDate(update.createdAt)}</div>
                        <div className="mt-1 text-xs">
                          <Badge color="gray">{update.oldStatus.replace('_', ' ')}</Badge>
                          <ArrowRightIcon className="inline-block w-4 h-4 mx-2 text-gray-400" />
                          <Badge color={getStatusColor(update.newStatus)}>
                            {update.newStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <DocumentAddIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Upload Document</span>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Schedule Appointment</span>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <ChatAltIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Send Message</span>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center">
                      <FlagIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Update Status</span>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Document
              </button>
            </div>
            
            <div className="space-y-4">
              {caseData.documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <DocumentIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{document.fileName}</span>
                        <Badge color={
                          document.status === 'APPROVED' ? 'success' :
                          document.status === 'REJECTED' ? 'error' :
                          document.status === 'PENDING' ? 'warning' : 'gray'
                        }>
                          {document.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(document.fileSize)} • {formatDate(document.uploadedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-primary hover:text-primary-dark">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Download
                    </button>
                    {document.status === 'PENDING' && (
                      <>
                        <button className="text-success hover:text-success-dark">
                          Approve
                        </button>
                        <button className="text-error hover:text-error-dark">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 4. Document Upload Portal

```tsx
// src/components/documents/DocumentUploadPortal.tsx
interface DocumentUploadPortalProps {
  caseId: string;
  onUploadComplete: (document: Document) => void;
}

const DocumentUploadPortal: React.FC<DocumentUploadPortalProps> = ({ caseId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState<UploadDocument[]>([]);
  const [requirements, setRequirements] = useState<DocumentRequirement[]>([
    { type: 'PASSPORT', required: true, uploaded: false },
    { type: 'BIRTH_CERTIFICATE', required: true, uploaded: false },
    { type: 'EDUCATION_CERTIFICATE', required: true, uploaded: false },
    { type: 'EMPLOYMENT_LETTER', required: true, uploaded: false },
    { type: 'BANK_STATEMENT', required: true, uploaded: false },
    { type: 'MEDICAL_REPORT', required: false, uploaded: false },
    { type: 'POLICE_CLEARANCE', required: false, uploaded: false },
  ]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const uploadPromises = files.map(file => uploadDocument(file));
    setUploading(true);
    
    try {
      const results = await Promise.all(uploadPromises);
      setDocuments(prev => [...prev, ...results]);
      
      // Update requirements
      const newRequirements = [...requirements];
      results.forEach(result => {
        const reqIndex = newRequirements.findIndex(r => r.type === result.documentType);
        if (reqIndex > -1) {
          newRequirements[reqIndex].uploaded = true;
        }
      });
      setRequirements(newRequirements);
      
      // Callback
      results.forEach(result => {
        onUploadComplete({
          ...result,
          caseId,
          uploadedAt: new Date().toISOString(),
        });
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadDocument = (file: File): Promise<UploadDocument> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', caseId);
      formData.append('documentType', detectDocumentType(file.name));
      formData.append('category', detectCategory(file.name));
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          setProgress(percentage);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            id: response.data.id,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            documentType: detectDocumentType(file.name),
            category: detectCategory(file.name),
            status: 'PENDING',
            progress: 100,
          });
        } else {
          reject(new Error('Upload failed'));
        }
      });
      
      xhr.addEventListener('error', () => reject(new Error('Upload error')));
      xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
      
      xhr.open('POST', '/api/documents/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);
    });
  };

  const detectDocumentType = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('passport')) return 'PASSPORT';
    if (lowerName.includes('birth')) return 'BIRTH_CERTIFICATE';
    if (lowerName.includes('marriage')) return 'MARRIAGE_CERTIFICATE';
    if (lowerName.includes('education') || lowerName.includes('degree') || lowerName.includes('diploma')) 
      return 'EDUCATION_CERTIFICATE';
    if (lowerName.includes('employment') || lowerName.includes('job')) return 'EMPLOYMENT_LETTER';
    if (lowerName.includes('bank') || lowerName.includes('statement')) return 'BANK_STATEMENT';
    if (lowerName.includes('police') || lowerName.includes('clearance')) return 'POLICE_CLEARANCE';
    if (lowerName.includes('medical')) return 'MEDICAL_REPORT';
    return 'OTHER';
  };

  const detectCategory = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) return 'Photo/Image';
    if (ext === 'pdf') return 'PDF Document';
    return 'Document';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Upload Portal</h1>
        <p className="text-gray-600">
          Upload required documents for case {caseId}. Drag and drop files or click to browse.
        </p>
      </div>
      
      {/* Progress Bar */}
      {uploading && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Requirements Checklist */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {requirements.map((requirement) => (
            <div key={requirement.type} className="flex items-center">
              <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-3 ${
                requirement.uploaded 
                  ? 'bg-success border-2 border-success' 
                  : 'border-2 border-gray-300'
              }`}>
                {requirement.uploaded && (
                  <CheckIcon className="w-3 h-3 text-white" />
                )}
              </div>
              <span className={`text-sm ${requirement.uploaded ? 'text-gray-900' : 'text-gray-600'}`}>
                {requirement.type.replace('_', ' ')}
                {requirement.required && (
                  <span className="text-error text-xs ml-2">Required</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-colors ${
          dragActive 
            ? 'border-primary bg-primary-surface' 
            : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <DocumentAddIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 text-primary hover:text-primary-dark font-medium">
                Click to select files
              </span>
              <span className="text-gray-600"> or drag and drop</span>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              PDF, DOC, DOCX, JPG, PNG up to 10MB each
            </p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </div>
      </div>
      
      {/* File List */}
      {documents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
          <div className="space-y-3">
            {documents.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    document.status === 'UPLOADING' ? 'bg-gray-100' :
                    document.status === 'PENDING' ? 'bg-blue-50' :
                    document.status === 'PROCESSING' ? 'bg-yellow-50' :
                    'bg-green-50'
                  }`}>
                    {document.status === 'COMPLETE' ? (
                      <DocumentCheckIcon className="w-6 h-6 text-green-600" />
                    ) : document.status === 'ERROR' ? (
                      <DocumentRemoveIcon className="w-6 h-6 text-red-600" />
                    ) : (
                      <DocumentIcon className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{document.fileName}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(document.fileSize)} • {document.documentType}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {document.status === 'UPLOADING' && (
                    <>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${document.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{document.progress}%</span>
                    </>
                  )}
                  {document.status === 'COMPLETE' && (
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  )}
                  {document.status === 'ERROR' && (
                    <ExclamationIcon className="w-5 h-5 text-red-600" />
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          disabled={uploading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            // Submit documents for processing
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading || documents.length === 0}
        >
          {uploading ? 'Uploading...' : 'Submit Documents'}
        </button>
      </div>
    </div>
  );
};
```

### 5. Appointment Scheduler

```tsx
// src/components/appointments/AppointmentScheduler.tsx
interface AppointmentSchedulerProps {
  caseId: string;
  onAppointmentScheduled: (appointment: Appointment) => void;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ caseId, onAppointmentScheduled }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('INITIAL_CONSULTATION');
  const [duration, setDuration] = useState<number>(60);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<string>('office');
  const [meetingLink, setMeetingLink] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Fetch available time slots
  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/appointments/slots?date=${selectedDate.toISOString()}&duration=${duration}`);
      const data = await response.json();
      setAvailableSlots(data.data.slots);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !appointmentType) {
      alert('Please select date, time, and appointment type');
      return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const appointmentData = {
      caseId,
      title: `${appointmentType.replace('_', ' ')} Appointment`,
      description,
      appointmentType,
      scheduledAt: scheduledAt.toISOString(),
      duration,
      location: location === 'virtual' ? 'Virtual' : 'Office Meeting Room 101',
      meetingLink: location === 'virtual' ? meetingLink : undefined
    };

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) throw new Error('Failed to schedule appointment');
      
      const result = await response.json();
      onAppointmentScheduled(result.data);
      
      // Send confirmation
      await sendConfirmation(result.data.id);
      
      alert('Appointment scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    }
  };

  const sendConfirmation = async (appointmentId: string) => {
    try {
      await fetch('/api/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          caseId,
          type: 'APPOINTMENT_CONFIRMATION',
          channel: 'EMAIL',
          subject: 'Appointment Confirmation',
          body: `Your appointment has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
          toEmail: 'client@example.com' // Would come from case data
        })
      });
    } catch (error) {
      console.error('Failed to send confirmation:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Appointment</h1>
        <p className="text-gray-600">Select date and time for the appointment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Date</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSelectedDate(prev => addDays(prev, -7))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {format(selectedDate, 'MMMM yyyy')}
                </span>
                <button
                  onClick={() => setSelectedDate(prev => addDays(prev, 7))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {getCalendarDays(selectedDate).map((day, index) => (
                <button
                  key={index}
                  onClick={() => !day.disabled && handleDateSelect(day.date)}
                  className={`
                    p-2 rounded-lg text-center text-sm font-medium
                    ${day.isToday ? 'border-2 border-primary' : ''}
                    ${day.isSelected ? 'bg-primary text-white' : ''}
                    ${!day.disabled ? 'hover:bg-gray-100' : ''}
                    ${day.disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'}
                  `}
                  disabled={day.disabled}
                >
                  {format(day.date, 'd')}
                </button>
              ))}
            </div>
          </div>

          {/* Appointment Details Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {Object.values(AppointmentType).map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setLocation('office')}
                    className={`flex-1 px-4 py-2 rounded-lg border ${location === 'office' ? 'border-primary bg-primary-surface text-primary' : 'border-gray-300 text-gray-700'}`}
                  >
                    Office
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('virtual')}
                    className={`flex-1 px-4 py-2 rounded-lg border ${location === 'virtual' ? 'border-primary bg-primary-surface text-primary' : 'border-gray-300 text-gray-700'}`}
                  >
                    Virtual
                  </button>
                </div>
              </div>
              
              {location === 'virtual' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Add meeting agenda or notes..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Time Slots */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Time Slots
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600">Loading available slots...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No available slots for this date
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`
                    p-3 rounded-lg border text-center text-sm font-medium transition-colors
                    ${selectedTime === slot.time 
                      ? 'border-primary bg-primary-surface text-primary' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    ${slot.booked ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={slot.booked}
                >
                  {slot.time}
                  {slot.booked && <div className="text-xs text-gray-500 mt-1">Booked</div>}
                </button>
              ))}
            </div>
          )}
          
          {/* Selected Appointment Summary */}
          {selectedTime && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Appointment Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{format(selectedDate, 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{appointmentType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{location === 'virtual' ? 'Virtual Meeting' : 'Office'}</span>
                </div>
              </div>
              
              <button
                onClick={handleSchedule}
                disabled={loading || !selectedTime}
                className="w-full mt-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Scheduling...' : 'Schedule Appointment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

## Component Library

### Reusable Components

#### Button Component
```tsx
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled || loading ? disabledClasses : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};
```

#### Input Component
```tsx
// src/components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  icon,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2
    ${error 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-primary'
    }
    ${icon ? 'pl-10' : ''}
    ${className}
  `;
  
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input className={inputClasses} {...props} />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

#### Modal Component
```tsx
// src/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  footer 
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
          
          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

This UI/UX prototype document provides a comprehensive design system, detailed prototypes for key interfaces, and reusable component examples for the Immigration CRM System.