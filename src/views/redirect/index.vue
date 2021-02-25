<script lang='ts'>
import { defineComponent, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Redirect',
  setup() {
    const { params, query } = useRoute()
    const router = useRouter()
    const { path } = params
    router.replace({ path: '/' + path, query })
    return {}
  },
  render() {
    return h('div')
  }
})
</script>


