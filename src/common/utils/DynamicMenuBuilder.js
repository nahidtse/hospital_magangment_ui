export class DynamicMenuBuilder {
    static build(backendData) {
        try {
            if (!Array.isArray(backendData) || backendData.length === 0) return [];

            // 1. Only Top Lavel (Root) Menus Filter
            const rootMenus = backendData.filter(item => 
                item.is_top_menu === 1 && item.parent_menu_id === null
            ).sort(this.sortByOrder);

            // ২. Root Menu To Child MEnu Create 
            return rootMenus.map(root => this.buildMenuNode(root, backendData));
        } catch (error) {
            console.error('Menu building failed:', error);
            return [];
        }
    }

    static buildMenuNode(currentMenu, allMenus) {
        // Find Child Menu
        const directChildren = allMenus
            .filter(item => item.parent_menu_id === currentMenu.id)
            .sort(this.sortByOrder);

        const hasChildren = directChildren.length > 0 || currentMenu.is_parent === 1;

        // Object Create for Frontend
        const frontendItem = {
            title: currentMenu.menu_name,
            icon: this.getIcon(currentMenu),
            type: hasChildren ? "sub" : "link",
            menusub: hasChildren,
            module_id: currentMenu.module_id,
            // Other Property..
            dirchange: false,
            active: false,
            selected: false,
        };

        if (!hasChildren) {
            frontendItem.path = this.generatePath(currentMenu);
        } else {
            // if child stile then call again (Recursion)
            frontendItem.children = directChildren.map(child => 
                this.buildMenuNode(child, allMenus)
            );
        }

        return frontendItem;
    }

    static sortByOrder(a, b) {
        // If sort_order not find then '999' set and show last
        const orderA = String(a.sort_order || '999');
        const orderB = String(b.sort_order || '999');

        // Creaet Array use (.)dot(Exp: "1.1.10" -> ["1", "1", "10"])
        const partsA = orderA.split('.').map(Number);
        const partsB = orderB.split('.').map(Number);

        // All item check
        for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
            const numA = partsA[i] || 0; // if not part. catch 0
            const numB = partsB[i] || 0;

            if (numA !== numB) {
                return numA - numB; // small to big (1-100)
            }
        }
        return 0;
    }

    static getIcon(menu) {
        if (menu.is_top_menu !== 1) return '';
        const iconMap = {
            'Admin': 'fe-lock',
            'Appointment': 'fe-calendar',
            'Dashboard': 'fe-home',
        };
        return iconMap[menu.menu_name] || 'fe-file';
    }

    // Generate path from menu_name
    static generatePath(item) {
        const pathMapping = {
            'Business Unit': 'businessunit',
            'Assign Business Unit': 'assignbu',
            'User Create': 'user',
            'Module': 'module',
            'Menu Permission': 'permission',
            'Create Menu': 'menu',
            'Appointment': 'appointment',
            "Doctor's Information": 'doctorsinfo',
            "Doctor's Experience": 'doctor-exp',
            'User': 'user',
            'Role': 'role',
            'Permission': 'permission',
            'Dashboard': 'dashboard'
        };

        const basePath = pathMapping[item.menu_name]
            || item.menu_name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '').replace(/[^a-z0-9-]/g, '');

        return `${import.meta.env.BASE_URL}${basePath}/dataTable`;
    }
}