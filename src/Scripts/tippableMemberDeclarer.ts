import { APPS_SCRIPT_URL } from "./config";
import { loadTemplate } from "./templateCloner.ts" ;

//  DECLARATIONS --------------------
interface TippableMember
{
    id: number ;
    name: string ;
    position: string ;
    isActive: boolean ;
}

// HTML SECTION ----------------------------------------------------------------------
const declarer = await loadTemplate(
    "../Templates/tippableMemberDeclarer.html",
    "tippableMemberDeclarer"
);

document
    .getElementById("declaringTippableMembersSection")!
    .appendChild(declarer);

const memberNameInputField =
    declarer.querySelector<HTMLInputElement>("#memberNameInputField")!;

const positionNameSelectInput =
    declarer.querySelector<HTMLSelectElement>("#positionNameSelectInput")!;

const sendDeclarationButton =
    declarer.querySelector<HTMLButtonElement>("#sendDeclarationButton")!;

  sendDeclarationButton!.addEventListener ( "click" , () => {
    sendMemberData ( memberNameInputField!.value , positionNameSelectInput!.value ) ;
  } ) ;






// HTML SECTION ----------------------------------------------------------------------
const gridViewClone = await loadTemplate ( "../Templates/tippableMembersGridView.html" , "tippableMembersGridView" ) ;
document.getElementById("tippableMembersGridViewSection")!.appendChild(gridViewClone);

  const fetched = await fetchTippableMembers () ;

  for ( let i = 0 ; i < fetched.length ; i++ )
  {
    const gridViewRowClone = await loadTemplate ( "../Templates/tippableMembersGridViewRow.html" ,
                                              "tippableMembersGridViewRow" ) ;
    gridViewClone.querySelector<HTMLDivElement>('#rowsContainer')!.appendChild(gridViewRowClone);

    gridViewRowClone.querySelector("#name")!.textContent = fetched[i].name;
    gridViewRowClone.querySelector("#id")!.textContent = fetched[i].id.toString();
    gridViewRowClone.querySelector("#position")!.textContent = fetched[i].position;
    gridViewRowClone.querySelector("#isActive")!.textContent =
    fetched[i].isActive ? "Habilitado" : "Deshabilitado";
  }






async function fetchTippableMembers ()
{
  const response = await fetch ( APPS_SCRIPT_URL ,
  {
      method: "POST",
      headers: { "Content-Type": "text/plain" } ,
      body: JSON.stringify ( { function: "getTippableMembers" } )
  } ) ;

  const members: TippableMember[] = await response.json() ;

  return members ;
}







// CREATE NEW MEMBER ON SPREADSHEET ----------------------------------------------------
export async function sendMemberData( newMemberName: string, newMemberPosition: string ) {
await fetch ( APPS_SCRIPT_URL ,
{
    method: "POST",
    headers: { "Content-Type": "text/plain" } ,
    body: JSON.stringify ( {
        function: "createNewTippableMember" ,
        name: newMemberName ,
        memberPositionName: newMemberPosition
} ) } ) } ;