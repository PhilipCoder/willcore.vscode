/**
 * Service to service the data for the "about" page.
 */
const service = async (service, server, willcore) => {
    /**
     * Action to get contact information
     */
    service.info.action.get = async (model) => {
        model.message = "WillCore demo service.";
    };
};

module.exports = service;