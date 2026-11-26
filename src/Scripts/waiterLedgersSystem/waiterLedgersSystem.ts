import { buildMembersTable, dayTopClickedHandler } from "./builder";
import { TableActionMode } from "./models" ;
import "./builders/tableActionsRadioButtons" ;
import { userData } from "../authorizationGuard";
import { initActionButtonsPanel } from "./builders/tableActionsRadioButtons";



//  STATE VARIABLES modifed by /builders/tableActionsRadioButtons
export let currentActionMode : TableActionMode = TableActionMode.ConfirmPayment ;
export function setCurrentActionMode ( newMode: TableActionMode ) { currentActionMode = newMode ; }

const wao = document.querySelector ( "#saveChanges" ) as HTMLButtonElement ;
wao.onclick = function () {
    dayTopClickedHandler.sendChanges () ; console.log ( "fired") ; }

if ( userData.userID != -1 )
{ 
    initActionButtonsPanel () ;
    await buildMembersTable () ;
}