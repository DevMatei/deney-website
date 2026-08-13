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

export function createIcon(name: string) {
  const Glyph = GLYPHS[name] ?? LucideCircle;
  return function IconsGlyph(
    props: React.ComponentProps<LucideIcon> & { size?: number | string },
  ) {
    return <Glyph {...props} />;
  };
}

export const X = createIcon("close");
export const Home = createIcon("home");
export const Camera = createIcon("photo_camera");
export const User = createIcon("person");
export const Mail = createIcon("mail");
export const ChevronLeft = createIcon("chevron_left");
export const ChevronRight = createIcon("chevron_right");
export const ArrowUp = createIcon("arrow_upward");
export const ArrowLeft = createIcon("arrow_back");
export const ArrowRight = createIcon("arrow_forward");
export const Calendar = createIcon("calendar");
export const ExternalLink = createIcon("open_in_new");
