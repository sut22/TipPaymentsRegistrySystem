export function setString ( key: string , value: string ) : void
{
    localStorage.setItem ( key , value ) ;
}

export function getString ( key: string , defaultValue: string = "" ) : string
{
    const value = localStorage.getItem ( key ) ;

    return value === null ? defaultValue : value ;
}