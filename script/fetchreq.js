export const fetchRequest = async (url, { method = 'get', callback, body, headers}) => {
    try {
        const options = {
            method,
        }
        if(body){
            options.body = JSON.stringify(body);
        }
        if(headers){
            options.headers = headers;
        }
        if(callback){
            options.callback = callback;
        }
        const response = await fetch(url, options);
       

        if(response.ok){
            const data = await response.json();
            if(callback) return callback(null, data);
            return;
        }
        
        throw new Error(response.status);
    } catch (error) {
        if(callback){
           return  callback(error);
        }
    }
};

