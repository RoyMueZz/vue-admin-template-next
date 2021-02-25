// https://github.com/IamManchanda/vue3-vuex4-ts/tree/master/src/store
import { createStore } from 'vuex'
import { State as AppState, AppStore, AppModule } from './modules/app'
import { State as PermissionState, PermissionStore, PermissionModule } from './modules/permission'
import { State as TagsViewState, TagsViewStore, TagsViewModule } from './modules/tagsView'


export type State = {
  app: AppState;
  permission: PermissionState;
  tagsView: TagsViewState;
}

export type Store = AppStore<Pick<State, 'app'>> & PermissionStore<Pick<State, 'permission'>> & TagsViewStore<Pick<State, 'tagsView'>>;

export const store = createStore({
  modules: {
    app: AppModule,
    permission: PermissionModule,
    tagsView: TagsViewModule,
  }
})

export function useStore(): Store {
  return store as Store
}

export default store

