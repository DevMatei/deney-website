import {
  ArrowLeft as LucideArrowLeft,
  ArrowRight as LucideArrowRight,
  ArrowUp as LucideArrowUp,
  Calendar as LucideCalendar,
  Camera as LucideCamera,
  Check as LucideCheck,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  Circle as LucideCircle,
  Copy as LucideCopy,
  ExternalLink as LucideExternalLink,
  Home as LucideHome,
  Image as LucideImage,
  Info as LucideInfo,
  Mail as LucideMail,
  Monitor as LucideMonitor,
  Moon as LucideMoon,
  Settings as LucideSettings,
  Sun as LucideSun,
  User as LucideUser,
  X as LucideX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const GLYPHS: Record<string, LucideIcon> = {
  home: LucideHome,
  photo_camera: LucideCamera,
  camera: LucideCamera,
  person: LucideUser,
  mail: LucideMail,
  settings: LucideSettings,
  chevron_left: LucideChevronLeft,
  chevron_right: LucideChevronRight,
  close: LucideX,
  arrow_upward: LucideArrowUp,
  arrow_forward: LucideArrowRight,
  arrow_back: LucideArrowLeft,
  calendar: LucideCalendar,
  content_copy: LucideCopy,
  check: LucideCheck,
  light_mode: LucideSun,
  dark_mode: LucideMoon,
  desktop_windows: LucideMonitor,
  open_in_new: LucideExternalLink,
  info: LucideInfo,
  image: LucideImage,
};

export function materialIcon(name: string) {
  const Glyph = GLYPHS[name] ?? LucideCircle;
  return function MaterialIconGlyph(
    props: React.ComponentProps<LucideIcon> & { size?: number | string },
  ) {
    return <Glyph {...props} />;
  };
}

export const X = materialIcon("close");
export const Settings = materialIcon("settings");
export const Home = materialIcon("home");
export const Camera = materialIcon("photo_camera");
export const User = materialIcon("person");
export const Mail = materialIcon("mail");
export const ChevronLeft = materialIcon("chevron_left");
export const ChevronRight = materialIcon("chevron_right");
export const ArrowUp = materialIcon("arrow_upward");
export const ArrowLeft = materialIcon("arrow_back");
export const ArrowRight = materialIcon("arrow_forward");
export const Calendar = materialIcon("calendar");
export const Copy = materialIcon("content_copy");
export const Check = materialIcon("check");
export const Sun = materialIcon("light_mode");
export const Moon = materialIcon("dark_mode");
export const Monitor = materialIcon("desktop_windows");
export const ExternalLink = materialIcon("open_in_new");
export const Info = materialIcon("info");
export const ImageIcon = materialIcon("image");
