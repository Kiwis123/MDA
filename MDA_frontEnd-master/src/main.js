/*eslint-disable*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import jsPlumb from 'jsplumb'
// 将jsPlumb注册到原型
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb;

Vue.prototype.axios = axios;
Vue.use(VueCodemirror);

Vue.config.productionTip = false;

import {
  Button,
  Layout,
  Icon,
  Menu,
  Divider,
  Col,
  Row,
  Card,
  Checkbox,
  Table,
  Tag,
  Input,
  Dropdown,
  Modal,
  Form,
  Notification,
  Message,
  Select
} from "ant-design-vue";

Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Button);
Vue.use(Layout);
Vue.use(Icon);
Vue.use(Layout);
Vue.use(Divider);
Vue.use(Card);
Vue.use(Checkbox);
Vue.use(Table);
Vue.use(Tag);
Vue.use(Input);
Vue.use(Dropdown);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Select);
Vue.use(ElementUI);

Vue.prototype.$notification = Notification;
// Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$message = Message;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
