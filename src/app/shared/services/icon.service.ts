// src/app/shared/services/icon.service.ts
import {
  Home01Icon,
  Search01Icon,
  Settings01Icon,
  Notification01Icon, // Corretto (era BellIcon)
  CheckmarkCircleIcon, // Corretto (era CheckmarkCircle01Icon)
  AlertCircleIcon, // Corretto (era AlertCircle01Icon)
  CircleIcon,
  Cancel01Icon, // Corretto (era CloseIcon)
  Add01Icon, // Corretto (era Plus01Icon)
  Edit02Icon,
  Delete01Icon, // Corretto (era Trash01Icon)
  Download01Icon, // Corretto (era ChartDownloadIcon)
  Layers01Icon,
  Sun01Icon,
  Moon01Icon,
  Menu01Icon,
  StarIcon, // Corretto (era Star01Icon)
  UserGroupIcon, // Corretto (era Users01Icon)
  LayoutGridIcon,
  TypeCursorIcon, // Corretto (era Type01Icon)
  ToggleOnIcon,
  Tick01Icon, // Corretto (era CheckIcon)
  Edit04Icon,
  TableIcon,
  ArrowRight01Icon,
  Share01Icon,
  CallDisabled02Icon,
  AlertDiamondIcon, // Corretto (era AlertTriangleIcon)
  RankingIcon,
  EyeIcon, // Corretto (era Eye01Icon)
  ViewOffIcon, // Corretto (era EyeOff01Icon)
  LockIcon, // Corretto (era Lock01Icon)
  FilterIcon, // Corretto (era Filter01Icon)
  Sorting01Icon, // Corretto (era Sort01Icon)
  Copy01Icon,
  Upload01Icon,
  Calendar01Icon,
  Clock01Icon,
  SmartPhone01Icon, // Corretto (era Mobile01Icon)
  LaptopIcon, // Corretto (era Laptop01Icon)
  ComputerIcon, // Corretto (era Monitor01Icon)
  HeadphonesIcon, // Corretto (era Headphone01Icon)
  VolumeHighIcon, // Corretto (era Volume01Icon)
  Mic01Icon,
  MicOff01Icon,
  PlayIcon,
  PauseIcon,
  Folder01Icon,
  Mail01Icon,
  Pen01Icon,
  Link01Icon,
  Archive01Icon,
  Xls01Icon,
  Cash02Icon,
  Copy02Icon,
  Share02Icon,
  MoreVerticalIcon,
  MoreHorizontalIcon,
  Logout01Icon,
  Login01Icon,
  MailSend01Icon, // Aggiunto per 'send' e 'message'
  ListViewIcon, // Aggiunto per 'list'
  MusicNote01Icon, // Aggiunto per 'music'
} from '@hugeicons/core-free-icons';

export const WYRMREST_ICONS = {
  // Navigation & UI
  home: Home01Icon,
  search: Search01Icon,
  settings: Settings01Icon,
  bell: Notification01Icon,
  menu: Menu01Icon,
  close: Cancel01Icon,
  download: Download01Icon,
  share: Share01Icon,
  more: MoreVerticalIcon,
  moreHorizontal: MoreHorizontalIcon,
  logout: Logout01Icon, // Corretto (typo LogOut)
  login: Login01Icon, // Corretto (typo LogIn)

  // Status & Feedback
  success: CheckmarkCircleIcon,
  error: AlertCircleIcon,
  warning: AlertDiamondIcon,
  info: CircleIcon,
  alert: AlertDiamondIcon,
  loader: Layers01Icon,

  // Actions
  plus: Add01Icon,
  edit: Edit02Icon,
  delete: Delete01Icon,
  star: StarIcon,
  trash: Delete01Icon,
  copy: Copy01Icon,
  link: Link01Icon,
  archive: Archive01Icon,
  send: MailSend01Icon,

  // Theme
  sun: Sun01Icon,
  moon: Moon01Icon,

  // Components showcase
  users: UserGroupIcon,
  grid: LayoutGridIcon,
  list: ListViewIcon,
  type: TypeCursorIcon,
  toggle: ToggleOnIcon,
  checkbox: Tick01Icon,
  input: Edit04Icon,
  table: TableIcon,
  arrow: ArrowRight01Icon,

  // Vision
  eye: EyeIcon,
  eyeOff: ViewOffIcon,

  // Security
  lock: LockIcon,

  // Filtering & Sorting
  filter: FilterIcon,
  sort: Sorting01Icon,

  // File & Folder
  folder: Folder01Icon,
  upload: Upload01Icon,
  mail: Mail01Icon,

  // Communication
  message: MailSend01Icon,

  // Date & Time
  calendar: Calendar01Icon,
  clock: Clock01Icon,

  // Devices
  mobile: SmartPhone01Icon,
  laptop: LaptopIcon,
  monitor: ComputerIcon,

  // Audio
  headphone: HeadphonesIcon,
  volume: VolumeHighIcon,
  mic: Mic01Icon,
  micOff: MicOff01Icon,

  // Media
  music: MusicNote01Icon,
  play: PlayIcon, // Corretto (era Play01Icon)
  pause: PauseIcon, // Corretto (era Pause01Icon)
};

export type IconKey = keyof typeof WYRMREST_ICONS;