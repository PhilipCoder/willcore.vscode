/**
 * Service to service the data for the "about" page.
 */
const service = async (service, server, willcore) => {
    /**
     * Action to get contact information
     */
    service.contact.action.get = async (model) => {
        model.emails = [
            "not@an.email",
            "not@another.email",
            "not@a.mail"
        ];
        model.phone = [
            "0123456789",
            "9876543210",
            "5432109876"
        ];
    };
};

module.exports = service;