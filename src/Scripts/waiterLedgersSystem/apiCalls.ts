import { callApi } from "../appsScriptCall.ts" ;
import type { WaiterPaymentState } from "./models.ts" ;


//  obtiene el estado actual de la tabla de pagos y lo
//  devuelve en WaiterPaymentState
export async function fetchWaiterPaymentsRegistryState ()
{
  let members = await callApi < WaiterPaymentState [] > ( {
    function: "getWaiterPaymentsRegistryState" } ) ;

  return members ;
}

/*
async function registerSpecificDayAmountChanges (
    changes: TipDayChange []
)
{
    return await callApi ( {
        action: "registerSpecificDayAmountChanges",
        changes: changes
    } ) ;
}
*/