import { APPS_SCRIPT_URL } from "./config.ts";
import { loadTemplate } from "./templateCloner.ts" ;

//  DECLARATIONS --------------------
interface WaiterDefinition
{
    id: number ;
    name: string ;
    type: string ;
    isActive: boolean ;
}

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






async function fetchWaiters ()
{
  const response = await fetch ( APPS_SCRIPT_URL ,
  {
      method: "POST",
      headers: { "Content-Type": "text/plain" } ,
      body: JSON.stringify ( { function: "getWaiters" } )
  } ) ;

  const members: WaiterDefinition[] = await response.json() ;

  return members ;
}







// CREATE NEW MEMBER ON SPREADSHEET ----------------------------------------------------
export async function sendMemberData( newName: string, newType: string ) {
await fetch ( APPS_SCRIPT_URL ,
{
    method: "POST",
    headers: { "Content-Type": "text/plain" } ,
    body: JSON.stringify ( {
        function: "createNewWaiter" ,
        name: newName ,
        type: newType
} ) } ) } ;