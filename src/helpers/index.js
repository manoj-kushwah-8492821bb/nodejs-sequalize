// success handler
const successHandler = (res, data) => {
    const StatusCode = res?.statusCode ? res?.statusCode : 500;
    res.json({
        error: false,
        success: true,
        statusCode: `Ex${StatusCode}`,
        ...data,
    });
};

// error handler
const errorHandler = (res, data) => {
    const StatusCode = res?.statusCode ? res?.statusCode : 500;
    res.json({
        error: true,
        success: false,
        statusCode: `Ex${StatusCode}`,
        ...data,
    });
};

module.exports = { successHandler, errorHandler };
