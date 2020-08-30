const view = async (model, ui, server, events) =>  {
    //Set nav active state
    model.$homeNav.active.class = () => model.location.name === "index" || model.location.name === "";
    model.$aboutNav.active.class = () => model.location.name === "about";
    events.navigate = (navigationData) =>{
        model.location.name = navigationData.name;
    };
};

const containerId = "viewContainer";

export { view, containerId };