import { useMemo, useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { onboardingStatusConfig, getStatusOrder, OnboardingStatus } from "@/config/onboardingStatus";
import { cn } from "@/lib/utils";
import {
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Mail,
  MailX,
  MailWarning,
  MailOpen,
  MousePointerClick,
  AlertTriangle,
  Pencil,
  UserX,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { EmailRecord } from "@/data/emailTracking";

// CompanyWithTracking type (mirrors the one in Incentive.tsx)
interface CompanyWithTracking {
  id: string;
  name: string;
  contact: {
    email: string;
  };
  onboardingStatus: OnboardingStatus;
  emailsSent: number;
  lastContactDate?: string;
  emailHistory: EmailRecord[];
  completedVia?: 'simple' | 'formulario';
  hasDeliveryIssues: boolean;
  lastDeliveryIssue?: {
    type: 'bounced' | 'spam' | 'optout';
    reason?: string;
    date: string;
    emailAtIssue?: string;
  };
  archiveReason?: 'spam' | 'optout' | 'completed';
}

interface IncentiveTableProps {
  companies: CompanyWithTracking[];
  onUpdateEmail: (companyId: string, email: string) => void;
  onSendEmail: (companyId: string, template: string) => void;
  isArchiveTab?: boolean;
}

type SortField = 'name' | 'email' | 'status' | 'emailsSent';
type SortDirection = 'asc' | 'desc';

interface SortState {
  field: SortField;
  direction: SortDirection;
}

// EditableEmailCell component for inline email editing
interface EditableEmailCellProps {
  value: string;
  companyId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  hasDeliveryIssue: boolean;
  deliveryIssue?: {
    type: 'bounced' | 'spam';
    reason?: string;
  };
}

function EditableEmailCell({
  value,
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
  hasDeliveryIssue,
  deliveryIssue,
}: EditableEmailCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValue, setEditValue] = useState(value);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value);
    }
  }, [isEditing, value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    } else {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        className={cn(
          "h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm",
          "focus-visible:outline-none focus-visible:border-ring"
        )}
      />
    );
  }

  return (
    <div
      className="flex items-center gap-2 group/email"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Delivery issue indicator - bounced emails (ANTES do email) */}
      {hasDeliveryIssue && deliveryIssue && deliveryIssue.type === 'bounced' && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="shrink-0 text-danger">
                <MailX className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="border border-danger max-w-[250px]">
              <p className="font-bold">Email não entregue</p>
              {deliveryIssue.reason && (
                <p className="text-xs text-muted-foreground mt-1">{deliveryIssue.reason}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Delivery issue indicator - spam (ANTES do email) */}
      {hasDeliveryIssue && deliveryIssue && deliveryIssue.type === 'spam' && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="shrink-0 text-danger">
                <MailWarning className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="border border-danger max-w-[250px]">
              <p className="font-bold">Marcado como spam</p>
              {deliveryIssue.reason && (
                <p className="text-xs text-muted-foreground mt-1">{deliveryIssue.reason}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Delivery issue indicator - opt-out (ANTES do email) */}
      {hasDeliveryIssue && deliveryIssue && deliveryIssue.type === 'optout' && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="shrink-0 text-danger">
                <UserX className="h-3.5 w-3.5" />
              </span>
            </TooltipTrigger>
            <TooltipContent className="border border-danger max-w-[250px]">
              <p className="font-bold">Opt-out</p>
              <p className="text-xs text-muted-foreground mt-1">Este contacto pediu para não ser contactado</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <span className="text-muted-foreground truncate">{value}</span>

      {/* Action buttons - show on hover or always when there's a delivery issue */}
      {(showActions || hasDeliveryIssue) && (
        <div className="flex items-center gap-1 shrink-0">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEdit();
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

// SortableHeader component
interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortState: SortState;
  onSort: (field: SortField) => void;
  children?: React.ReactNode;
  className?: string;
}

function SortableHeader({ field, label, sortState, onSort, children, className }: SortableHeaderProps) {
  const isActive = sortState.field === field;

  return (
    <TableHead className={className}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSort(field)}
          className={cn(
            "flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded",
            isActive ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
          {isActive ? (
            sortState.direction === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </button>
        {children}
      </div>
    </TableHead>
  );
}

// StatusFilter component
type FilterStatus = OnboardingStatus;

const allFilterStatuses: { value: FilterStatus; label: string }[] = [
  { value: 'por_contactar', label: 'Por contactar' },
  { value: 'sem_interacao', label: 'Sem interação' },
  { value: 'interessada', label: 'Interessada' },
  { value: 'registada_simple', label: 'Registada / Simple' },
  { value: 'em_progresso_simple', label: 'Em progresso / Simple' },
  { value: 'em_progresso_formulario', label: 'Em progresso / Formulário' },
  { value: 'completo', label: 'Completo' },
];

interface StatusFilterProps {
  statusFilters: FilterStatus[];
  setStatusFilters: (filters: FilterStatus[]) => void;
  statusCounts: Record<FilterStatus, number>;
}

function StatusFilter({ statusFilters, setStatusFilters, statusCounts }: StatusFilterProps) {
  const activeCount = statusFilters.length;

  const toggleStatus = (status: FilterStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter(s => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  const clearFilters = () => {
    setStatusFilters([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Filtrar por estado</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {allFilterStatuses.map(({ value, label }) => {
            const count = statusCounts[value] || 0;

            return (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={statusFilters.includes(value)}
                  onCheckedChange={() => toggleStatus(value)}
                />
                <span className="flex-1 text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// DeliveryStatusFilter component
type DeliveryStatus = 'bounced' | 'spam' | 'optout' | 'none';

interface DeliveryStatusFilterProps {
  deliveryFilters: DeliveryStatus[];
  setDeliveryFilters: (filters: DeliveryStatus[]) => void;
  deliveryCounts: Record<DeliveryStatus, number>;
}

function DeliveryStatusFilter({ deliveryFilters, setDeliveryFilters, deliveryCounts }: DeliveryStatusFilterProps) {
  const activeCount = deliveryFilters.length;

  const toggleFilter = (status: DeliveryStatus) => {
    if (deliveryFilters.includes(status)) {
      setDeliveryFilters(deliveryFilters.filter(s => s !== status));
    } else {
      setDeliveryFilters([...deliveryFilters, status]);
    }
  };

  const clearFilters = () => {
    setDeliveryFilters([]);
  };

  const options: { value: DeliveryStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'bounced', label: 'Não entregue', icon: <MailX className="h-3.5 w-3.5 text-danger" /> },
    { value: 'spam', label: 'Spam', icon: <MailWarning className="h-3.5 w-3.5 text-danger" /> },
    { value: 'optout', label: 'Opt-out', icon: <UserX className="h-3.5 w-3.5 text-danger" /> },
    { value: 'none', label: 'Sem problemas', icon: <Mail className="h-3.5 w-3.5 text-muted-foreground" /> },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Problemas de entrega</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {options.map(({ value, label, icon }) => {
            const count = deliveryCounts[value] || 0;

            return (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={deliveryFilters.includes(value)}
                  onCheckedChange={() => toggleFilter(value)}
                />
                {icon}
                <span className="flex-1 text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// NextActionFilter component
interface NextActionFilterProps {
  actionFilters: string[];
  setActionFilters: (filters: string[]) => void;
  actionCounts: Record<string, number>;
}

function NextActionFilter({ actionFilters, setActionFilters, actionCounts }: NextActionFilterProps) {
  const activeCount = actionFilters.length;

  const toggleFilter = (action: string) => {
    if (actionFilters.includes(action)) {
      setActionFilters(actionFilters.filter(a => a !== action));
    } else {
      setActionFilters([...actionFilters, action]);
    }
  };

  const clearFilters = () => {
    setActionFilters([]);
  };

  const actions = [
    'Convite Inicial',
    'Lembrete',
    'Benefícios',
    'Urgente',
    '—',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Ação sugerida</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {actions.map((action) => {
            const count = actionCounts[action] || 0;

            return (
              <label
                key={action}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={actionFilters.includes(action)}
                  onCheckedChange={() => toggleFilter(action)}
                />
                <span className="flex-1 text-sm">{action}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// EmailCountFilter component
type EmailCountOption = '0' | '1' | '2' | '3+';

interface EmailCountFilterProps {
  emailCountFilters: EmailCountOption[];
  setEmailCountFilters: (filters: EmailCountOption[]) => void;
  emailCountCounts: Record<EmailCountOption, number>;
}

function EmailCountFilter({ emailCountFilters, setEmailCountFilters, emailCountCounts }: EmailCountFilterProps) {
  const activeCount = emailCountFilters.length;

  const toggleFilter = (option: EmailCountOption) => {
    if (emailCountFilters.includes(option)) {
      setEmailCountFilters(emailCountFilters.filter(o => o !== option));
    } else {
      setEmailCountFilters([...emailCountFilters, option]);
    }
  };

  const clearFilters = () => {
    setEmailCountFilters([]);
  };

  const options: { value: EmailCountOption; label: string }[] = [
    { value: '0', label: 'Nunca contactadas' },
    { value: '1', label: '1 email enviado' },
    { value: '2', label: '2 emails enviados' },
    { value: '3+', label: '3+ emails (saturadas)' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative p-1 rounded hover:bg-muted transition-colors",
            activeCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="end">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold">Nº emails enviados</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Limpar
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {options.map(({ value, label }) => {
            const count = emailCountCounts[value] || 0;

            return (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded -mx-1"
              >
                <Checkbox
                  checked={emailCountFilters.includes(value)}
                  onCheckedChange={() => toggleFilter(value)}
                />
                <span className="flex-1 text-sm">{label}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Next action helper based on onboarding status and emails sent
const getNextAction = (status: string, emailsSent: number): string => {
  // Empresas que já completaram não precisam de email
  if (status === 'completo') return '—';

  // Por contactar: primeiro email
  if (status === 'por_contactar') return 'Convite Inicial';

  // Escalada baseada em emails enviados
  if (emailsSent >= 3) return 'Urgente';

  // Lógica por estado
  switch (status) {
    case 'sem_interacao':
      return emailsSent === 1 ? 'Lembrete' : 'Benefícios';
    case 'interessada':
    case 'registada_simple':
      return emailsSent === 1 ? 'Benefícios' : 'Lembrete';
    case 'em_progresso_simple':
    case 'em_progresso_formulario':
      return 'Lembrete';
    default:
      return '';
  }
};

// Email count color helper
const getEmailCountColor = (count: number, hasDeliveryIssues: boolean) => {
  if (hasDeliveryIssues) {
    return "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-colors";
  }
  if (count === 0) return "bg-muted text-muted-foreground border border-muted-foreground/30";
  if (count === 1) return "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors";
  if (count === 2) return "bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30 transition-colors";
  return "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 transition-colors";
};

// Email History Popover
interface EmailHistoryPopoverProps {
  company: CompanyWithTracking;
}

function EmailHistoryPopover({ company }: EmailHistoryPopoverProps) {
  const formatEmailDate = (dateString: string) => {
    return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: pt });
  };

  // Determinar icone e cor baseado no status de entrega
  const getEmailIcon = (email: EmailRecord) => {
    if (email.deliveryStatus === 'bounced') return { icon: MailX, color: 'bg-danger/20 text-danger' };
    if (email.deliveryStatus === 'spam') return { icon: MailWarning, color: 'bg-danger/20 text-danger' };
    if (email.deliveryStatus === 'clicked') return { icon: MousePointerClick, color: 'bg-success/20 text-success' };
    if (email.deliveryStatus === 'opened') return { icon: MailOpen, color: 'bg-primary/20 text-primary' };
    return { icon: Mail, color: 'bg-muted text-muted-foreground' };
  };

  if (company.emailHistory.length === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-normal bg-muted text-muted-foreground border border-muted-foreground/30 rounded-md">
        <Mail className="h-3.5 w-3.5" />
        0
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-normal rounded-md",
            getEmailCountColor(company.emailsSent, company.hasDeliveryIssues)
          )}
        >
          {company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'bounced' ? (
            <MailX className="h-3.5 w-3.5" />
          ) : company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'spam' ? (
            <MailWarning className="h-3.5 w-3.5" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          {company.emailsSent}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-sm">Historico de Emails</p>
            <div className="flex items-center gap-1">
              {company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'bounced' && (
                <Badge variant="outline" className="text-xs border-danger/50 text-danger bg-danger/10">
                  <MailX className="h-3 w-3 mr-1" />
                  Bounce
                </Badge>
              )}
              {company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'spam' && (
                <Badge variant="outline" className="text-xs border-danger/50 text-danger bg-danger/10">
                  <MailWarning className="h-3 w-3 mr-1" />
                  Spam
                </Badge>
              )}
              {company.emailsSent >= 3 && !company.hasDeliveryIssues && (
                <Badge variant="outline" className="text-xs border-danger/50 text-danger bg-danger/10">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Saturacao
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {company.emailsSent} email{company.emailsSent !== 1 ? 's' : ''} enviado{company.emailsSent !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="p-3 space-y-3 max-h-[250px] overflow-y-auto">
          {company.emailHistory.map((email, index) => {
            const { icon: EmailIcon, color: iconColor } = getEmailIcon(email);

            return (
              <div key={email.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", iconColor)}>
                    <EmailIcon className="h-4 w-4" />
                  </div>
                  {index < company.emailHistory.length - 1 && (
                    <div className="w-px h-full bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{email.templateUsed}</p>
                    {email.deliveryStatus === 'bounced' && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 border-danger/50 text-danger">
                        {email.bounceType === 'hard' ? 'Hard bounce' : 'Soft bounce'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {email.subject}
                  </p>
                  {email.bounceReason && (
                    <p className="text-xs text-danger mt-0.5">{email.bounceReason}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(email.sentAt), { addSuffix: true, locale: pt })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function IncentiveTable({
  companies,
  onUpdateEmail,
  onSendEmail,
  isArchiveTab = false,
}: IncentiveTableProps) {
  const [sortState, setSortState] = useState<SortState>({
    field: 'status',
    direction: 'desc' // Default: menos avancado primeiro
  });
  const [statusFilters, setStatusFilters] = useState<FilterStatus[]>([]);
  const [deliveryFilters, setDeliveryFilters] = useState<DeliveryStatus[]>([]);
  const [actionFilters, setActionFilters] = useState<string[]>([]);
  const [emailCountFilters, setEmailCountFilters] = useState<EmailCountOption[]>([]);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  // Count companies by status (for filter display)
  const statusCounts = useMemo(() => {
    const counts: Record<FilterStatus, number> = {} as Record<FilterStatus, number>;
    allFilterStatuses.forEach(({ value }) => counts[value] = 0);

    companies.forEach(company => {
      counts[company.onboardingStatus] = (counts[company.onboardingStatus] || 0) + 1;
    });

    return counts;
  }, [companies]);

  // Count companies by delivery status (for filter display)
  const deliveryCounts = useMemo(() => {
    const counts: Record<DeliveryStatus, number> = { bounced: 0, spam: 0, optout: 0, none: 0 };

    companies.forEach(company => {
      if (company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'bounced') {
        counts.bounced++;
      } else if (company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'spam') {
        counts.spam++;
      } else if (company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'optout') {
        counts.optout++;
      } else {
        counts.none++;
      }
    });

    return counts;
  }, [companies]);

  // Count companies by next action (for filter display)
  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    companies.forEach(company => {
      const action = getNextAction(company.onboardingStatus, company.emailsSent);
      counts[action] = (counts[action] || 0) + 1;
    });

    return counts;
  }, [companies]);

  // Count companies by email count (for filter display)
  const emailCountCounts = useMemo(() => {
    const counts: Record<EmailCountOption, number> = { '0': 0, '1': 0, '2': 0, '3+': 0 };

    companies.forEach(company => {
      if (company.emailsSent === 0) counts['0']++;
      else if (company.emailsSent === 1) counts['1']++;
      else if (company.emailsSent === 2) counts['2']++;
      else counts['3+']++;
    });

    return counts;
  }, [companies]);

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let result = [...companies];

    // Filter by status
    if (statusFilters.length > 0) {
      result = result.filter(company => statusFilters.includes(company.onboardingStatus));
    }

    // Filter by delivery status
    if (deliveryFilters.length > 0) {
      result = result.filter(company => {
        if (deliveryFilters.includes('bounced') && company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'bounced') {
          return true;
        }
        if (deliveryFilters.includes('spam') && company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'spam') {
          return true;
        }
        if (deliveryFilters.includes('optout') && company.hasDeliveryIssues && company.lastDeliveryIssue?.type === 'optout') {
          return true;
        }
        if (deliveryFilters.includes('none') && !company.hasDeliveryIssues) {
          return true;
        }
        return false;
      });
    }

    // Filter by next action
    if (actionFilters.length > 0) {
      result = result.filter(company => {
        const action = getNextAction(company.onboardingStatus, company.emailsSent);
        return actionFilters.includes(action);
      });
    }

    // Filter by email count
    if (emailCountFilters.length > 0) {
      result = result.filter(company => {
        if (emailCountFilters.includes('0') && company.emailsSent === 0) return true;
        if (emailCountFilters.includes('1') && company.emailsSent === 1) return true;
        if (emailCountFilters.includes('2') && company.emailsSent === 2) return true;
        if (emailCountFilters.includes('3+') && company.emailsSent >= 3) return true;
        return false;
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortState.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'pt');
          break;
        case 'email':
          comparison = a.contact.email.localeCompare(b.contact.email, 'pt');
          break;
        case 'status':
          comparison = getStatusOrder(a.onboardingStatus) - getStatusOrder(b.onboardingStatus);
          break;
        case 'emailsSent':
          comparison = a.emailsSent - b.emailsSent;
          break;
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [companies, statusFilters, deliveryFilters, actionFilters, emailCountFilters, sortState]);

  // Check if any filter is active
  const hasActiveFilters = statusFilters.length > 0 || deliveryFilters.length > 0 || actionFilters.length > 0 || emailCountFilters.length > 0;

  // Clear all filters
  const clearAllFilters = () => {
    setStatusFilters([]);
    setDeliveryFilters([]);
    setActionFilters([]);
    setEmailCountFilters([]);
  };

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (filteredAndSortedCompanies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {hasActiveFilters
            ? "Nenhuma empresa encontrada com os filtros atuais."
            : "Nenhuma empresa encontrada."
          }
        </p>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="mt-3"
          >
            Limpar filtros
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <SortableHeader
              field="name"
              label="Nome"
              sortState={sortState}
              onSort={handleSort}
            />
            <SortableHeader
              field="email"
              label="Email"
              sortState={sortState}
              onSort={handleSort}
              className="min-w-[250px]"
            >
              <DeliveryStatusFilter
                deliveryFilters={deliveryFilters}
                setDeliveryFilters={setDeliveryFilters}
                deliveryCounts={deliveryCounts}
              />
            </SortableHeader>
            <SortableHeader
              field="status"
              label="Estado"
              sortState={sortState}
              onSort={handleSort}
            >
              <StatusFilter
                statusFilters={statusFilters}
                setStatusFilters={setStatusFilters}
                statusCounts={statusCounts}
              />
            </SortableHeader>
            <SortableHeader
              field="emailsSent"
              label="Histórico"
              sortState={sortState}
              onSort={handleSort}
              className="w-24"
            >
              <EmailCountFilter
                emailCountFilters={emailCountFilters}
                setEmailCountFilters={setEmailCountFilters}
                emailCountCounts={emailCountCounts}
              />
            </SortableHeader>
            {/* Próximo email column with filter */}
            <TableHead className="text-muted-foreground">
              <div className="flex items-center gap-1">
                <span>Próximo email</span>
                <NextActionFilter
                  actionFilters={actionFilters}
                  setActionFilters={setActionFilters}
                  actionCounts={actionCounts}
                />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedCompanies.map((company) => {
            const config = onboardingStatusConfig[company.onboardingStatus];
            const isEditing = editingCompanyId === company.id;

            return (
              <TableRow
                key={company.id}
                className={cn(
                  "group",
                  !isArchiveTab && company.hasDeliveryIssues && "bg-danger/5",
                  !isArchiveTab && company.emailsSent >= 3 && !company.hasDeliveryIssues && "bg-danger/5"
                )}
              >
                {/* Name cell */}
                <TableCell className="font-normal">
                  {company.name}
                </TableCell>

                {/* Email cell with inline editing */}
                <TableCell className="min-w-[250px]">
                  <EditableEmailCell
                    value={company.contact.email}
                    companyId={company.id}
                    isEditing={isEditing}
                    onStartEdit={() => setEditingCompanyId(company.id)}
                    onSave={(email) => {
                      onUpdateEmail(company.id, email);
                      setEditingCompanyId(null);
                    }}
                    onCancel={() => setEditingCompanyId(null)}
                    hasDeliveryIssue={company.hasDeliveryIssues}
                    deliveryIssue={company.lastDeliveryIssue}
                  />
                </TableCell>

                {/* Status cell */}
                <TableCell>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">
                          <Badge className={`text-xs py-0 ${config?.color || 'bg-muted text-muted-foreground'}`}>
                            {config?.label || company.onboardingStatus}
                          </Badge>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className={cn("border", config?.borderColor)}>
                        {config?.tooltip || ''}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                </TableCell>

                {/* Emails sent cell */}
                <TableCell className="w-24">
                  <EmailHistoryPopover company={company} />
                </TableCell>

                {/* Next action cell */}
                <TableCell>
                  {(() => {
                    const template = getNextAction(company.onboardingStatus, company.emailsSent);

                    // Determinar se envio está bloqueado
                    const isSendingBlocked = company.hasDeliveryIssues && (
                      company.lastDeliveryIssue?.type === 'spam' ||
                      company.lastDeliveryIssue?.type === 'optout' ||
                      (company.lastDeliveryIssue?.type === 'bounced' &&
                       company.lastDeliveryIssue?.emailAtIssue === company.contact.email)
                    );

                    if (template === '—') {
                      return <span className="text-xs text-muted-foreground px-3">—</span>;
                    }

                    if (isSendingBlocked) {
                      const issueType = company.lastDeliveryIssue?.type;
                      const label = issueType === 'spam' ? 'Spam'
                                  : issueType === 'optout' ? 'Opt-out'
                                  : 'Corrigir email';
                      const tooltip = issueType === 'spam' ? 'Este contacto marcou emails como spam'
                                    : issueType === 'optout' ? 'Este contacto pediu para não ser contactado'
                                    : 'Corrija o email para reativar o envio';

                      return (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-xs text-danger flex items-center gap-1.5 px-3 cursor-help">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                {label}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="border border-danger">
                              {tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    }

                    return (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => onSendEmail(company.id, template)}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {template}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    );
                  })()}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export type { CompanyWithTracking };
