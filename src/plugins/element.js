import ElementPlus from 'element-plus'
import '../theme/index.css'
import '../element-variables.scss'
export default (app) => {
  app.use(ElementPlus, { size: 'small', zIndex: 3000 })
}
