import { CreateUser1615943770893 } from './migrations/1615943770893-CreateUser'
import { CreateSessionUser1615943956225 } from './migrations/1615943956225-CreateSessionUser'
import { CreateSale1615943985377 } from './migrations/1615943985377-CreateSale'
import { CreatePayment1615944009042 } from './migrations/1615944009042-CreatePayment'
import { CreateItem1615944078899 } from './migrations/1615944078899-CreateItem'
import { CreateProduct1615944152246 } from './migrations/1615944152246-CreateProduct'
import { CreateCashHandler1615944183320 } from './migrations/1615944183320-CreateCashHandler'
import { CreateSettings1615944534764 } from './migrations/1615944534764-CreateSettings'
import { CreateStore1617144243177 } from './migrations/1617144243177-CreateStore'
import { CreateStoreCashes1617145792700 } from './migrations/1617145792700-CreateStoreCashes'
import { CreateItemOutCart1617317287530 } from './migrations/1617317287530-CreateItemOutCart'
import { AddNfeFieldsToProducts1625183586246 } from './migrations/1625183586246-AddNfeFieldsToProducts'
import { AddNfeToSale1625615760544 } from './migrations/1625615760544-AddNfeToSale'

export const migrations = [
  CreateUser1615943770893,
  CreateSessionUser1615943956225,
  CreateSale1615943985377,
  CreatePayment1615944009042,
  CreateItem1615944078899,
  CreateProduct1615944152246,
  CreateCashHandler1615944183320,
  CreateSettings1615944534764,
  CreateStore1617144243177,
  CreateStoreCashes1617145792700,
  CreateItemOutCart1617317287530,
  AddNfeFieldsToProducts1625183586246,
  AddNfeToSale1625615760544,
]
