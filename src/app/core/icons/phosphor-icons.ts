import { provideIcons } from '@ng-icons/core';
import {
  phosphorArrowDownFill as phosphorArrowDown,
  phosphorArrowUpFill as phosphorArrowUp,
  phosphorArrowsDownUpFill as phosphorArrowsDownUp,
  phosphorCurrencyDollarFill as phosphorCurrencyDollar,
  phosphorMagnifyingGlassFill as phosphorMagnifyingGlass,
  phosphorPackageFill as phosphorPackage,
  phosphorPenFill as phosphorPencil,
  phosphorPlusFill as phosphorPlus,
  phosphorShoppingCartFill as phosphorShoppingCart,
  phosphorTrashFill as phosphorTrash,
} from '@ng-icons/phosphor-icons/fill';
import { phosphorCheck, phosphorExclamationMark, phosphorList, phosphorX, phosphorXCircle } from '@ng-icons/phosphor-icons/regular';

export const providePhosphorIcons = () => provideIcons({ phosphorArrowDown, phosphorArrowUp, phosphorArrowsDownUp, phosphorCheck, phosphorCurrencyDollar, phosphorExclamationMark, phosphorList, phosphorMagnifyingGlass, phosphorPackage, phosphorPencil, phosphorPlus, phosphorShoppingCart, phosphorTrash, phosphorX, phosphorXCircle });
