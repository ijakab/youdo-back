module.exports = function (code) {
    let error = new Error(code)
    error.message = code
    error.status = 400
    throw error
}