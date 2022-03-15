var data = [
  {
    title: "离线作业目录",
    icon: "icon-folder",
    scopedSlots: { icon: "icon" },
    children: [
      {
        icon: "icon-flow",
        title: "默认工作流",
        scopedSlots: { icon: "icon" },
        children: [
          {
            icon: "icon-subfolder",
            title: "原始数据层(ODS)",
            scopedSlots: { icon: "icon" },
            children: [
              {
                icon: "icon-subfolder",
                title: "ddl",
                scopedSlots: { icon: "icon" },
                children: [
                  {
                    type: "ddl",
                    icon: "icon-ddl",
                    title: "ddl_ods_movie_info",
                    code:
                      "create table IF NOT EXISTS douban.movie (id bigint comment '电影ID',title string comment '电影名称名称',loc string comment '地区',cate string comment '类别',url string comment '地址',cover string comment '海报',rate float comment '评分') comment '电影' partitioned by (ds string comment '当前时间，用于分区字段') row format delimited FIELDS TERMINATED BY '|' stored as orc"
                  }
                ]
              },
              {
                icon: "icon-subfolder",
                title: "job",
                scopedSlots: { icon: "icon" },
                children: [
                  {
                    type: "sql",
                    icon: "icon-sql",
                    title: "ods_movie_info",
                    code: "select * from douban.movie_loc"
                  }
                ]
              }
            ]
          },
          {
            id: 10,
            icon: "icon-subfolder",
            title: "数据仓库层(DWD)"
          },
          {
            id: 10,
            icon: "icon-subfolder",
            title: "数据标签层(TDM)"
          },
          {
            id: 10,
            icon: "icon-subfolder",
            title: "数据应用层(ADM)"
          },
          {
            id: 10,
            icon: "icon-subfolder",
            title: "数据维度(DIM)"
          }
        ]
      },
      {
        id: 4,
        icon: "icon-flow",
        title: "空白工作流"
      }
    ]
  },
  {
    id: 1,
    title: "资源文件目录",
    icon: "icon-folder",
    scopedSlots: { icon: "icon" },
    children: [
      {
        id: 4,
        icon: "icon-subfolder",
        title: "默认工作流"
      }
    ]
  },
  {
    id: 1,
    title: "函数目录",
    icon: "icon-folder",
    scopedSlots: { icon: "icon" },
    children: [
      {
        id: 4,
        icon: "icon-subfolder",
        title: "系统函数"
      }
    ]
  },
  {
    id: 1,
    title: "临时作业目录",
    icon: "icon-folder",
    scopedSlots: { icon: "icon" },
    children: [
      {
        id: 4,
        icon: "icon-subfolder",
        title: "默认工作流"
      }
    ]
  }
];
export default data;
