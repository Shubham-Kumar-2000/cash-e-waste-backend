module.exports = {
    AUTH_TOKEN_EXPIRY_HOURS: 168, // 7 days

    USER_PERMISSIONS: {
        Admin: 'Admin',
        Partner: 'Partner'
    },

    USER_STATUS: {
        BLOCKED: '-1',
        PENDING: '0',
        ACTIVE: '1',
        DELETED: '-2'
    },

    USER_ORDER_STATUS: {
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED'
    },

    COMPANY_ORDER_STATUS: {
        PENDING: 'PENDING',
        PAID: 'PAID'
    }
};
