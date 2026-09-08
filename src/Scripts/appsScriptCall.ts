import { APPS_SCRIPT_URL } from "./config" ;

/*
let queue = Promise.resolve () ;

export function callApi < T > ( body: unknown ) : Promise < T >
{
    queue = queue.then ( async () =>
        {
            const response = await fetch ( APPS_SCRIPT_URL , {
                method: "POST" ,
                headers: { "Content-Type": "text/plain" } ,
                body: JSON.stringify ( body )
        });

        if ( !response.ok ) { throw new Error(`HTTP ${response.status}`);}

        return response.json () ;
    });

    return queue as Promise < T > ;
}
*/

let queue: Promise<unknown> = Promise.resolve();

export function callApi<T>(body: unknown): Promise<T>
{
    queue = queue.then(async () =>
    {
        console.log("SENDING:", body);

        const response = await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(body)
        });

        console.log("STATUS:", response.status);
        console.log("OK:", response.ok);
        console.log("CONTENT TYPE:", response.headers.get("content-type"));

        const text = await response.text();

        console.log("RAW RESPONSE:", text);

        return JSON.parse(text) as T;
    });

    return queue as Promise<T>;
}