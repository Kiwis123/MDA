package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.kylin.service.impl.KylinQueryServiceImpl;
import bupt.edu.cn.spark.common.SpSession;
import bupt.edu.cn.spark.service.impl.SparkSqlServiceImpl;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.DataSource;
import bupt.edu.cn.web.pojo.FaltTable;
import bupt.edu.cn.web.repository.DataSourceRepository;
import bupt.edu.cn.web.repository.FaltTableRepository;
import bupt.edu.cn.web.service.HiveService;
import bupt.edu.cn.web.util.SQLGenerate;
import com.alibaba.fastjson.JSON;
import com.google.gson.JsonObject;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;

import java.util.*;

@RestController
public class KylinController {

    @Autowired
    KylinQueryService kqs;
    @Autowired
    FaltTableRepository ftr;
    @Autowired
    DataSourceRepository dsr;
    @Autowired
    HiveService hiveService;
    @Autowired
    SparkSqlServiceImpl sparkSqlService;
    @Autowired
    SpSession spSession;



    @RequestMapping("/")
    public String hello() {
        return "hello";
    }

    /**
     * 获取cube列表（测试连接）
     * @return
     */
    @RequestMapping(value = "/listCubes", method = RequestMethod.GET)
    public ReturnModel kylinTest(){
        ReturnModel result = new ReturnModel();
        System.out.println("准备登陆~~~");
        System.out.println(kqs.login("ADMIN","KYLIN"));
        System.out.println("登陆完成~~~~");
        String cubeList = kqs.listCubes(0,50000,"","jishengwei");
        System.out.println(cubeList);
        com.alibaba.fastjson.JSONArray jsonArray = com.alibaba.fastjson.JSONArray.parseArray(cubeList);
        System.out.println("~~~~~~~~~~");
        System.out.println(jsonArray);
        result.setDatum(jsonArray);
        System.out.println(result.getDatum());

        return result;
    }


    /**
     * 查询cube
     * @return
     */
    @RequestMapping(value = "/query", method = RequestMethod.GET)
    public ReturnModel query(){
        ReturnModel result = new ReturnModel();
        kqs.login("ADMIN","KYLIN");
        String sql = "select (case gd_bad_baby_regist.DOWN_SYND when 0 then '唐氏综合症' when 1 then '其他出生缺陷' else '正常出生儿童' end) as 类型, " +
                "avg(baby_weight) as 平均体重, " +
                "count(1) as 数量 " +
                "from gd_baby_situation " +
                "left join gd_bad_baby_regist " +
                "on gd_baby_situation.ID = gd_bad_baby_regist.ID " +
                "group by gd_bad_baby_regist.DOWN_SYND " +
                "limit 5000";
        Map<String, String> sqlBody = new HashMap<>();
        sqlBody.put("sql", sql);
        sqlBody.put("project", "jishengwei");
        JSONObject sqlJson = new JSONObject(sqlBody);
        System.out.println(sqlJson);
        System.out.println(sqlJson.toString());
        String sqlResult = "";
        try {
            sqlResult = kqs.query(sqlJson.toString());
        }catch (Exception e){
            System.out.println(e);
        }
        result.setDatum(sqlResult);
        System.out.println(result.getDatum());

        return result;
    }



    /**
     * 查询hive表
     * @return
     */
    @RequestMapping(value = "/getHiveTables", method = RequestMethod.GET)
    public ReturnModel getHiveTables(){
        ReturnModel result = new ReturnModel();
        List<Map> hiveTables = new ArrayList<>();
        try {
            hiveTables = hiveService.selectData("jishengwei", "show tables");
        }catch (Exception e){
            System.out.println(e);
        }
        result.setDatum(hiveTables);

        return result;
    }

    /**
     * 预览hive表
     * @return
     */
    @RequestMapping(value = "/previewHive", method = RequestMethod.GET)
    public ReturnModel previewHive(@RequestParam String tableName){
        ReturnModel result = new ReturnModel();

        String sql = "select * from " + tableName + " limit 20";

        List<Map> previewResult = new ArrayList<>();
        try {
            previewResult = hiveService.selectData("jishengwei", sql);
        }catch (Exception e){
            System.out.println(e);
        }
        result.setDatum(previewResult);

        return result;
    }


    /**
     * 预览cube
     * @return
     */
    @RequestMapping(value = "/previewCube", method = RequestMethod.GET)
    public ReturnModel previewCube(@RequestParam String tableName){
        ReturnModel result = new ReturnModel();
        String sql = "select ";

        /**
         * 根据tableName（cubeName）获取【cube的描述信息】，包括:
         *      表名、列名, modelName
         */
        kqs.login("ADMIN","KYLIN");
        String cubeDes = kqs.getCubeDes(tableName);
        // 格式化cubeDes，转化为可解析的JSONArray
        cubeDes = cubeDes.substring(1, cubeDes.length() - 1);
        com.alibaba.fastjson.JSONObject jsonObject = com.alibaba.fastjson.JSONArray.parseObject(cubeDes);
        String modelName = (String) jsonObject.get("model_name");
        com.alibaba.fastjson.JSONArray jsonArray = (com.alibaba.fastjson.JSONArray)jsonObject.get("dimensions");
        // 遍历jsonArray，输出 【表名.列名】 至 sql 中
        for (int i = 0; i < jsonArray.size(); i++) {
            com.alibaba.fastjson.JSONObject dimension = (com.alibaba.fastjson.JSONObject)jsonArray.get(i);
            String table = (String) dimension.get("table");
            String column = (String) dimension.get("name");
            sql += table + "." + column;
            if (i != jsonArray.size() - 1) {
                sql += ", ";
            }else {
                sql += " from ";
            }
        }

        /**
         * 根据tableName（cubeName）获取【model的描述信息】，包括:
         *      表间关联信息, 筛选条件
         */
        String modelDes = kqs.getDataModel(modelName);
        // 格式化modelDes，转化为可解析的JSONArray
        jsonObject = com.alibaba.fastjson.JSONArray.parseObject(modelDes);
        String factTable = (String) jsonObject.get("fact_table");
        jsonArray = (com.alibaba.fastjson.JSONArray)jsonObject.get("lookups");
        // 遍历jsonArray，输出 【from factTalbe xxjoin lookupTable on xxx】 至 sql 中
        sql += factTable;
        for (int i = 0; i < jsonArray.size(); i++) {
            com.alibaba.fastjson.JSONObject lookup = (com.alibaba.fastjson.JSONObject)jsonArray.get(i);
            String lookupTable = (String) lookup.get("table");
            com.alibaba.fastjson.JSONObject join = (com.alibaba.fastjson.JSONObject) lookup.get("join");
            String type = (String) join.get("type");
            com.alibaba.fastjson.JSONArray tempArray = (com.alibaba.fastjson.JSONArray) join.get("primary_key");
            String primary_key = tempArray.get(0).toString();
            tempArray = (com.alibaba.fastjson.JSONArray) join.get("foreign_key");
            String foreign_key = tempArray.get(0).toString();
            sql += " " + type + " join " + lookupTable + " on " + primary_key + " = " + foreign_key;
        }
        String filterCondition = (String) jsonObject.get("filter_condition");
        if (!"".equals(filterCondition)) {
            sql += " where " + filterCondition;
        }
        sql += " limit 20";

        System.out.println(sql);

        // 查询hive，输出结果
        List<Map> previewResult = new LinkedList<>();
        try {
            previewResult = hiveService.selectData("jishengwei", sql);
        }catch (Exception e){
            System.out.println("hive查询失败: " + e);
        }

        result.setDatum(previewResult);
        System.out.println(previewResult.toString());

        return result;
    }


    /**
     * 根据hive表名查询列名
     * @return
     */
    @RequestMapping(value = "/getHiveColumns", method = RequestMethod.GET)
    public ReturnModel getHiveColumns(String tableName){
        ReturnModel result = new ReturnModel();
        List<Map<String, String>> columns = new LinkedList<>();
        try {
            columns = hiveService.descTable("jishengwei", tableName);
        }catch (Exception e){
            System.out.println(e);
        }
        System.out.println(columns.toString());
        result.setDatum(columns);

        return result;
    }


    /**
     * 预览多表关联的hive表
     * @return
     */
    @RequestMapping(value = "/previewFlatHive", method = RequestMethod.POST)
    public ReturnModel previewFlatHive(String factTable, String joinJson){
        System.out.println("没调到接口？不会把。。。");
        System.out.println("参数：");
        System.out.println(factTable);
        System.out.println(joinJson);

        com.alibaba.fastjson.JSONArray jsonArray = JSON.parseArray(joinJson);
        ReturnModel result = new ReturnModel();

        String sql = "select * from " + factTable;

        for (int i = 0; i < jsonArray.size(); i++) {
            com.alibaba.fastjson.JSONObject jsonObject = jsonArray.getJSONObject(i);
            String joinType = jsonObject.getString("joinType");
            if ("内部".equals(joinType)) {
                sql += " inner join ";
            }else if (joinType.equals("左侧".equals(joinType))) {
                sql += " left join ";
            }else {
                sql += " right join";
            }
            String lookupTable = jsonObject.getString("lookupTable");
            sql += lookupTable + " on ";
            String joinCondition = jsonObject.getString("joinCondition");
            String[] columns = joinCondition.split("=");
            sql += factTable + "." + columns[0] + " = " + lookupTable + "." + columns[1];
        }
        sql += " limit 20";

        System.out.println(sql);

        /**
         * 给查询计时
         */
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        String startDate = df.format(new Date());
        System.out.println("---开始SparkSQL多表关联查询：" + startDate);
        try {
            /**
             * 暂时改回hive执行为软著截图 by tc 2020-09-10
             */
            List previewResult = hiveService.selectData("jishengwei", sql);
//            List previewResult = sparkSqlService.queryBySpark("jishengwei" ,sql);
            result.setDatum(previewResult);
        }catch (Exception e){
            System.out.println("查询失败：");
            System.out.println(e);
            result.setDatum("查询失败");
        }

        String endDate = df.format(new Date());
        System.out.println("------多表关联查询结束：" + endDate);

        System.out.println("---------查询结果：");
        System.out.println(result.getDatum().toString());

        return result;
    }

    /**
     * 根据hive表名查询维度和度量
     * @return
     */
    @RequestMapping(value = "/getDimsAndMeasByTableName", method = RequestMethod.GET)
    public ReturnModel getDimsAndMeasByTableName(String tableName){
        ReturnModel result = new ReturnModel();
        List<Map<String, String>> tableDesc = new LinkedList<>();
        try {
            tableDesc = hiveService.descTable("jishengwei", tableName);
        }catch (Exception e){
            System.out.println(e);
        }
        System.out.println(tableDesc.toString());

        List<String> dimensions = new LinkedList<>();
        List<String> measures = new LinkedList<>();
        for (int i = 0; i < tableDesc.size(); i++) {
            if (tableDesc.get(i).get("type").equals("int") || tableDesc.get(i).get("type").equals("double")) {
                dimensions.add(tableDesc.get(i).get("name"));
            }else {
                measures.add(tableDesc.get(i).get("name"));
            }
        }

        Map<String, List<String>> resultMap = new HashMap<>();
        resultMap.put("dimensions", dimensions);
        resultMap.put("measures", measures);

        System.out.println(resultMap);

        result.setDatum(resultMap);

        return result;
    }


    /**
     * 预览数据模型
     * （包括单hive表【先不写】、多hive表关联、cube）
     * @return
     */
    @RequestMapping(value = "/previewModel", method = RequestMethod.GET)
    public ReturnModel previewModel(Integer id){
        System.out.println("-------previewModel-------");
        System.out.println("参数：");
        System.out.println("id=" + id);

        ReturnModel result = new ReturnModel();

        DataSource dataSource = dsr.findById(id).orElse(null);

        if (dataSource == null) {
            result.setResult(false);
            result.setReason("未找到该数据模型");
            return result;
        }

        if (dataSource.getFileType().equals("hive")) {
            // hive多表关联预览
            if (dataSource.getFileUrl().startsWith("select")) {
                List<Map> previewResult = new ArrayList<>();
                String sql = dataSource.getFileUrl();
                sql += " limit 20";
                System.out.println(sql);
                try {
                    previewResult = sparkSqlService.queryBySpark("jishengwei", sql);
                }catch (Exception e){
                    System.out.println(e);
                }
                result.setDatum(previewResult);
            }else { // hive单表预览
                result = previewHive(dataSource.getFileUrl());
            }
        }else { // kylin的cube预览
            result = previewCube(dataSource.getFileUrl());
        }

        return result;
    }


    /**
     * 创建宽表，并向数据源注册
     * @return
     */
    @RequestMapping("/createFaltTable")
    public ReturnModel createFaltTable(){
        System.out.println("----------------createFaltTable--------------");

        ReturnModel result = new ReturnModel();
        //获取cubes
        kqs.login("ADMIN","KYLIN");
        String cubeList = kqs.listCubes(0,50000,"","");
        System.out.println(cubeList);

        //将jsonString 解析为json
        JSONArray cubeJsonArray;
        try {
            cubeJsonArray = new JSONArray(cubeList);//先将对象转成json数组
            result.setReason("成功");
            result.setResult(true);
        } catch (Exception e) {
            //字符串不能解析
            result.setReason("解析失败,宽表创建失败");
            result.setResult(false);
            return result;
        }
        for(int i = 0; i < cubeJsonArray.length();i++){
            JSONObject job = cubeJsonArray.getJSONObject(i);
            if (job.getString("status").equals("READY")){
                //取出 model 名称和 project 名称
                String model = job.getString("model");
                String project = job.getString("project");

                //将name复制为 model 名称
                String name = model;

                //获取model信息
                String dataModel = kqs.getDataModel(job.getString("model"));
                System.out.println(dataModel);

                //得到model/宽表的对应sql 和 tables
                SQLGenerate sg = new SQLGenerate();
                String[] sqlANDtab = sg.getFaltTableSql(dataModel);
                String sql = sqlANDtab[0];
                String tables = sqlANDtab[1];


                //更新数据库(falt_table)
                List<FaltTable> faltTables = ftr.findByModelAndProject(model,project);
                if (faltTables.size() == 0){
                    FaltTable faltTable = new FaltTable();
                    faltTable.setModel(model);
                    faltTable.setProject(project);
                    faltTable.setTableSql(sql);
                    faltTable.setName(name);
                    faltTable.setTables(tables);
                    ftr.saveAndFlush(faltTable);
                }else if (faltTables.size() == 1){
                    FaltTable faltTable = faltTables.get(0);
                    faltTable.setModel(model);
                    faltTable.setProject(project);
                    faltTable.setTableSql(sql);
                    faltTable.setName(name);
                    faltTable.setTables(tables);
                    ftr.saveAndFlush(faltTable);
                }else {
                    result.setReason("数据库中已多个存在重复model,宽表创建失败，请检查数据库");
                    result.setResult(false);
                    return result;
                }

                //向数据源注册/更新宽表（dataSource）
                List<DataSource> dataSources = dsr.findByFileNameEquals(name);
                if (dataSources.size() == 0){
                    DataSource dataSource = new DataSource();
                    dataSource.setFileName(name);
                    dataSource.setFileUrl(sql);
                    dataSource.setFileType("FALT");
                    dsr.saveAndFlush(dataSource);
                }else if (dataSources.size() == 1){
                    DataSource dataSource = dataSources.get(0);
                    dataSource.setFileUrl(sql);
                    dsr.saveAndFlush(dataSource);
                }else {
                    result.setReason("数据库中存在重复name的数据源,宽表注册失败，请检查数据库");
                    result.setResult(false);
                    return result;
                }

            }
        }

        return result;
    }

}
