//  calls to APPS SCRIPT
import { APPS_SCRIPT_URL } from "./config";
import { callApi } from "./appsScriptCall.ts" ;

//  CONTENT GENERATOR
import type { TableColumn } from "./contentGenerator.ts" ;
import { createTable , sectionsHTML } from "./contentGenerator.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;

//  DECLARATIONS --------------------
interface WaiterDefinition
{
    id: number ;
    name: string ;
    type: string ;
    isActive: boolean ;
}

const memberColumns: TableColumn < WaiterDefinition > [] = [
    {
        header: "ID",
        value: member => member.id.toString ()
    } ,
    {
        header: "Nombre",
        value: member => member.name
    } ,
    {
        header: "Modo",
        value: member => member.type
    } ,
    {
        header: "¿Está vigente?",
        value: member => member.isActive.toString ()
    }
] ;



//  ENTRY POINT
await buildWaiterDeclaring () ;
await buildWaitersTable () ;


async function buildWaiterDeclaring ()
{
    const sectionTEMPLATE = sectionsHTML.getChildTemplate ( "declareNewWaiterSection" ) ;
    const sectionHTML = instantiateTemplate ( sectionTEMPLATE ) ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "waitersDefinitionSection" )! ;
    containerHTMLELEMENT.appendChild ( sectionHTML ) ;
    
    const textFieldHTML = sectionHTML.querySelector<HTMLInputElement>("#textField")!;
    const selectFieldHTML = sectionHTML.querySelector<HTMLInputElement>("#selectField")!;

    const sendButtonHTML = sectionHTML.querySelector<HTMLButtonElement>("#sendButton")!;

    sendButtonHTML!.addEventListener ( "click" , () =>
        { declareNewWaiter ( textFieldHTML!.value , selectFieldHTML!.value ) ; } )
} ;


async function buildWaitersTable ()
{
    const fetched = await fetchWaiters () ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "waitersDefinitionSection" )! ;
    

    createTable ( containerHTMLELEMENT , fetched , memberColumns );
} ;


async function fetchWaiters ()
{
  let waiters = await callApi<WaiterDefinition[]>({
    function: "getWaiters"
  });

  return waiters ;
}

// CREATE NEW MEMBER ON SPREADSHEET ----------------------------------------------------
export async function declareNewWaiter ( newName: string, newType: string ) {
await fetch ( APPS_SCRIPT_URL ,
{
    method: "POST",
    headers: { "Content-Type": "text/plain" } ,
    body: JSON.stringify ( {
        function: "createNewWaiter" ,
        name: newName ,
        type: newType
} ) } ) } ;



/*
import { APPS_SCRIPT_URL } from "./config.ts";
import { loadTemplate } from "./templateHandler.ts" ;
import { callApi } from "./appsScriptCall.ts" ;

//  DECLARATIONS --------------------


// HTML SECTION ----------------------------------------------------------------------
const declarer = await loadTemplate(`${import.meta.env.BASE_URL}Templates/WaiterDefinition/waiterDeclarer.html`,
    "waiterDeclarer"
);

document
    .getElementById("declaringWaitersSection")!
    .appendChild(declarer);

const waiterNameInputField =
    declarer.querySelector<HTMLInputElement>("#waiterNameInputField")!;

const typeNameInputField =
    declarer.querySelector<HTMLSelectElement>("#typeNameInputField")!;

const sendDeclarationButton =
    declarer.querySelector<HTMLButtonElement>("#sendDeclarationButton")!;

  sendDeclarationButton!.addEventListener ( "click" , () => {
    sendMemberData ( waiterNameInputField!.value , typeNameInputField!.value ) ;
  } ) ;






// HTML SECTION ----------------------------------------------------------------------
const gridViewClone = await loadTemplate ( `${import.meta.env.BASE_URL}Templates/WaiterDefinition/waiterGridView.html` , "waiterGridView" ) ;
document.getElementById("waiterDefinitionsGridViewSection")!.appendChild(gridViewClone);

  const fetched = await fetchWaiters () ;

  for ( let i = 0 ; i < fetched.length ; i++ )
  {
    const gridViewRowClone = await loadTemplate ( `${import.meta.env.BASE_URL}Templates/tippableMembersGridViewRow.html` ,
                                              "tippableMembersGridViewRow" ) ;
    gridViewClone.querySelector<HTMLDivElement>('#rowsContainer')!.appendChild(gridViewRowClone);

    gridViewRowClone.querySelector("#name")!.textContent = fetched[i].name;
    gridViewRowClone.querySelector("#id")!.textContent = fetched[i].id.toString();
    gridViewRowClone.querySelector("#position")!.textContent = fetched[i].type;
    gridViewRowClone.querySelector("#isActive")!.textContent =
    fetched[i].isActive ? "Habilitado" : "Deshabilitado";
  }







     */