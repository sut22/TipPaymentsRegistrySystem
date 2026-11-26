

export interface Payment {
  dayNumber : number ;
  dayOfTheWeek : string ;
  month: string ;
  amount: number ;
  monthNumber: number ;
}

export interface WaiterPaymentState {
  waiterId : number ;
  waiterName : string ;
  waiterType : 'FULL-TIME' | 'PART-TIME' ;
  isActive: boolean ;
  currentAmountOfDaysPending : number;
  paidInAdvance : number ;
  payments: Payment[] ;
  totalDebt: number ;
}

export interface TipDayChange
{
    waiterId: number ;
    dayNumber: number ;
    monthNumber: number ;
    amount: number ;
}

export const TableActionMode = {
  ConfirmPayment: "CONFIRM_PAYMENT" ,
  ModifyAmount: "MODIFY_AMOUNT" ,
  MarkDayOff: "MARK_DAY_OFF" ,
  PayDebt: "PAY_DEBT" ,
} as const ;
export type TableActionMode = ( typeof TableActionMode ) [ keyof typeof TableActionMode ] ;