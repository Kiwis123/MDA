package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.spark.common.SpSession;
import bupt.edu.cn.spark.service.impl.SparkSqlServiceImpl;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.QueriedSql;
import bupt.edu.cn.web.pojo.Sql;
import bupt.edu.cn.web.repository.DataSourceRepository;
import bupt.edu.cn.web.repository.FaltTableRepository;
import bupt.edu.cn.web.repository.QueriedSqlRepository;
import bupt.edu.cn.web.repository.SqlRepository;
import bupt.edu.cn.web.service.HiveService;
import bupt.edu.cn.web.service.OptimizeService;
import bupt.edu.cn.web.util.SQLGenerate;
import bupt.edu.cn.web.util.SQLParse;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @description:
 * @author: tc
 * @create: 2020/05/05 15:55
 */
@RestController
@RequestMapping("/kylinAutoModeling")
public class KylinAutoModelingController {

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
    @Autowired
    OptimizeService optimizeService;
    @Autowired
    QueriedSqlRepository queriedSqlRepository;



    @RequestMapping(value = "/buildCubesBySQLList", method = RequestMethod.POST)
    public ReturnModel buildCubesBySQLList(){
        ReturnModel result = new ReturnModel();
        kqs.login("ADMIN","KYLIN");
        // 生成样例数据
        List<String> sqlList = generateSQLList();
        // 筛选
        List<String> filtedSqlList = SQLParse.filtedSqlList(sqlList);
        // 分组
        Map<String, List<String>> groupedSqls = SQLParse.groupedSqls(filtedSqlList);
        // 解析SQL --> params
        JSONArray params = SQLParse.parseToParams(groupedSqls, "JISHENGWEI");
        String projectName = "KylinAutoModeling";
        // 遍历params，每个 param 构建一对 Model & Cube
        JSONArray createResult = new JSONArray();
        for (int i = 0; i < params.size(); i++) {
            JSONObject param = params.getJSONObject(i);
            // 1、创建Model
            String createModelResult = kqs.createModel(param.getString("modelName"), projectName, param.getString("fact_table"), param.getString("lookups"), param.getString("dimensions"), param.getString("measures"));
            // 2、创建Cube
            // 2.1、聚合组
            JSONArray aggregationGroups = optimizeService.aggregationGroups(groupedSqls.get(param.getString("modelName")));
            // 2.2、rowkey（传递参数hiveTables，里面包含基数cardinality字段）
            JSONObject rowkey = optimizeService.rowkey(projectName, param.getString("filters"), param.getJSONArray("dimensions"));
            String createCubeResult = kqs.createCube(param.getString("modelName"), projectName, param.getString("dimensions"), param.getString("measures"), aggregationGroups, rowkey);

            // 记录结果
            JSONObject temp = new JSONObject();
            createResult.add(temp);
            temp.put("createModelResult", createModelResult);
            temp.put("createCubeResult", createCubeResult);
        }


        result.setResult(true);
        result.setDatum(createResult);

        return result;
    }


    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public ReturnModel test(){
        // 生成样例数据
        List<String> sqlList = generateSQLList();

        for (int i = 0; i < sqlList.size(); i++) {
            String sql = sqlList.get(i);
            String routeStr = "kylin";
            Timestamp startTime = new Timestamp(System.currentTimeMillis());
            System.out.println("-----------------------开始查询: " + startTime + " --------------------------");
            System.out.println("The SQL is: " + sql);
            Timestamp endTime = new Timestamp(System.currentTimeMillis());
            // 查询时延（s）
            long queryLatency = endTime.getTime() - startTime.getTime();
            System.out.println("-----------------------查询结束，查询时延为: " + queryLatency + " ms-------------------");
            // 存储sql
            QueriedSql toBeStoredSql = new QueriedSql();
            toBeStoredSql.setModel(SQLParse.parseModelName(sql));
            toBeStoredSql.setQueryEngine(routeStr);
            toBeStoredSql.setQueryLatency(queryLatency);
            toBeStoredSql.setQueriedSql(sql);
            toBeStoredSql.setTime(startTime);
            System.out.println(toBeStoredSql);
            queriedSqlRepository.saveAndFlush(toBeStoredSql);
        }

        return null;
    }



    /**
     * -------------------------------------------------------下面是一些工具函数---------------------------------------------------------------
     */

    /**
     * 生成SQL LIST（无数据库时模拟输入）
     * @return
     */
    private List<String> generateSQLList() {
        List<String> sqlList = new ArrayList<>();
        // Cube1，三表联接
        sqlList.add("select count(1), GD_BASIC_INFO_DETAIL.FJOB, GD_BASIC_INFO_DETAIL.FEDU_LEVEL from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_BASIC_INFO_DETAIL.FJOB, GD_BASIC_INFO_DETAIL.FEDU_LEVEL");
        sqlList.add("select count(1), GD_BASIC_INFO_DETAIL.FJOB, GD_PHYSICAL_EXAM_W.SPECISAL_LOOK, GD_BASIC_INFO_DETAIL.FEDU_LEVEL from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_BASIC_INFO_DETAIL.FJOB, GD_BASIC_INFO_DETAIL.FEDU_LEVEL, GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
        sqlList.add("select count(1), GD_BASIC_INFO_DETAIL.FJOB, GD_PHYSICAL_EXAM_W.SPECISAL_LOOK from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_BASIC_INFO_DETAIL.FJOB, GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
        sqlList.add("select count(*), GD_BASIC_INFO_DETAIL.FEDU_LEVEL, GD_PREGENCY_RESULT.NORMALPRE from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_BASIC_INFO_DETAIL.FEDU_LEVEL, GD_PREGENCY_RESULT.NORMALPRE");
        sqlList.add("select count(1), GD_PREGENCY_RESULT.NORMALPRE from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_PREGENCY_RESULT.NORMALPRE");
        sqlList.add("select sum(GD_PREGENCY_RESULT.BIRTH_NUM), GD_BASIC_INFO_DETAIL.FJOB from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_BASIC_INFO_DETAIL.FJOB");
        sqlList.add("select sum(GD_PREGENCY_RESULT.BIRTH_NUM), GD_PHYSICAL_EXAM_W.SPECISAL_LOOK, GD_PHYSICAL_EXAM_W.RETARDATION from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID group by GD_PHYSICAL_EXAM_W.SPECISAL_LOOK, GD_PHYSICAL_EXAM_W.RETARDATION");
//        // Cube2，单表构建Cube
//        sqlList.add("select BABY_SEX, count(*) from GD_BAD_BABY_REGIST");
//        sqlList.add("select avg(BABY_WEIGHT), LITTERS from GD_BAD_BABY_REGIST group by LITTERS having BABY_RESULT = 1");
        // 冗余SQL
        sqlList.add("select * from GD_PREGENCY_RESULT.BIRTH_WEEK");
        sqlList.add("select sum(GD_PHYSICAL_EXAM_W.RETARDATION), GD_BASIC_INFO_DETAIL.OUT_COME from GD_BASIC_INFO_DETAIL inner join GD_PHYSICAL_EXAM_W on GD_BASIC_INFO_DETAIL.ID = GD_PHYSICAL_EXAM_W.ID inner join GD_PREGENCY_RESULT on GD_BASIC_INFO_DETAIL.ID = GD_PREGENCY_RESULT.ID group by GD_BASIC_INFO_DETAIL.OUT_COME");


        return sqlList;
    }







    /**
     * -------------------------------------------------------下面是一些历史遗留代码---------------------------------------------------------------
     *      * 1、对于 单SQL --> 自动构建简单Cube 的场景，直接使用SQLUtil进行解析
     *      * 2、对于 SQL集 --> 自动构建多个Cube（含优化） 的场景，使用SQLParse工具类
     */


    /**
     * 创建模型Model
     * @return
     */
    @RequestMapping(value = "/createModel", method = RequestMethod.POST)
    public ReturnModel createModel(String modelName, String projectName, String factTable, String lookups){
        ReturnModel result = new ReturnModel();
        kqs.login("ADMIN","KYLIN");

        String str = "";
        String res = kqs.createModel(str, str, str, str, str, str);

        result.setResult(true);
        result.setDatum(res);
        return result;
    }


    /**
     * 创建/设计 Cube
     * @return
     */
    @RequestMapping(value = "/createCube", method = RequestMethod.POST)
    public ReturnModel createCube(String cubeName, String projectName, String dimensions, String measures){
        ReturnModel result = new ReturnModel();
        kqs.login("ADMIN","KYLIN");

        String str = "";
        String res = kqs.createCube(str, str, str, str, new JSONArray(), new JSONObject());

        result.setResult(true);
        result.setDatum(res);
        return result;
    }


    /**
     * 构建/Build Cube
     * @return
     */
    @RequestMapping(value = "/buildCube", method = RequestMethod.POST)
    public ReturnModel buildCube(String cubeName){
        ReturnModel result = new ReturnModel();
        kqs.login("ADMIN","KYLIN");

        // 固定startTime和endTime（对于非实时Cube，这些字段无意义）
        JSONObject json = new JSONObject();
        json.put("startTime", 1200000);
        json.put("endTime", 3600000);
        json.put("buildType", "BUILD");
        String res = kqs.buildCube(cubeName, json.toString());

        result.setResult(true);
        result.setDatum(res);
        return result;
    }

//    /**
//     * 根据SQL自动构建Cube
//     *      这只是根据一条SQL直接触发构建Cube的接口，功能并不完善
//     *      测试SQL：
//     *          select count(1),GD_PREGENCY_RESULT.BIRTH_WEEK from GD_BASIC_INFO_DETAIL inner join GD_PHYSICAL_EXAM_W on GD_BASIC_INFO_DETAIL.ID = GD_PHYSICAL_EXAM_W.ID inner join GD_PREGENCY_RESULT on GD_BASIC_INFO_DETAIL.ID = GD_PREGENCY_RESULT.ID group by GD_PREGENCY_RESULT.BIRTH_WEEK
//     * @return
//     */
//    @RequestMapping(value = "/buildCubeBySQL", method = RequestMethod.POST)
//    public ReturnModel buildCubeBySQL(String SQL){
//        ReturnModel result = new ReturnModel();
//        kqs.login("ADMIN","KYLIN");
//
//
//
//        // 初始化参数集合params
//        JSONObject params = new JSONObject();
//        // 解析SQL
//        SQLUtil(SQL, params, "JISHENGWEI");
//
//        System.out.println(params);
//
//        // 暂时写死projectName为kylinAutoModeling
//        String projectName = "kylinAutoModeling";
//
//        System.out.println("解析SQL完毕，开始构建~~~~~~~~~~~~~~");
//
//        // 建立Model
//        // 由于hiveService无法被kylin跨模块调用，构建model时的dimensions和metrics在此处解析
//        JSONArray lookupsJSON = (JSONArray) params.get("lookups");
//        JSONArray dimensions = new JSONArray();
//        JSONArray metrics = new JSONArray();
//        for (int i = 0; i < lookupsJSON.size(); i++) {
//            JSONObject temp = (JSONObject)lookupsJSON.get(i);
//            String tableName = temp.get("alias").toString();
//            List<Map<String,String>> tableDesc = new ArrayList<>();
//            try {
//                tableDesc = hiveService.descTable("jishengwei", tableName);
//                System.out.println(tableDesc);
//            }catch (Exception e) {
//                System.out.println(e);
//            }
//            JSONArray columns = new JSONArray();
//            for (int j = 0; j < tableDesc.size(); j++) {
//                columns.add(tableDesc.get(j).get("name"));
//                // 如果字段的type为int或double，加入metrics
//                if (tableDesc.get(j).get("type").equals("int") || tableDesc.get(j).get("type").equals("double")) {
//                    metrics.add(tableName + "." + tableDesc.get(j).get("name"));
//                }
//            }
//            JSONObject dimension = new JSONObject();
//            dimension.put("table", tableName);
//            dimension.put("columns", columns);
//            dimensions.add(dimension);
//        }
//        String createModelResult = kqs.createModel(params.get("modelName").toString(), projectName, params.get("fact_table").toString(), params.get("lookups").toString(), dimensions.toString(), metrics.toString());
//
//        System.out.println("create model完毕，开始create cube~~~~~~~~~~~~~~");
//
//        // 创建/设计 Cube
//        String createCubeResult = kqs.createCube(params.get("modelName").toString(), projectName, params.get("dimensions").toString(), "");
//
//        System.out.println("create cube完毕，开始build cube~~~~~~~~~~~~~~");
//
//        // build Cube
//        // 固定startTime和endTime（对于非实时Cube，这些字段无意义）
//        JSONObject json = new JSONObject();
//        json.put("startTime", 1200000);
//        json.put("endTime", 3600000);
//        json.put("buildType", "BUILD");
//        String buildCubeResult = kqs.buildCube(params.get("modelName").toString(), json.toString());
//
//        result.setResult(true);
//        JSONObject resultOutput = new JSONObject();
//        resultOutput.put("createModelResult", createModelResult);
//        resultOutput.put("createCubeResult", createCubeResult);
//        resultOutput.put("buildCubeResult", buildCubeResult);
//        result.setDatum(resultOutput);
//
//        return result;
//    }
//
//
//    /**
//     * SQL工具 -- 解析SQL，将其中包含的有用信息存储到params里
//     * @param SQL
//     * @param params
//     * @param database 数据库名称，用来拼接table（eg: JISHENGWEI.GD_PHYSICAL_EXAM_W）
//     */
//    private void SQLUtil(String SQL, JSONObject params, String database) {
//        // 如果SQL语法不合要求，直接return，上层函数处理此错误
//        if (SQL.lastIndexOf("join") == -1 || SQL.lastIndexOf("group by") == -1) {
//            return;
//        }
//        // 截取SQL中“from”以后的语句
//        SQL = SQL.split(" from ")[1];
//        // 添加dimensions（以group by为分界线）
//        params.put("dimensions", SQL.split(" group by ")[1]);
//        SQL = SQL.split(" group by ")[0];
//        // 添加factTable和lookupTable
//        JSONArray lookups = new JSONArray();
//        params.put("lookups", lookups);
//        String[] sqlSplitByJoin = SQL.split(" join ");
//        // 添加factTable
//        String factTable = sqlSplitByJoin[0].split(" ")[0];
//        params.put("fact_table", "JISHENGWEI." + factTable);
//        // 获取当前时间，初始化modelName（最终的modelName为：factTable2lookupTableA2lookupTableB + 时间）
//        String modelName = "" + factTable;
//        SimpleDateFormat df = new SimpleDateFormat("yyyy_MM_dd");
//        String currentTime = df.format(new Date());
//        // 添加lookupTable
//        for (int i = 1; i < sqlSplitByJoin.length; i++) {
//            // 添加lookup至lookups
//            String lookupTable = sqlSplitByJoin[i].split(" on ")[0];
//            JSONObject lookup = new JSONObject();
//            lookup.put("table", database + "." + lookupTable);
//            lookup.put("alias", lookupTable);
//            lookup.put("joinTable", factTable);
//            lookup.put("kind", "LOOKUP");
//            JSONObject join = new JSONObject();
//            lookup.put("join", join);
//            String joinType = sqlSplitByJoin[i - 1].substring(sqlSplitByJoin[i - 1].lastIndexOf(" ") + 1);
//            join.put("type", joinType);
//            String temp = sqlSplitByJoin[i].replace(" " + joinType, "");
//            temp = temp.split(" on ")[1];
//            JSONArray joinKey0 = new JSONArray();
//            joinKey0.add(temp.split(" = ")[0]);
//            JSONArray joinKey1 = new JSONArray();
//            joinKey1.add(temp.split(" = ")[1]);
//            if (temp.split(" = ")[0].split("\\.")[0].equals(lookupTable)) {
//                join.put("primary_key", joinKey0);
//                join.put("foreign_key", joinKey1);
//            }else {
//                join.put("primary_key", joinKey1);
//                join.put("foreign_key", joinKey0);
//            }
//            lookups.add(lookup);
//            // 添加lookupTable至modelName
//            modelName += "2" + lookupTable;
//        }
//        // 添加时间至modelName
//        modelName += currentTime;
//        params.put("modelName", modelName);
//    }
}
