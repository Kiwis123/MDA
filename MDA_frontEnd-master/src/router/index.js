import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/op",
    name: "operation",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Operation.vue"),
    redirect: "/dev",
    children: [
      {
        path: "/dev",
        name: "dev",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/dev/index.vue"),
        redirect: "/dev/list",
        meta: {
          menu: "dev"
        },
        children: [
          {
            path: "/dev/list",
            name: "projectList",
            component: () =>
              import(
                /* webpackChunkName: "about" */ "../views/dev/ProjectList.vue"
              ),
            meta: {
              menu: "dev"
            }
          },
          {
            path: "/dev/ide",
            name: "ide",
            component: () =>
              import(
                /* webpackChunkName: "about" */ "../views/dev/Ide.vue"
              ),
            meta: {
              menu: "dev"
            }
          }
        ]
      },
      {
        path: "/dm",
        name: "dm",
        meta: {
          menu: "dm"
        },
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/dm/index.vue")
      },
      {
        // 多维分析：项目列表页面
        path: "/mdaProjectList",
        name: "mdaProjectList",
        meta: {
          menu: "mdaProjectList"
        },
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/mda/projectList.vue")
      },
      {
        // 多维分析主页面入口
        path: "/mda",
        name: "mda",
        meta: {
          menu: "mda"
        },
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/mda/index.vue"),
        // 默认路由为dataPrepare（数据准备页面）
        redirect: "/mda/dataPrepare",
        children:[
          {
            path: "/mda/dataPrepare",
            name: "dataPrepare",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/dataPrepare.vue")
          },
          {
            path: "/mda/analysis",
            name: "analysis",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/exploratoryAnalysis.vue")
          },
          {
            path: "/mda/dashBoard",
            name: "dashBoard",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/dashBoard.vue")
          },
          {
              path: "/mda/cubeList",
              name: "cubeList",
              meta: {
                  menu: "mda"
              },
              component: () =>
                  import(/* webpackChunkName: "about" */ "../views/mda/cubeList.vue")
          },
          {
            path: "/mda/createCube",
            name: "createCube",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/createCube.vue")
          },
          {
              path: "/mda/jobList",
              name: "jobList",
              meta: {
                  menu: "mda"
              },
              component: () =>
                  import(/* webpackChunkName: "about" */ "../views/mda/jobList.vue")
          },
          {
            path: "/mda/optimizeSetting",
            name: "optimizeSetting",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/optimizeSetting.vue")
          },
          {
            path: "/mda/cockpit",
            name: "cockpit",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/cockpitList.vue")
          },
          {
            path: "/mda/createCockpit",
            name: "createCockpit",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/createCockpit.vue")
          },
          {
            path: "/mda/indexCard",
            name: "indexCard",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/indexCard.vue")
          },
          {
            path: "/mda/cockpitFake2",
            name: "cockpitFake2",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/cockpitFake2.vue")
          },
          {
            path: "/mda/cockpitFake3",
            name: "cockpitFake3",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/cockpitFake3.vue")
          },
          {
            path: "/mda/previewCockpit",
            name: "previewCockpit",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/previewCockpit.vue")
          },
          {
            path: "/mda/saveGraph",
            name: "saveGraph",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/saveGraph.vue")
          },
          {
            path: "/mda/dataView",
            name: "dataView",
            meta: {
              menu: "mda"
            },
            component: () =>
                import(/* webpackChunkName: "about" */ "../views/mda/DataView.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Home.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
