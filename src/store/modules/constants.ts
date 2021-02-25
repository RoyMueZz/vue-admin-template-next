export enum GetterConstants {
  GetDevice = 'APP/GET_DEVICE',
  GetSidebar = 'APP/GET_SIDEBAR',
  GetPermissionRoutes = 'PERMISSION/GET_PERMISSION_ROUTES',
  GetVisitedViews = 'TAGSVIEW/GET_VISITED_VIEWS',
  GetCachedViews = 'TAGSVIEW/GET_CACHED_VIEWS',
}

export enum MutationConstants {
  toggleDevice = 'APP/TOGGLE_DEVICE',
  toggleSidebar = 'APP/TOGGLE_SIDEBAR',
  closeSidebar = 'APP/CLOSE_SIDEBAR',
  setRoutes = 'PERMISSION/SET_ROUTES',
  addVisitedView = 'TAGSVIEW/ADD_VISITED_VIEW',
  delVisitedView = 'TAGSVIEW/DEL_VISITED_VIEW',
  delOthersVisitedViews = 'TAGSVIEW/DEL_OTHERS_VISITED_VIEWS',
  delAllVisitedViews = 'TAGSVIEW/DEL_ALL_VISITED_VIEWS',
  updateCachedView = 'TAGSVIEW/UPDATE_VISITED_VIEW',
  addCachedView = 'TAGSVIEW/ADD_CACHED_VIEW',
  delCachedView = 'TAGSVIEW/DEL_CACHED_VIEW',
  delOthersCachedViews = 'TAGSVIEW/DEL_OTHERS_CACHED_VIEWS',
  delAllCachedViews = 'TAGSVIEW/DEL_ALL_CACHED_VIEWS',
}

export enum ActionConstants {
  HandleToggleDevicet = 'APP/HANDLE_TOGGLE_DEVICE',
  HandleToggleSidebar = 'APP/HANDLE_TOGGLE_SIDEBAR',
  HandleCloseSidebar = 'APP/HANDLE_CLOSE_SIDEBAR',
  HandleGenerateRoutes = 'PERMISSION/HANDLE_GENERATE_ROUTES',
  HandleAddView = 'TAGSVIEW/HANDLE_ADD_VIEW',
  HandleAddVisitedView = 'TAGSVIEW/HANDLE_ADD_VISITED_VIEW',
  HandleAddCachedView = 'TAGSVIEW/HANDLE_ADD_CACHED_VIEW',
  HandleDelView = 'TAGSVIEW/HANDLE_DEL_VIEW',
  HandleDelVisitedView = 'TAGSVIEW/HANDLE_DEL_VISITED_VIEW',
  HandleDelCachedView = 'TAGSVIEW/HANDLE_DEL_CACHED_VIEW',
  HandleDelOthersViews = 'TAGSVIEW/HANDLE_DEL_OTHERS_VIEWS',
  HandleDelOthersVisitedViews = 'TAGSVIEW/HANDLE_DEL_OTHERS_VISITED_VIEWS',
  HandleDelOthersCachedViews = 'TAGSVIEW/HANDLE_DEL_OTHERS_CACHED_VIEWS',
  HandleDelAllViews = 'TAGSVIEW/HANDLE_DEL_ALL_VIEWS',
  HandleDelAllVisitedViews = 'TAGSVIEW/HANDLE_DEL_ALL_VISITED_VIEWS',
  HandleDelAllCachedViews = 'TAGSVIEW/HANDLE_DEL_ALL_CACHED_VIEWS',
  HandleUpdateVisitedView = 'TAGSVIEW/HANDLE_UPDATE_VISITED_VIEW'
}
