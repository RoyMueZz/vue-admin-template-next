import { asyncRoutes, constantRoutes } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import {
  ActionContext,
  ActionTree,
  CommitOptions,
  DispatchOptions,
  GetterTree,
  Module,
  MutationTree,
  Store as VuexStore,
} from 'vuex'
import { State as RootState } from '@/store'
import {
  GetterConstants,
  MutationConstants,
  ActionConstants,
} from '../constants'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(role => (route.meta.roles as string[]).includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}



export type State = {
  routes: RouteRecordRaw[];
  addRoutes: RouteRecordRaw[];
};

const state: State = {
  routes: [],
  addRoutes: []
}

type Getters = {
  [GetterConstants.GetPermissionRoutes](state: State): RouteRecordRaw[];
 };

const getters: GetterTree<State, RootState> & Getters = {
  [GetterConstants.GetPermissionRoutes]: state => state.routes
}

interface Mutations {
  [MutationConstants.setRoutes](state: State, routes: RouteRecordRaw[]): void;
}


const mutations: MutationTree<State> & Mutations = {
  [MutationConstants.setRoutes](state: State, routes: RouteRecordRaw[]) {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

interface Actions {
  [ActionConstants.HandleGenerateRoutes]({ commit }: AugmentedActionContext, roles: string[]): Promise<RouteRecordRaw[]>;
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionConstants.HandleGenerateRoutes]({ commit }, roles: string[]) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit(MutationConstants.setRoutes, accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export type PermissionStore<S = State> = Omit<
  VuexStore<S>,
  'getters' | 'commit' | 'dispatch'
> & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions, P extends Parameters<Actions[K]>[1]>(
    key: K,
    payload?: P,
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>;
};

export const PermissionModule: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
}

