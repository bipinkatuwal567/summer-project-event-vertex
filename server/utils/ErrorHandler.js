export const errorHanlder = (message, code) => {
    let error = new Error();
    error.message = message;
    error.code = code;
    return error;
}