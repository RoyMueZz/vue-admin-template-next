import Cookies from 'js-cookie'
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

type Sidebar = {
  opened: boolean;
  withoutAnimation: boolean;
}

export type State = {
  sidebar: Sidebar;
  device: string;
};

const state: State = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? Cookies.get('sidebarStatus') === 'on' : true,
    withoutAnimation: false
  },
  device: 'desktop',
}

type Getters = {
  [GetterConstants.GetDevice](state: State): string;
  [GetterConstants.GetSidebar](state: State): Sidebar;
};

const getters: GetterTree<State, RootState> & Getters = {
  [GetterConstants.GetDevice]: state => state.device,
  [GetterConstants.GetSidebar]: state => state.sidebar
}

interface Mutations {
  [MutationConstants.toggleDevice](state: State, device: string): void;
  [MutationConstants.toggleSidebar](state: State): void;
  [MutationConstants.closeSidebar](state: State, withoutAnimation: boolean): void;
}


const mutations: MutationTree<State> & Mutations = {
  [MutationConstants.toggleDevice](state: State, device: string) {
    state.device = device
  },
  [MutationConstants.toggleSidebar](state: State) {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 'on')
    } else {
      Cookies.set('sidebarStatus', 'off')
    }
  },
  [MutationConstants.closeSidebar](state: State, withoutAnimation: boolean) {
    Cookies.set('sidebarStatus', 'off')
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  }
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

interface Actions {
  [ActionConstants.HandleToggleDevicet]({ commit }: AugmentedActionContext, device: string): void;
  [ActionConstants.HandleToggleSidebar]({ commit }: AugmentedActionContext): void;
  [ActionConstants.HandleCloseSidebar]({ commit }: AugmentedActionContext, withoutAnimation: { withoutAnimation: boolean }): void;
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionConstants.HandleToggleDevicet]({ commit }, device: string) {
    commit(MutationConstants.toggleDevice, device)
  },
  [ActionConstants.HandleToggleSidebar]({ commit }) {
    commit(MutationConstants.toggleSidebar)
  },
  [ActionConstants.HandleCloseSidebar]({ commit }, { withoutAnimation }) {
    commit(MutationConstants.closeSidebar, withoutAnimation)
  }
}

export type AppStore<S = State> = Omit<
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

export const AppModule: Module<State, RootState> = {
  state,
  getters,
  mutations,
  actions,
}

