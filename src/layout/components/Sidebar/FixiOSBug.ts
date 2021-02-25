import { computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { GetterConstants } from '@/store/modules/constants'


export default function FixiOSBug($subMenu: any) {
  const store = useStore()
  const device = computed(() => store.getters[GetterConstants.GetDevice])

  const fixBugIniOS = () => {
    if ($subMenu.value) {
      const handleMouseleave = $subMenu.value.handleMouseleave
      $subMenu.value.handleMouseleave = (e: MouseEvent) => {
        if (device.value === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }
  onMounted(() => {
    fixBugIniOS()
  })
}
