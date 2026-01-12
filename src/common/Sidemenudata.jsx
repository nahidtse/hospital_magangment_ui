import { DynamicMenuBuilder } from '../common/utils/DynamicMenuBuilder';
const baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * ===========================================
 * 1️⃣ STATIC PARTS
 * ===========================================
 * Always visible menu items. Display even if user is not logged in or API fails.
 */
const STATIC_PARTS = [
    { 
        menutitle: "MAIN" 
    },
    { 
        path: `${import.meta.env.BASE_URL}dashboard`, 
        title: "Dashboard", 
        icon: 'fe-home', 
        type: "link", 
        active: false, 
        selected: false, 
        dirchange: false 
    },
    { 
        menutitle: "GENERAL" 
    }
];

/**
 * ===========================================
 * 2️⃣ GLOBAL STATE VARIABLES
 * ===========================================
 */
let cachedMenu = null;           // Stores the final merged menu
let isInitialized = false;       // Tracks if menu has been loaded at least once
let initializationPromise = null; // Prevents duplicate API calls

/**
 * ===========================================
 * 3️⃣ AUTHENTICATION CHECK
 * ===========================================
 */
const checkAuth = () => {
    const token = localStorage.getItem('auth_token');
    const expiry = localStorage.getItem('auth_token_expiry');

    if (!token) {
        console.warn('No auth token found');
        return false;
    }

    if (expiry && Date.now() > Number(expiry)) {
        console.warn('Auth token expired');
        localStorage.clear();
        window.location.href = "/login";
        return false;
    }

    return true;
};

/**
 * ===========================================
 * 4️⃣ LOAD MENU FROM API
 * ===========================================
 * Main function to load menu asynchronously.
 */
export const loadMenu = async (forceRefresh = false) => {
    // 4.1 Authentication check
    if (!checkAuth()) {
        cachedMenu = STATIC_PARTS;
        return cachedMenu;
    }

    // 4.2 Return cached menu if already initialized and not forcing refresh
    if (cachedMenu && !forceRefresh && isInitialized) {
        return cachedMenu;
    }

    // 4.3 Prevent multiple simultaneous API calls
    if (initializationPromise && !forceRefresh) {
        return await initializationPromise;
    }

    // 4.4 API call to fetch menu
    initializationPromise = (async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const role_id = localStorage.getItem('role_id')

            const response = await fetch(`${baseURL}/menu`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                signal: AbortSignal.timeout(10000) // 10s timeout
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // 4.5 Success: build dynamic menu
            if (result.status === "success") {
                const dynamicItems = DynamicMenuBuilder.build(result.data);
                cachedMenu = [...STATIC_PARTS, ...dynamicItems];
                isInitialized = true;

                // Update MENUITEMS (legacy support)
                MENUITEMS = cachedMenu;

                // 4.6 Dispatch event so Sidebar can re-render
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('menuUpdated', {
                        detail: { menu: cachedMenu }
                    }));
                }

                console.log('✅ Menu loaded successfully. Total items:', cachedMenu.length);

            } else {
                console.warn('API returned non-success status:', result.message);
                cachedMenu = STATIC_PARTS;
            }

        } catch (error) {
            console.error('Menu load error:', error);

            // Use static menu as fallback
            if (!cachedMenu) {
                cachedMenu = STATIC_PARTS;
            }

        } finally {
            initializationPromise = null;
        }

        return cachedMenu;
    })();

    return await initializationPromise;
};

/**
 * ===========================================
 * 5️⃣ SYNCHRONOUS MENU GETTER
 * ===========================================
 * Returns currently cached menu or STATIC_PARTS if not yet loaded.
 */
export const getMenu = () => {
    return cachedMenu || STATIC_PARTS;
};

/**
 * ===========================================
 * 6️⃣ MENU INITIALIZATION STATUS
 * ===========================================
 * Returns true if menu has finished loading at least once.
 */
export const isMenuLoaded = () => {
    return isInitialized;
};

/**
 * ===========================================
 * 7️⃣ ASYNC MENU GETTER
 * ===========================================
 * Ensures menu is loaded before returning.
 */
export const getMenuAsync = async () => {
    if (!isInitialized) {
        await loadMenu();
    }
    return getMenu();
};

/**
 * ===========================================
 * 8️⃣ FORCE MENU REFRESH
 * ===========================================
 * Useful when roles/permissions are updated.
 */
export const refreshMenu = async () => {
    return await loadMenu(true);
};

/**
 * ===========================================
 * 9️⃣ INITIALIZE MENU ON IMPORT
 * ===========================================
 * Automatically load menu in the background without blocking app.
 */
loadMenu().catch(error => {
    console.error('Failed to initialize menu on load:', error);
});

/**
 * ===========================================
 * 🔟 EXPORT MENUITEMS
 * ===========================================
 * Legacy / backward compatibility.
 * Initially contains STATIC_PARTS, updates after load.
 */
export let MENUITEMS = getMenu();

// Update MENUITEMS when menu loads and dispatch update event
loadMenu().then(menu => {
    MENUITEMS = menu;
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('menuUpdated'));
    }
});

// Default export for backward compatibility
export default getMenu;



































/**
 * ======================================================
 * MENU MANAGER LOGIC FLOW (for future reference)
 * ======================================================
 *
 * 1️⃣ STATIC_PARTS
 * ------------------------------------------------------
 * - এগুলো always visible menu
 * - Login থাকুক বা না থাকুক show হবে
 * - API fail হলেও dashboard + titles থাকবে
 *
 *
 * 2️⃣ GLOBAL STATE VARIABLES
 * ------------------------------------------------------
 * cachedMenu:
 * - Backend থেকে আসা final merged menu এখানে রাখা হয়
 * - Sidebar / Header সবাই এই data use করে
 *
 * isInitialized:
 * - Menu একবার load হয়েছে কিনা track করে
 * - true হলে আর API call হয় না
 *
 * initializationPromise:
 * - একই সময়ে multiple component menu চাইলে
 *   একবারই API call হয়
 * - বাকি call গুলো এই promise await করে
 *
 *
 * 3️⃣ checkAuth()
 * ------------------------------------------------------
 * - LocalStorage এ token আছে কিনা check করে
 * - Token expire হলে:
 *   - localStorage clear করে
 *   - user কে login page এ redirect করে
 * - Valid হলে true return করে
 *
 *
 * 4️⃣ loadMenu(forceRefresh = false)
 * ------------------------------------------------------
 * - পুরো menu system এর core function
 *
 * Step 4.1: Authentication check
 * - User logged out হলে শুধু STATIC_PARTS return
 *
 * Step 4.2: Cache hit check
 * - Menu আগে load হয়ে থাকলে
 * - forceRefresh না হলে API call skip
 *
 * Step 4.3: Duplicate API call prevent
 * - Menu load চলাকালীন আবার call আসলে
 * - আগের promise return করে
 *
 * Step 4.4: Backend API call
 * - /api/menu endpoint hit করে
 * - Token header হিসেবে পাঠানো হয়
 *
 * Step 4.5: Success response handling
 * - Backend data → DynamicMenuBuilder.build()
 * - Static + Dynamic menu merge
 * - cachedMenu & MENUITEMS update
 * - isInitialized = true
 *
 * Step 4.6: UI update trigger
 * - 'menuUpdated' custom event dispatch
 * - Sidebar / Header automatically re-render হয়
 *
 * Step 4.7: Error handling
 * - API fail হলেও app crash করে না
 * - At least STATIC_PARTS show হয়
 *
 *
 * 5️⃣ getMenu()
 * ------------------------------------------------------
 * - Synchronous menu getter
 * - Sidebar render করার সময় instant data দেয়
 * - cachedMenu না থাকলে STATIC_PARTS দেয়
 *
 *
 * 6️⃣ isMenuLoaded()
 * ------------------------------------------------------
 * - Menu fully initialized হয়েছে কিনা জানায়
 * - Loader / Skeleton control করার কাজে লাগে
 *
 *
 * 7️⃣ getMenuAsync()
 * ------------------------------------------------------
 * - Guaranteed menu getter (async)
 * - Menu load না থাকলে আগে load করে
 * - তারপর menu return করে
 *
 *
 * 8️⃣ refreshMenu()
 * ------------------------------------------------------
 * - Forcefully menu reload করে
 * - Role / Permission change হলে ব্যবহার হবে
 *
 *
 * 9️⃣ Auto Initialization on App Load
 * ------------------------------------------------------
 * - File import হলেই background এ menu load শুরু হয়
 * - App start এ menu ready রাখে
 *
 *
 * 🔟 MENUITEMS export
 * ------------------------------------------------------
 * - Legacy code support এর জন্য
 * - Initially static menu দেয়
 * - Load শেষ হলে dynamic menu তে update হয়
 *
 *
 * 1️⃣1️⃣ menuUpdated Event
 * ------------------------------------------------------
 * - MENUITEMS update হওয়ার পর event dispatch হয়
 * - Sidebar/Header এই event শুনে re-render করে
 *
 *
 * 🔮 FUTURE READY FEATURES
 * ------------------------------------------------------
 * ✔ Role based menu filtering
 * ✔ Permission based route guard
 * ✔ Dynamic routing support
 * ✔ No Redux required
 *
 * ======================================================
 */
