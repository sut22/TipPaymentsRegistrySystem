//  calls to APPS SCRIPT
import { callApi } from "./appsScriptCall.ts" ;

//  CONTENT GENERATOR
import type { TableColumn } from "./contentGenerator.ts" ;
import { createTable } from "./contentGenerator.ts" ;

import { showRegisterPaymentModal } from "./modalManager.ts" ;

const dataColumns: TableColumn < WaiterPaymentState > [] = [
    {
        header : "Nombre" ,
        value : member => member.waiterName ,
        sticky : true ,
        onClick : item => { showRegisterPaymentModal ( item.waiterName ) ; }
    } ,
    {
        header: ["Días", "pendientes"] ,
        value: member => member.currentAmountOfDaysPending.toString () ,
        headerTextSize : "12px" ,
        greyedOut : true 
    } ,
    {
        header: ["Pagado por", "adelantado"] ,
        value: member => member.paidInAdvance.toString () ,
        headerTextSize : "12px" ,
        headerCellWidth : "90px" ,
        greyedOut : true 
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
}

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

    createTable(
        containerHTMLELEMENT,
        fetched,
        columns
    );
} ;

function createPaymentColumns(
    members: WaiterPaymentState[]
): TableColumn<WaiterPaymentState>[]
{
    const maxPayments = Math.max(
        ...members.map(member => member.payments.length)
    );

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
                headerTextSize : "13px"
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