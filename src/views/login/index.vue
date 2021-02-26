<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-top">
        <div class="login-header">
          <img alt="logo" :src="logoImages" class="login-logo" />
          <span class="login-title">Vue Antd Admin</span>
        </div>
        <div class="login-desc">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
      </div>
      <div class="login-form">
        <el-tabs v-model="loginManner" stretch @tab-click="handleClick">
          <el-tab-pane label="账号密码登录" name="normal">
            <el-form
              v-if="loginManner==='normal'"
              ref="ruleFormInstance"
              :model="ruleForm"
              status-icon
              :rules="rules"
            >
              <el-form-item prop="userName">
                <el-input
                  ref="userNameInstance"
                  v-model="ruleForm.userName"
                  prefix-icon="el-icon-user-solid"
                  type="text"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  ref="passwordInstance"
                  v-model="ruleForm.password"
                  type="password"
                  show-password
                  autocomplete="off"
                  prefix-icon="el-icon-lock"
                  @keyup.enter="handleLogin('ruleForm')"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <el-form
              v-if="loginManner==='phone'"
              ref="ruleFormInstance"
              :model="ruleForm"
              status-icon
              :rules="rules"
            >
              <el-form-item prop="phone">
                <el-input
                  v-model.number="ruleForm.phone"
                  prefix-icon="el-icon-mobile-phone"
                  type="text"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="ruleForm.code"
                  type="text"
                  autocomplete="off"
                  prefix-icon="el-icon-message"
                  style="width:68%"
                />
                <el-button style="float: right;">获取验证码</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div>
          <el-checkbox v-model="checked">自动登录</el-checkbox>
          <el-link type="primary" style="float: right;">忘记密码</el-link>
        </div>
        <div class="login-btn">
          <el-button
            type="primary"
            :loading="loginResponse"
            style="width: 100%; margin-top: 21px;"
            @click="handleLogin('ruleForm')"
          >登录</el-button>
        </div>
        <div>
          <span class="login-text">其他登录方式</span>
          <svg-icon class="login-icon" :icon-class="svgIcons['alipay']" />
          <svg-icon class="login-icon" :icon-class="svgIcons['wechat']" />
          <svg-icon class="login-icon" :icon-class="svgIcons['qq']" />
          <el-link type="primary" style="float: right;">注册账户</el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, _RouteLocationBase } from 'vue-router'
import { ElForm, ElInput } from 'element-plus'
import svgIcons from '@/icons/svg-icons'
const { alipay, wechat, qq } = svgIcons
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoImages = require('@/assets/login/login_logo.png')

export default defineComponent({
  name: 'Login',
  emits: ['keyup'],
  setup() {
    const ruleFormInstance = ref<InstanceType<typeof ElForm>>(null)
    const userNameInstance = ref<InstanceType<typeof ElInput>>(null)
    const passwordInstance = ref<InstanceType<typeof ElInput>>(null)
    const ruleForm = reactive({ userName: '', password: '', phone: '', code: '' })
    const rules = reactive({
      userName: [
        { required: true, message: '请输入账号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { type: 'number', message: '号码必须为数字值' }
      ]
    })
    const svgIcons = reactive({ alipay, wechat, qq })
    const loginManner = ref<string>('normal')
    const loginResponse = ref<boolean>(false)
    const checked = ref<boolean>(true)
    const redirect = ref< string |string[]>(undefined)
    const otherQuery = ref<object>({})

    const route = useRoute()
    // const router = useRouter()
    // const store = useStore()

    const getOtherQuery = (query: Record<string, string|string[]>) => {
      return Object.keys(query).reduce((acc: Record<string, string|string[]>, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }

    const handleLogin = () => {
      ruleFormInstance.value.validate((valid) => {
        if (valid) {
          loginResponse.value = true
          // store.dispatch('user/login', ruleForm)
          //   .then(() => {
          //     router.push({ path: redirect.value || '/', query: otherQuery.value } as Record<string, string|string[]>)
          //     loginResponse.value = false
          //   })
          //   .catch(() => {
          //     loginResponse.value = false
          //   })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    onMounted(() => {
      if (ruleForm.userName === '') {
        userNameInstance.value.focus()
      } else if (ruleForm.password === '') {
        passwordInstance.value.focus()
      }
    })

    const handleClick = () => {
      nextTick(() => {
        ruleFormInstance.value.resetFields()
      })
    }



    watch(() => (route as any).path, (v: _RouteLocationBase) => {
      const query = v.query
      if (query) {
        redirect.value = query.redirect
        otherQuery.value = getOtherQuery(query)
      }
    }, { deep: true })


    return {
      ruleForm,
      handleLogin,
      ruleFormInstance,
      userNameInstance,
      passwordInstance,
      handleClick,
      loginManner,
      loginResponse,
      checked,
      logoImages,
      rules,
      svgIcons
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/styles/element-variables.scss";
$bg: #f0f2f5;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background-color: $bg;
  background-image: url("/img/login/login_bg.svg");
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;

  .login-content {
    padding: 32px 0;
    flex: 1;
    .login-top {
      text-align: center;
      .login-header {
        height: 44px;
        line-height: 44px;
        .login-logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .login-title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: Myriad Pro, Helvetica Neue, Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .login-desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .login-form {
      width: 368px;
      margin: 0 auto;
      .login-btn {
        margin-bottom: 24px;
      }
    }
  }

  .login-text {
    font-size: 14px;
  }

  .login-icon {
    margin-left: 16px;
    vertical-align: middle;
    font-size: 24px;
    color: rgba(0,0,0,.45);
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      color: $--color-primary !important;
    }
  }

  @media (min-width: 768px) {
    .login-content {
      padding: 112px 0 24px;
    }
  }
}
</style>
