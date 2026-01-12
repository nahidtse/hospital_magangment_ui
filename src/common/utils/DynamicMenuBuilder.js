export class DynamicMenuBuilder {

    static build(rolePermissionData) {
        if (!Array.isArray(rolePermissionData)) {
            console.error('Invalid role permission data');
            return [];
        }

        const allMenus = new Map();

        // 1. All menu Permission store Rolebase
        rolePermissionData.forEach(item => {
            if (item.menu) {
                const menu = item.menu;
                const grantedPerms = item.permissions || []; // User Permission 

                // Menu Store
                if (!allMenus.has(menu.id)) {
                    allMenus.set(menu.id, {
                        ...menu,
                        grantedPermissions: grantedPerms,
                        children: []
                    });
                }

                // If parent_menu in data then store (For Security)
                if (menu.parent_menu && !allMenus.has(menu.parent_menu.id)) {
                    allMenus.set(menu.parent_menu.id, {
                        ...menu.parent_menu,
                        grantedPermissions: [], // Parent Genarel Container
                        children: []
                    });
                }
            }
        });

        const menuArray = Array.from(allMenus.values());
        
        // ২. Hierarchy (Parent-Child) Create
        menuArray.forEach(menu => {
            if (menu.parent_menu_id && allMenus.has(menu.parent_menu_id)) {
                const parent = allMenus.get(menu.parent_menu_id);
                // Check Duplicate Child
                if (!parent.children.find(c => c.id === menu.id)) {
                    parent.children.push(menu);
                }
            }
        });

        // ৩. Find Root Menu (is_top_menu === 1 and No Parent)
        const topLevelMenus = menuArray.filter(menu => 
            menu.is_top_menu === 1 && (!menu.parent_menu_id || !allMenus.has(menu.parent_menu_id))
        );

        // ৪. Frontend Structure Create (with Setting)
        return this.buildNestedStructure(topLevelMenus);
    }

    static buildNestedStructure(menus) {
        // Sorting Logic: 1.1.10 
        const sortedMenus = [...menus].sort((a, b) => this.compareSortOrder(a.sort_order, b.sort_order));

        return sortedMenus.map(menu => {
            const hasChildren = menu.children && menu.children.length > 0;
            
            const frontendItem = {
                title: menu.menu_name,
                icon: this.getIcon(menu),
                type: hasChildren ? 'sub' : 'link',
                menusub: hasChildren,
                permissions: menu.grantedPermissions || [],
                module_id: menu.module_id,
                sort_order: menu.sort_order || '999',
                active: false,
                selected: false,
                dirchange: false
            };

            if (!hasChildren) {
                frontendItem.path = this.generatePath(menu);
            } else {
                frontendItem.children = this.buildNestedStructure(menu.children);
            }

            return frontendItem;
        });
    }

    // Numerical sorting logic (e.g., 1.1.2 comes before 1.1.10)
    static compareSortOrder(orderA, orderB) {
        const partsA = String(orderA || '999').split('.').map(Number);
        const partsB = String(orderB || '999').split('.').map(Number);

        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const a = partsA[i] || 0;
            const b = partsB[i] || 0;
            if (a !== b) return a - b;
        }
        return 0;
    }

    static getIcon(menu) {

        if (menu.is_top_menu !== 1) return '';

        const iconMap = {
            'Admin': 'fe-lock',
            'Dashboard': 'fe-home',
            'Appointment': 'fe-calendar',
            // 'Business Unit': 'fe-briefcase',
            // 'Assign Business Unit': 'fe-share-2',
            // 'User Create': 'fe-user-plus',
            // 'Menu Creation': 'fe-list',
            // 'Module': 'fe-grid',
            // 'Menu Permission': 'fe-shield',
            // 'Create Menu': 'fe-plus-square'
        };
        return iconMap[menu.menu_name] || 'fe-file';
    }

    static generatePath(menu) {
        const pathMapping = {
            'Business Unit': 'businessunit',
            'Assign Business Unit': 'assignbu',
            'User Create': 'user',
            'Dashboard': 'dashboard',
            'Create Menu': 'menu',
        };

        const basePath = pathMapping[menu.menu_name] || 
            menu.menu_name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        return `${import.meta.env.BASE_URL}${basePath}/dataTable`;
    }
}