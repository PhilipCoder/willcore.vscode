const view = async (model, ui, server) => {
    //Get contact details from the server
    model.contactDetails = await server.details.contact.get();
    //Bind email list
    model.$emailLink.repeat = () => model.contactDetails.emails;
    model.$emailLink.repeat = (elements, rowIndex) => {
        elements.$emailLink.bind = () => model.contactDetails.emails[rowIndex];
        elements.$emailLink.href.attribute =  () => "mailto:" + model.contactDetails.emails[rowIndex];
    };
    //Bind phone numbers
    model.$phoneItem.repeat = () => model.contactDetails.phone;
    model.$phoneItem.repeat = (elements, rowIndex) => {
        elements.$phoneItem.bind = () => model.contactDetails.phone[rowIndex];
    };
};

const layout = "/layouts/nav_layout";

export { view, layout };