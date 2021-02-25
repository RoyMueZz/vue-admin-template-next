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
import { _RouteLocationBase } from 'vue-router'
import {
  GetterConstants,
  MutationConstants,
  ActionConstants,
} from '../constants'



export type State = {
  visitedViews: _RouteLocationBase[];
  cachedViews: string[];
};

const state: State = {
  visitedViews: [],
  cachedViews: []
}

type Getters = {
  [GetterConstants.GetVisitedViews](state: State): _RouteLocationBase[];
  [GetterConstants.GetCachedViews](state: State): string[];
};

const getters: GetterTree<State, RootState> & Getters = {
  [GetterConstants.GetVisitedViews]: state => state.visitedViews,
  [GetterConstants.GetCachedViews]: state => state.cachedViews
}

interface Mutations {
  [MutationConstants.addVisitedView](state: State, view: _RouteLocationBase): void;
  [MutationConstants.addCachedView](state: State, view: _RouteLocationBase): void;
  [MutationConstants.delVisitedView](state: State, view: _RouteLocationBase): void;
  [MutationConstants.delCachedView](state: State, view: _RouteLocationBase): void;
  [MutationConstants.delOthersVisitedViews](state: State, view: _RouteLocationBase): void;
  [MutationConstants.delOthersCachedViews](state: State, view: _RouteLocationBase): void;
  [MutationConstants.delAllVisitedViews](state: State): void;
  [MutationConstants.delAllCachedViews](state: State): void;
  [MutationConstants.updateCachedView](state: State, view: _RouteLocationBase): void;
}


const mutations: MutationTree<State> & Mutations = {
  [MutationConstants.addVisitedView](state: State, view: _RouteLocationBase) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  [MutationConstants.addCachedView](state: State, view: _RouteLocationBase) {
    if (state.cachedViews.includes(view.name as string)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name as string)
    }
  },
  [MutationConstants.delVisitedView](state: State, view: _RouteLocationBase) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  [MutationConstants.delCachedView](state: State, view: _RouteLocationBase) {
    const index = state.cachedViews.indexOf(view.name as string)
    index > -1 && state.cachedViews.splice(index, 1)
  },
  [MutationConstants.delOthersVisitedViews](state: State, view: _RouteLocationBase) {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  [MutationConstants.delOthersCachedViews](state: State, view: _RouteLocationBase) {
    const index = state.cachedViews.indexOf(view.name as string)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  [MutationConstants.delAllVisitedViews](state: State) {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  [MutationConstants.delAllCachedViews](state: State) {
    state.cachedViews = []
  },
  [MutationConstants.updateCachedView](state: State, view: _RouteLocationBase) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  },
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

interface Actions {
  [ActionConstants.HandleAddView]({ dispatch }: AugmentedActionContext, view: _RouteLocationBase): void;
  [ActionConstants.HandleAddVisitedView]({ commit }: AugmentedActionContext, view: _RouteLocationBase): void;
  [ActionConstants.HandleAddCachedView]({ commit }: AugmentedActionContext, view: _RouteLocationBase): void;
  [ActionConstants.HandleDelView]({ dispatch, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<State>;
  [ActionConstants.HandleDelVisitedView]({ commit, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<_RouteLocationBase[]>;
  [ActionConstants.HandleDelCachedView]({ commit, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<string[]>;
  [ActionConstants.HandleDelOthersViews]({ dispatch, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<State>;
  [ActionConstants.HandleDelOthersVisitedViews]({ commit, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<_RouteLocationBase[]>;
  [ActionConstants.HandleDelOthersCachedViews]({ commit, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<string[]>;
  [ActionConstants.HandleDelAllViews]({ commit, state }: AugmentedActionContext, view: _RouteLocationBase): Promise<State>;
  [ActionConstants.HandleDelAllVisitedViews]({ commit, state }: AugmentedActionContext): Promise<_RouteLocationBase[]>;
  [ActionConstants.HandleDelAllCachedViews]({ commit, state }: AugmentedActionContext): Promise<string[]>;
  [ActionConstants.HandleUpdateVisitedView]({ commit }: AugmentedActionContext, view: _RouteLocationBase): void;
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionConstants.HandleAddView]({ dispatch }, view: _RouteLocationBase) {
    dispatch(ActionConstants.HandleAddVisitedView, view)
    dispatch(ActionConstants.HandleAddCachedView, view)
  },
  [ActionConstants.HandleAddVisitedView]({ commit }, view: _RouteLocationBase) {
    commit(MutationConstants.addVisitedView, view)
  },
  [ActionConstants.HandleAddCachedView]({ commit }, view: _RouteLocationBase) {
    commit(MutationConstants.addCachedView, view)
  },
  [ActionConstants.HandleDelView]({ dispatch, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      dispatch(ActionConstants.HandleDelVisitedView, view)
      dispatch(ActionConstants.HandleDelCachedView, view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  [ActionConstants.HandleDelVisitedView]({ commit, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      commit(MutationConstants.delVisitedView, view)
      resolve([...state.visitedViews])
    })
  },
  [ActionConstants.HandleDelCachedView]({ commit, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      commit(MutationConstants.delCachedView, view)
      resolve([...state.cachedViews])
    })
  },
  [ActionConstants.HandleDelOthersViews]({ dispatch, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      dispatch(ActionConstants.HandleDelOthersVisitedViews, view)
      dispatch(ActionConstants.HandleDelOthersCachedViews, view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  [ActionConstants.HandleDelOthersVisitedViews]({ commit, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      commit(MutationConstants.delOthersVisitedViews, view)
      resolve([...state.visitedViews])
    })
  },
  [ActionConstants.HandleDelOthersCachedViews]({ commit, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      commit(MutationConstants.delOthersCachedViews, view)
      resolve([...state.cachedViews])
    })
  },
  [ActionConstants.HandleDelAllViews]({ dispatch, state }, view: _RouteLocationBase) {
    return new Promise(resolve => {
      dispatch(ActionConstants.HandleDelAllVisitedViews, view)
      dispatch(ActionConstants.HandleDelAllCachedViews, view)
      resolve({
        visitedViews: [...state.visitedViews],
        cachedViews: [...state.cachedViews]
      })
    })
  },
  [ActionConstants.HandleDelAllVisitedViews]({ commit, state }) {
    return new Promise(resolve => {
      commit(MutationConstants.delAllVisitedViews)
      resolve([...state.visitedViews])
    })
  },
  [ActionConstants.HandleDelAllCachedViews]({ commit, state }) {
    return new Promise(resolve => {
      commit(MutationConstants.delAllCachedViews)
      resolve([...state.cachedViews])
    })
  },
  [ActionConstants.HandleUpdateVisitedView]({ commit }, view: _RouteLocationBase) {
    commit(MutationConstants.updateCachedView, view)
  },
}

export type TagsViewStore<S = State> = Omit<
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

export const TagsViewModule: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
}

