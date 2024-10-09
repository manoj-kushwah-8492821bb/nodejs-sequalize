const { sale } = require('../../models');

// @desc : fetch all sales
// @path : /api/admin/sales  == GET
const fetchSales = async (req, res) => {
    // Get query parameters for pagination, sorting, and filtering
    const { page = 1, limit = 10, sortBy = 'saleAmount', order = 'DESC', startDate, endDate } = req.query;

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Create date filter if startDate and endDate are provided
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }
    try {
        const saleList = await sale.findAndCountAll({
            where: {
                ...dateFilter // Apply date filter if provided
            },
            order: [[sortBy, order]], // Apply sorting
            limit: parseInt(limit),   // Limit results (pagination)
            offset: parseInt(offset), // Offset results (pagination)
        });
        // Send success response
        return res.status(201).json({
            message: 'all sales list!',
            sale: saleList
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc : fetch user sales
// @path : /api/user/sales  == GET
const fetchUserSales = async (req, res) => {
    const { id } = req.user

    // Get query parameters for pagination, sorting, and filtering
    const { page = 1, limit = 10, sortBy = 'saleAmount', order = 'DESC', startDate, endDate } = req.query;

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Create date filter if startDate and endDate are provided
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)]
        };
    }

    try {
        const saleList = await sale.findAndCountAll({
            where: {
                userId: id,
                ...dateFilter // Apply date filter if provided
            },
            order: [[sortBy, order]], // Apply sorting
            limit: parseInt(limit),   // Limit results (pagination)
            offset: parseInt(offset), // Offset results (pagination)
        });
        // Send success response
        return res.status(201).json({
            message: 'all user sales list!',
            totalSales: saleList.count, // Total number of sales
            currentPage: parseInt(page),
            totalPages: Math.ceil(saleList.count / limit),
            sales: saleList.rows
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = { fetchUserSales, fetchSales }