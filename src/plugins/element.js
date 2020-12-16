import ElementPlus from 'element-plus'
import '../theme/index.css'
import '../element-variables.scss'
export default (app) => {
  app.use(ElementPlus, { zIndex: 3000 })
}
