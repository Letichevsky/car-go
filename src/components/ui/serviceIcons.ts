import {
  BoxIcon,
  CartIcon,
  HomeIcon,
  KeyIcon,
  MoversIcon,
  OfficeIcon,
  ToolsIcon,
  TruckIcon,
} from "@/components/ui/icons";
import type { ServiceKey } from "@/data/services";

/**
 * Иконка каждой услуги — одна на все места: карточки на главной, выпадающий
 * список в шапке, меню на телефоне. Иначе они разъедутся при первой же правке.
 */
export const serviceIcons: Record<ServiceKey, typeof HomeIcon> = {
  home: HomeIcon,
  turnkey: KeyIcon,
  office: OfficeIcon,
  packing: BoxIcon,
  assembly: ToolsIcon,
  equipment: TruckIcon,
  delivery: CartIcon,
  loading: MoversIcon,
};
