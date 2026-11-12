//  calls to APPS SCRIPT
import { callApi } from "./appsScriptCall.ts" ;
import { createTable } from "./contentGenerator.ts" ;
import type { TableColumn , TableInstance } from "./contentGenerator.ts" ;
import { showRegisterPaymentModal } from "./modalManager.ts" ;
import { userData } from "./authorizationGuard.ts" ;

const dataColumns: TableColumn < WaiterPaymentState > [] = [
    {
        header : "Nombre" ,
        value : member => member.waiterName ,
        sticky : true ,
        onClick: item =>
        {
            showRegisterPaymentModal(
                userData.username,
                userData.userID.toString(),
                item.waiterName,
                item.waiterId.toString(),
                item.totalDebt,

                async (paymentAmount) =>
                {
                    const rowIndex =
                        waitersDebtTable.data.findIndex(
                            waiter => waiter.waiterId === item.waiterId
                        );

                    if (rowIndex !== -1)
                    {
                        showPaymentDoneOnTable(
                            rowIndex,
                            paymentAmount
                        );
                    }
                }
            );
        },
        cellTextSize : "14px" ,
        headerCellWidth : "500px" ,
        cellHeight : "60px"
    } ,
    {
        header: ["Deuda", "total"] ,
        value: member => member.totalDebt.toString () ,
        headerTextSize : "12px" ,
        cellTextSize : "22px" ,
        emphasized : true ,
    } ,
    {
        header: ["Días", "pendientes"] ,
        value: member => member.currentAmountOfDaysPending.toString () ,
        headerTextSize : "12px" ,
        greyedOut : true ,
        cellTextSize : "18px" ,
    } ,
    {
        header: ["Pagado por", "adelantado"] ,
        value: member => member.paidInAdvance.toString () ,
        headerTextSize : "12px" ,
        headerCellWidth : "90px" ,
        greyedOut : true ,
        cellTextSize : "18px" ,
    }
] ;

interface Payment {
  dayNumber : number ;
  dayOfTheWeek : string ;
  month: string ;
  amount: number ;
}

interface WaiterPaymentState {
  waiterId : number ;
  waiterName : string ;
  waiterType : 'FULL-TIME' | 'PART-TIME' ;
  isActive: boolean ;
  currentAmountOfDaysPending : number;
  paidInAdvance : number ;
  payments: Payment[] ;
  totalDebt: number ;
}


let waitersDebtTable : TableInstance < WaiterPaymentState > ;

await buildMembersTable () ;



async function buildMembersTable ()
{
    const fetched = await fetchWaiterPaymentsRegistryState () ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "paymentsRegistry" )! ;
    
    const paymentColumns = createPaymentColumns(fetched);

    const columns = [
        ...dataColumns,
        ...paymentColumns
    ];

    waitersDebtTable = createTable ( containerHTMLELEMENT , fetched , columns ) ;
} ;

function createPaymentColumns ( members: WaiterPaymentState[] ) : TableColumn < WaiterPaymentState > []
{
    const maxPayments = Math.max ( ...members.map ( member => member.payments.length ) ) ;

    const columns: TableColumn<WaiterPaymentState>[] = [];

    for (let i = 0; i < maxPayments ; i++ )
    {
      const dayOfTheWeek = members[0].payments[i].dayOfTheWeek ;
      const dayNumber = members[0].payments[i].dayNumber ;
      const month = members[0].payments[i].month ;
      

        columns.push(
            {
                header: [`${dayOfTheWeek}`, `${dayNumber} ${month}`],

                value: member =>
                    member.payments[i]?.amount ? member.payments[i].amount.toString() : "" ,

                headerCellWidth : "100px" ,
                headerTextSize : "13px" ,
                cellTextSize : "18px"
            },
        );
    }

    return columns;
}


async function fetchWaiterPaymentsRegistryState ()
{
  let members = await callApi < WaiterPaymentState [] > ( {
    function: "getWaiterPaymentsRegistryState" } ) ;

  return members ;
}





function showPaymentDoneOnTable (
    row: number ,
    amount: number ,
)
{
    let paidMoneyLeft = amount ;

    for ( let i = waitersDebtTable.rows [ row ].cells.length - 1 ; i >= 4 ; i-- )
    {
        let moneyOnCurrentCell = Number ( waitersDebtTable.rows [ row ].cells [ i ].textContent ) ;

        if ( paidMoneyLeft <= 0 ) break ; //  if we ran out of paid money to spread on the debt cells
        if ( moneyOnCurrentCell <= 0 ) continue ; // if the cell still has money as debt

        const amountToSubtract = Math.min ( moneyOnCurrentCell , paidMoneyLeft ) ;

        moneyOnCurrentCell -= amountToSubtract; // current cell
        paidMoneyLeft -= amountToSubtract; // overall amount left

        waitersDebtTable.rows [ row ].cells [ i ].textContent = moneyOnCurrentCell.toString () ;

        const totalDebtCell = waitersDebtTable.rows [ row ].cells [ 1 ] ;
        totalDebtCell.textContent = ( Number ( totalDebtCell.textContent ) - amountToSubtract ).toString () ;

        //  if the cell was completely paid
        if ( moneyOnCurrentCell <= 0 )
        {
            const thisCell = waitersDebtTable.rows [ row ].cells [ i ] ;
            thisCell.textContent = "" ;
            thisCell.classList.add ( "payment-day-completed" ) ;

            const pendingRowsCell = waitersDebtTable.rows [ row ].cells [ 2 ] ;
            pendingRowsCell.textContent = ( Number ( pendingRowsCell.textContent ) - 1 ).toString () ;
        }
    }

    if ( paidMoneyLeft > 0 ) // if there's still money and no debt, SEND TO PaidInAdvance
    {
        const paidInAdvanceCell = waitersDebtTable.rows [ row ].cells [ 3 ] ;
        paidInAdvanceCell.textContent = ( Number ( paidInAdvanceCell.textContent ) + paidMoneyLeft ).toString () ;
    }
}