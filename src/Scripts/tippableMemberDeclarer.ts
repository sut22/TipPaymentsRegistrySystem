//  calls to APPS SCRIPT
import { APPS_SCRIPT_URL } from "./config";
import { callApi } from "./appsScriptCall.ts" ;

//  CONTENT GENERATOR
import type { TableColumn } from "./contentGenerator.ts" ;
import { createTable , sectionsHTML } from "./contentGenerator.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;

//  DECLARATIONS --------------------
interface TippableMember
{
    id: number ;
    name: string ;
    position: string ;
    isActive: boolean ;
}

const memberColumns: TableColumn < TippableMember > [] = [
    {
        header: "ID",
        value: member => member.id.toString ()
    } ,
    {
        header: "Nombre",
        value: member => member.name
    } ,
    {
        header: "Puesto",
        value: member => member.position
    } ,
    {
        header: "¿Recibe tips?",
        value: member => member.isActive.toString ()
    }
] ;



//  ENTRY POINT
await buildMemberDeclaring () ;
await buildMembersTable () ;


async function buildMemberDeclaring ()
{
    const sectionTEMPLATE = sectionsHTML.getChildTemplate ( "declareNewTippableMemberSection" ) ;
    const sectionHTML = instantiateTemplate ( sectionTEMPLATE ) ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "tippableMembersSection" )! ;
    containerHTMLELEMENT.appendChild ( sectionHTML ) ;
    
    const textFieldHTML = sectionHTML.querySelector<HTMLInputElement>("#textField")!;
    const selectFieldHTML = sectionHTML.querySelector<HTMLInputElement>("#selectField")!;

    const sendButtonHTML = sectionHTML.querySelector<HTMLButtonElement>("#sendButton")!;

    sendButtonHTML!.addEventListener ( "click" , () =>
        { declareNewTippableMember ( textFieldHTML!.value , selectFieldHTML!.value ) ; } )
} ;


async function buildMembersTable ()
{
    const fetched = await fetchTippableMembers () ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "tippableMembersSection" )! ;
    

    createTable ( containerHTMLELEMENT , fetched , memberColumns );
} ;


async function fetchTippableMembers ()
{
  let members = await callApi<TippableMember[]>({
    function: "getTippableMembers"
  });

  return members ;
}


// CREATE NEW MEMBER ON SPREADSHEET ----------------------------------------------------
export async function declareNewTippableMember ( newMemberName: string , newMemberPosition: string ) {
await fetch ( APPS_SCRIPT_URL ,
{
    method: "POST",
    headers: { "Content-Type": "text/plain" } ,
    body: JSON.stringify ( {
        function: "createNewTippableMember" ,
        name: newMemberName ,
        memberPositionName: newMemberPosition
} ) } ) } ;