const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`[${timestamp}] ${method} ${url} - ${ip}`);

    // Log request body (except password)
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) {
            sanitizedBody.password = '***';
        }
        console.log('Request Body:', sanitizedBody);
    }

    // Log response
    const originalSend = res.send;
    res.send = function(data) {
        console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
        originalSend.call(this, data);
    };

    next();
};

module.exports = logger;

