package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.DataSource;
import bupt.edu.cn.web.pojo.DataView;
import bupt.edu.cn.web.repository.DataSourceRepository;
import bupt.edu.cn.web.repository.DataViewRepository;
import bupt.edu.cn.web.service.HiveService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @description:
 * @author: tc
 * @create: 2020/04/14 18:48
 */
@RestController
public class DataViewController {

    @Autowired
    DataViewRepository dataViewRepository;
    @Autowired
    DataSourceRepository dataSourceRepository;
    @Autowired
    HiveService hiveService;
    @Autowired
    KylinQueryService kqs;

    /**
     * 查询dataView
     */
    @RequestMapping(value = "/getAllDivDatas", method = RequestMethod.GET)
    public ReturnModel getAllDivDatas(String projectId){
        System.out.println("----------------getAllDivDatas--------------");
        System.out.println("projectId:" + projectId);
        ReturnModel result = new ReturnModel();

        List<DataView> dataViewList = dataViewRepository.findByProjectId(projectId);
        System.out.println(dataViewList);

        result.setDatum(dataViewList);
        return result;
    }


    /**
     * 查询hive表及其字段
     * @return
     */
    @RequestMapping(value = "/getHiveTablesAndColumns", method = RequestMethod.GET)
    public ReturnModel getHiveTablesAndColumns(){
        ReturnModel result = new ReturnModel();
        List<Map> hiveTables = new ArrayList<>();
        try {
            hiveTables = hiveService.selectData("jishengwei", "show tables");
        }catch (Exception e){
            System.out.println(e);
        }
        System.out.println(hiveTables);

        List<Map> hiveTablesAndColumns = new ArrayList<>();
        for (int i = 0; i < hiveTables.size(); i++) {
            String tableName = hiveTables.get(i).get("tab_name").toString();
            List<Map<String,String>> desc = new ArrayList<>();
            try {
                desc = hiveService.descTable("jishengwei", tableName);
            }catch (Exception e) {
                System.out.println("desc:" + tableName + "出错了:");
                System.out.println(e);
            }
            Map<String, Object> temp = new HashMap<>();
            temp.put("name", tableName);
            List<String> fieldList = new ArrayList<>();
            for (int j = 0; j < desc.size(); j++) {
                fieldList.add(desc.get(j).get("name"));
            }
            temp.put("fields", fieldList);
            hiveTablesAndColumns.add(temp);
        }

        result.setDatum(hiveTablesAndColumns);

        return result;
    }


    /**
     * 查询数据模型（Model）对应的factTable和lookupTables
     */
    @RequestMapping(value = "/getModelDesc", method = RequestMethod.GET)
    public ReturnModel getModelDesc(Integer modelId){
        System.out.println("----------------getModelDesc--------------");
        System.out.println("modelId:" + modelId);
        ReturnModel result = new ReturnModel();
        Map<String, Object> factTableAndLookupTables = new HashMap<>();
        List<String> lookupTables = new ArrayList<>();
        factTableAndLookupTables.put("lookupTables", lookupTables);

        DataSource dataSource = dataSourceRepository.findById(modelId).orElse(null);

        if (dataSource != null) {
            if (dataSource.getFileType().equals("hive")) {
                if (dataSource.getFileUrl().startsWith("select")) { // hive多表
                    String temp = dataSource.getFileUrl().split(" ")[3];
                    factTableAndLookupTables.put("factTable", temp);
                    String[] strings = dataSource.getFileUrl().split(" ");
                    for (int i = 0; i < strings.length; i++) {
                        if (strings[i].equals("join")) {
                            lookupTables.add(strings[++i]);
                        }
                    }
                }else { // hive单表
                    factTableAndLookupTables.put("factTable", dataSource.getFileUrl());
                }
            }else if (dataSource.getFileType().equals("kylin")) { // kylin
                kqs.login("ADMIN","KYLIN");
                String cubeDes = kqs.getCubeDes(dataSource.getFileUrl());
                System.out.println(cubeDes);
                // 格式化cubeDes，转化为可解析的JSONArray
                cubeDes = cubeDes.substring(1, cubeDes.length() - 1);
                com.alibaba.fastjson.JSONObject jsonObject = com.alibaba.fastjson.JSONArray.parseObject(cubeDes);
                String modelName = (String) jsonObject.get("model_name");
                // 获取cube对应的model
                String modelDes = kqs.getDataModel(modelName);
                System.out.println(modelDes);
                jsonObject = com.alibaba.fastjson.JSONArray.parseObject(modelDes);
                String factTable = (String) jsonObject.get("fact_table");
                factTableAndLookupTables.put("factTable", trimProject(factTable));
                com.alibaba.fastjson.JSONArray jsonArray = (com.alibaba.fastjson.JSONArray)jsonObject.get("lookups");
                for (int i = 0; i < jsonArray.size(); i++) {
                    JSONObject temp = JSONObject.parseObject(jsonArray.get(i).toString());
                    lookupTables.add(trimProject(temp.get("table").toString()));
                }
            }
        }


        result.setDatum(factTableAndLookupTables);
        return result;
    }

    private String trimProject(String tableName) {
        if (tableName.contains(".")) {
            return tableName.split("\\.")[1];
        }
        return tableName;
    }
}
