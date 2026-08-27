import { setString , getString } from "./localStorageHelper" ;
import { callApi } from "./appsScriptCall.ts" ;


let authorizationData : AuthorizationData =
{
    isAuthorized: false ,
    authorizedUserName : "" ,
    authorizedUserID : -1 ,
}

//  DECLARATIONS --------------------
interface AuthorizationData
{
    isAuthorized: boolean ;
    authorizedUserName: string ;
    authorizedUserID: number ;
}

/*
await function authorize () : boolean
{
    authorizationData = await callApi<AuthorizationData[]>({
                            function: "checkAuthorization"});
}
                            */