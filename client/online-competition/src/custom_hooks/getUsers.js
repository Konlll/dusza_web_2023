/**
 *  fetches data from api
 *  @param {string} url
 *  @param {string} method 
 *  @param {string} authorization 
 *  @param {Object} body_args 
 *  
*/

export function FetchData(url, method, authorization, body_args) 
{
    
    const options = 
        {
            method : `${method}`,
            headers : 
            {
                "Content-Type" : "application/json",
                authorization : `Bearer ${authorization}`
            },
            body : JSON.stringify(body_args)
        };
    if(method == "GET") 
    {
        options.body = undefined;
    }
    return fetch(url, options)
        .then(res => {return res.json()})
        .catch(err => console.error("error fetching data", err.message));
}
