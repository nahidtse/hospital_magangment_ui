import { getMenuAsync } from '../Sidemenudata';

/**
 * modulePath = 'doctorexperience' | 'user' | 'permission' etc
 * action = 'create' | 'edit' | 'view'
 */
export const hasButtonPermission = async (modulePath, action) => {
  const menus = await getMenuAsync();

  const findPermission = (items) => {
    for (let item of items) {
      if (item.path) {
        if (item.path.includes(`/${modulePath}/`)) {
          return item.permissions?.includes(action);
        }
      }
      if (item.children) {
        const res = findPermission(item.children);
        if (res !== undefined) return res;
      }
    }
  };

  return findPermission(menus) === true;
};

