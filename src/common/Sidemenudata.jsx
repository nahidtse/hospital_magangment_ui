
export const MENUITEMS = [

    {
        menutitle: "MAIN",
    },

    { path: `${import.meta.env.BASE_URL}dashboard`, title: "Dashboard", icon: 'fe-home', type: "link", active: false, selected: false, dirchange: false },
    {
        menutitle: "GENERAL",
    },

    ///Test 

    // {
    //     title: "Business Unit", icon: 'fe-users', path: `${import.meta.env.BASE_URL}businessunit/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
    //         { path: `${import.meta.env.BASE_URL}businessunit/createform`, type: 'link', active: false, selected: false, dirchange: false }
    //     ]
    // },



    /** Admin Module
     *      1. Business Unit
     *      2. Module
     *      3. Role
     *      4. User
     *      5. Permission
     *      6. Assign Business Unit
     * 
     */

    {
        title: "Admin Module", icon: 'fe-lock', type: "sub", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
            {
                path: `${import.meta.env.BASE_URL}businessunit/dataTable`, title: "Business Unit", type: "link", menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}businessunit/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Module", path: `${import.meta.env.BASE_URL}module/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}module/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Role", path: `${import.meta.env.BASE_URL}role/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}role/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "User", path: `${import.meta.env.BASE_URL}user/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}role/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Permission", path: `${import.meta.env.BASE_URL}permission/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}permission/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Assign Business Unit", path: `${import.meta.env.BASE_URL}assignbu/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}assignbu/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Menu Create", path: `${import.meta.env.BASE_URL}menuCreate`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}assignbu/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Hospital Management", type: "sub", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [

                    {
                        title: "Doctor's Lookup Type", path: `${import.meta.env.BASE_URL}lookuptype/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                            { path: `${import.meta.env.BASE_URL}lookuptype/createform`, type: 'link', active: false, selected: false, dirchange: false }
                        ]
                    },
                    {
                        title: "Doctor's Lookup Value", path: `${import.meta.env.BASE_URL}lookupvalue/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                            { path: `${import.meta.env.BASE_URL}lookupvalue/createform`, type: 'link', active: false, selected: false, dirchange: false }
                        ]
                    },

                ]
            },

        ]
    },
    {
        title: "Hospital Management",  type: "sub", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [

            {
                title: "Doctor's Lookup Type", path: `${import.meta.env.BASE_URL}lookuptype/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}lookuptype/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Doctor's Lookup Value", path: `${import.meta.env.BASE_URL}lookupvalue/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}lookupvalue/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Doctor's Informations", path: `${import.meta.env.BASE_URL}doctorsinfo/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}doctorsinfo/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Doctor's Card", path: `${import.meta.env.BASE_URL}doctorscard/cardPage`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    // { path: `${import.meta.env.BASE_URL}doctorsinfo/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Chamber Schedule", path: `${import.meta.env.BASE_URL}chamberschedule/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}chamberschedule/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Doctor's Experience", path: `${import.meta.env.BASE_URL}doctorexperience/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}doctorexperience/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Leave Info", path: `${import.meta.env.BASE_URL}leaveinfo/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}leaveinfo/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Appointment", path: `${import.meta.env.BASE_URL}appointment/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}appointment/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Invoice (Diagonestic)", path: `${import.meta.env.BASE_URL}invoicediagonestic/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}invoicediagonestic/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Bank Info", path: `${import.meta.env.BASE_URL}bankinfo/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}bankinfo/createform`, type: 'link', active: false, selected: false, dirchange: false },
                    { path: `${import.meta.env.BASE_URL}bankinfo/singledata`, type: 'link', active: false, selected: false, dirchange: false },
                    { path: `${import.meta.env.BASE_URL}bankinfo/edit`, type: 'link', active: false, selected: false, dirchange: false },
                ]
            },
            {
                title: "Bank Account Info", path: `${import.meta.env.BASE_URL}bankaccount/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}bankaccount/createform`, type: 'link', active: false, selected: false, dirchange: false }
                ]
            },
            {
                title: "Money Receipt", path: `${import.meta.env.BASE_URL}moneyreceipt/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}moneyreceipt/createform`, type: 'link', active: false, selected: false, dirchange: false },
                ]
            },
            {
                title: "Pending Invoice List", path: `${import.meta.env.BASE_URL}pendinginvoice/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}pendinginvoice/singledata`, type: 'link', active: false, selected: false, dirchange: false },
                ]
            },
            {
                title: "Test Info", path: `${import.meta.env.BASE_URL}testinfo/dataTable`, type: "link", badgetxt: '', menusub: true, active: false, selected: false, dirchange: false, children: [
                    { path: `${import.meta.env.BASE_URL}testinfo/createform`, type: 'link', active: false, selected: false, dirchange: false },
                    { path: `${import.meta.env.BASE_URL}testinfo/singledata`, type: 'link', active: false, selected: false, dirchange: false },
                    { path: `${import.meta.env.BASE_URL}testinfo/edit`, type: 'link', active: false, selected: false, dirchange: false },
                ]
            },

        ]
    },





];