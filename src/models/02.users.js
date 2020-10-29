// fields types

export default props => {
    return {
        base: {
            entities: "Users",
            entity: "User",
            module: "users",
            path: "/users",
            model: {
                pic: {title: "Picture", type: "image", width: "300", height: "400"},
                name: {title: "Name"},
                family: {title: "Family"},
                username: {title: "Username"},
                password: {title: "Password", type: "password"},
                email: {title: "Email"},
                address: {title: "Address"},
                phone: {title: "Phone"},
                website: {title: "Website"},
                gender: {
                    title: "Gender",
                    type: "select",
                    items: [
                        {key: true, value: "Male"},
                        {key: false, value: "Female"},
                    ]
                },
                birthday: {title: "Birthday", type: "date"},
                bio: {title: "Bio"}
            }
        },
        list: {
            page: props.page,
            fields: [
                {name: "pic"},
                {name: "name"},
                {name: "family"},
                {name: "gender"},
                {name: "username"},
                {name: "email"},
                {name: "phone"},
                {name: "website"},
                {name: "birthday"},
                {name: "bio", max_length: 20},
            ],
            operations: ["add", "edit", "remove"]
        },
        item: {
            id: props.id,
            fields: [
                {name: "pic"},
                {name: "name"},
                {name: "family"},
                {name: "gender"},
                {name: "username"},
                {name: "password"},
                {name: "email"},
                {name: "phone"},
                {name: "website"},
                {name: "birthday"},
                {name: "bio", type: "textarea"},
            ]
        }
    };
}