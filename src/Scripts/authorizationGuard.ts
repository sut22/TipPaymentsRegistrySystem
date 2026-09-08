import Modal from "bootstrap/js/dist/modal";
import { setString , getString } from "./localStorageHelper" ;
import { callApi } from "./appsScriptCall.ts" ;
import { sectionsHTML } from "./contentGenerator.ts" ;
import { instantiateTemplate } from "./templateHandler.ts" ;


//  DECLARATIONS --------------------
interface UserData
{
    persistentKey: string ;
    sessionToken: string ;
    username: string ;
    userID: number ;
}

//  properties
let loginMODAL : Modal ;
export let userData : UserData = {} as UserData ;

retrieveSavedData () ;
buildLoginScreen () ;
async function buildLoginScreen ()
{
    const loginButton : HTMLElement = document.getElementById ( "loginButton" )! ;
    const loginButtonTEXT = loginButton.querySelector ( "#buttonText" )! ;
    loginButtonTEXT.textContent = userData.username ;

    const loginModalTEMPLATE = sectionsHTML.getChildTemplate ( "loginModal" ) ;
    const loginModalHTML = instantiateTemplate ( loginModalTEMPLATE ) ;
    const containerHTMLELEMENT : HTMLElement = document.getElementById ( "modals" )! ;
    containerHTMLELEMENT.appendChild ( loginModalHTML ) ;

    loginMODAL = new Modal ( loginModalHTML )! ;
    loginButton.addEventListener("click", openLoginModal ) ;

    const masterKeyHTMLINPUT : HTMLInputElement = loginModalHTML.querySelector ( "#masterKeyInput")! ;

    const sendHTMLBUTTON : HTMLButtonElement = loginModalHTML.querySelector ( "#sendButton")! ;
    sendHTMLBUTTON.addEventListener ( "click", () => validateMasterKey ( masterKeyHTMLINPUT.value ) ) ;

}

function openLoginModal ()
{
    loginMODAL.show () ;
}

function retrieveSavedData ()
{
    userData.persistentKey = getString ( "persistentKey" , "" ) ;
    userData.sessionToken = getString ( "sessionToken" , "" ) ;
    userData.username = getString ( "username" , "Usuario Invitado" ) ;
    userData.userID = Number ( getString ( "userID" , "-1" ) ) ;

}

async function validateMasterKey ( masterKey : string )
{
    const response = await fetchMasterKeyValidation ( masterKey ) ;

    setString ( "persistentKey" , response.persistentKey ) ;
    setString ( "sessionToken" , response.sessionToken ) ;
    setString ( "username" , response.username ) ;
    setString ( "userID" , response.userID ) ;

    console.log ( `key get from html: ${ masterKey }` ) ;
    console.log ( `response persistentKey: ${ response.persistentKey }` ) ;
    console.log ( `response sessionToken: ${ response.sessionToken }` ) ;
    console.log ( `response username: ${ response.username }` ) ;
    console.log ( `response userID: ${ response.userID }` ) ;

    window.location.reload();
}




async function fetchMasterKeyValidation(masterKey: string)
{
    console.log("Calling API...");

    const output = await callApi<any>({
        function: "validateMasterKey",
        masterKey: masterKey
    });

    console.log("API OUTPUT:", output);

    return output;
}
                            