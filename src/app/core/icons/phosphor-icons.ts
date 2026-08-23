import { provideIcons } from '@ng-icons/core';
import {
  phosphorArrowDownFill as phosphorArrowDown,
  phosphorArrowUpFill as phosphorArrowUp,
  phosphorArrowsDownUpFill as phosphorArrowsDownUp,
  phosphorCurrencyDollarFill as phosphorCurrencyDollar,
  phosphorMagnifyingGlassFill as phosphorMagnifyingGlass,
  phosphorPackageFill as phosphorPackage,
  phosphorListFill as phosphorList,
  phosphorPenFill as phosphorPencil,
  phosphorPlusFill as phosphorPlus,
  phosphorShoppingCartFill as phosphorShoppingCart,
  phosphorTrashFill as phosphorTrash,
} from '@ng-icons/phosphor-icons/fill';

export const providePhosphorIcons = () => provideIcons({ phosphorArrowDown, phosphorArrowUp, phosphorArrowsDownUp, phosphorCurrencyDollar, phosphorList, phosphorMagnifyingGlass, phosphorPackage, phosphorPencil, phosphorPlus, phosphorShoppingCart, phosphorTrash });
