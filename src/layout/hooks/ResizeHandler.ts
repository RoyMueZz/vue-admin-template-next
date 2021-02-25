import { watch, computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { GetterConstants, ActionConstants } from '@/store/modules/constants'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default function ResizeHandler() {
  const route = useRoute()
  const store = useStore()
  const sidebar = computed(() => store.getters[GetterConstants.GetSidebar])
  const device = computed(() => store.getters[GetterConstants.GetDevice])

  watch(() => route.path, () => {
    if (device.value === 'mobile' && sidebar.value.opened) {
      store.dispatch(ActionConstants.HandleCloseSidebar, { withoutAnimation: false })
    }
  })

  function _isMobile() {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  function resizeHandler() {
    if (!document.hidden) {
      const isMobile = _isMobile()
      store.dispatch(ActionConstants.HandleToggleDevicet, isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        store.dispatch(ActionConstants.HandleCloseSidebar, { withoutAnimation: true })
      }
    }
  }

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onMounted(() => {
    const isMobile = _isMobile()
    if (isMobile) {
      store.dispatch(ActionConstants.HandleToggleDevicet, 'mobile')
      store.dispatch(ActionConstants.HandleCloseSidebar, { withoutAnimation: true })
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
