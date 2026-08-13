import {
  ArrowLeft as LucideArrowLeft,
  ArrowRight as LucideArrowRight,
  ArrowUp as LucideArrowUp,
  Calendar as LucideCalendar,
  Camera as LucideCamera,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  Circle as LucideCircle,
  ExternalLink as LucideExternalLink,
  Home as LucideHome,
  Mail as LucideMail,
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
  chevron_left: LucideChevronLeft,
  chevron_right: LucideChevronRight,
  close: LucideX,
  arrow_upward: LucideArrowUp,
  arrow_forward: LucideArrowRight,
  arrow_back: LucideArrowLeft,
  calendar: LucideCalendar,
  open_in_new: LucideExternalLink,
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
export const ExternalLink = materialIcon("open_in_new");
