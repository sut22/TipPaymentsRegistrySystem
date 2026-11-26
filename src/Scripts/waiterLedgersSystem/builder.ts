import { userData } from "../authorizationGuard.ts";
import { createTable, type TableColumn , type TableInstance } from "../contentGenerator.ts" ;
import { showRegisterPaymentModal } from "../modalManager.ts";
import { fetchWaiterPaymentsRegistryState } from "./apiCalls.ts";
import { TableActionMode, type WaiterPaymentState } from "./models.ts"
import { currentActionMode } from "./waiterLedgersSystem.ts";
import { DayTipClickedHandler } from "./dayTipClickedHandler.ts";

export const dayTopClickedHandler = new DayTipClickedHandler();

export let waitersDebtTable : TableInstance < WaiterPaymentState > ;

export const dataColumns: TableColumn < WaiterPaymentState > [] = [
    { // NOMBRE
        header : "Nombre" ,
        value : member => member.waiterName ,
        sticky : true ,
        onClick: item => { payDebtActionCall ( item ) } , // ACTION
        headerTextSize: "13px",
        cellTextSize : "13px" ,
        headerCellWidth : "500px" ,
        cellHeight : "60px"
    } ,
    { // DEUDA TOTAL
        header: ["Deuda", "total"] ,
        value: member => member.totalDebt.toString () ,
        headerTextSize : "13px" ,
        cellTextSize : "15px" ,
        emphasized : true ,
    } ,
    { // DIAS SIN PAGO
        header: ["Días", "sin pago"] ,
        value: member => member.currentAmountOfDaysPending.toString () ,
        headerTextSize : "11.5px" ,
        greyedOut : true ,
        cellTextSize : "16px" ,
    } ,
    { // ADELANTO DE PAGO
        header: ["Adelanto", "de pago"] ,
        value: member => member.paidInAdvance.toString () ,
        headerTextSize : "11.5px" ,
        headerCellWidth : "90px" ,
        greyedOut : true ,
        cellTextSize : "16px" ,
    }
] ;



//  ENTRY POINT ---------------
export async function buildMembersTable ()
{
    const fetched = await fetchWaiterPaymentsRegistryState () ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "tipsTableContainer" )! ;
    
    const paymentColumns = createPaymentColumns(fetched);

    const columns = [
        ...dataColumns,
        ...paymentColumns
    ];

    waitersDebtTable = createTable ( containerHTMLELEMENT , fetched , columns ) ;
} ;


//  DYNAMIC
function createPaymentColumns ( members: WaiterPaymentState[] ) : TableColumn < WaiterPaymentState > []
{
    const maxPayments = Math.max ( ...members.map ( member => member.payments.length ) ) ;

    const columns: TableColumn<WaiterPaymentState>[] = [];

    for (let i = 0; i < maxPayments ; i++ )
    {
      const dayOfTheWeek = members[0].payments[i].dayOfTheWeek ;
      const dayNumber = members[0].payments[i].dayNumber ;
      const month = members[0].payments[i].month ;
      

        columns.push (
        {
            header: [`${dayOfTheWeek}`, `${dayNumber} ${month}`],

            value: member =>
                member.payments[i]?.amount
                    ? member.payments[i].amount.toString()
                : "",

            onClick: (member, cell) =>
            {
                const payment = member.payments[i];

                switch (currentActionMode)
                {
                    case TableActionMode.ConfirmPayment:
                    {
                        dayTopClickedHandler.toggleCell(
                            payment.dayNumber,
                            payment.monthNumber,
                            member.waiterId,
                            cell!
                        );

                        break;
                    }

                    /*
                    case TableActionMode.PayDebt:
                    {
                        console.log("Pay debt for:", member.waiterName);
                        break;
                    }
                    */
                }
            },

            headerCellWidth: "100px",
            headerTextSize: "13px",
            cellTextSize: "18px"
        } ) ;
    }

    return columns;
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



//  called by clicking on the name of a Waiter
export function payDebtActionCall ( item : WaiterPaymentState )
{
    if ( currentActionMode == TableActionMode.PayDebt )
    showRegisterPaymentModal ( userData.username ,
                                userData.userID.toString () ,
                                item.waiterName ,
                                item.waiterId.toString () ,
                                item.totalDebt ,
                                async ( paymentAmount ) => getCallbackFromModal ( item , paymentAmount ) )
}

function getCallbackFromModal ( item :WaiterPaymentState , paymentAmount : number ) 
{
    const rowIndex = waitersDebtTable.data.findIndex
        ( waiter => waiter.waiterId === item.waiterId ) ;

    if ( rowIndex !== -1 ) showPaymentDoneOnTable ( rowIndex , paymentAmount ) ;
}