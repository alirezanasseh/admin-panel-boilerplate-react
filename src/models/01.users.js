// Simple model structure

export default props => {
    return {
        base: {
            entities: "Users",                          // Title of the page
            entity: "User",                             // Title of Add button
            module: "users",                            // Name of API
            path: "/users",                             // Path of the page in admin panel
            model: {
                name: {title: "Name"},
                family: {title: "Family"},
                username: {title: "Username"},
                email: {title: "Email"},
                address: {title: "Address"},
                phone: {title: "Phone"},
                website: {title: "Website"},
            }                                           // Fields of the model
        },
        list: {
            page: props.page,                           // Current page in the list page
            fields: [
                {name: "name"},
                {name: "family"},
                {name: "username"},
                {name: "email"},
                {name: "phone"},
                {name: "website"},
            ],                                          // Fields to show in the list page
            operations: ["add", "edit", "remove"]       // Operations in the list page
        },
        item: {
            id: props.id,                               // Id of the item in edit page
            fields: [
                {name: "name"},
                {name: "family"},
                {name: "username"},
                {name: "email"},
                {name: "phone"},
                {name: "website"},
            ]                                           // Fields to show in add or edit page
        }
    };
}