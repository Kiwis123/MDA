package bupt.edu.cn.kylin.service.impl;

import bupt.edu.cn.kylin.conf.KylinConf;
import bupt.edu.cn.kylin.service.KylinQueryService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class KylinQueryServiceImpl implements KylinQueryService {


    private static String encoding;
    private static final String baseURL = KylinConf.BASEURL;

    public String login(String user,String passwd){
        String method = "POST";
        String para = "/user/authentication";
        byte[] key = (user+":"+passwd).getBytes();
//        encoding = Base64.encodeBase64String(key);
        encoding = "QURNSU46S1lMSU4=";
        return excute(para,method,null);
    }


    public String listQueryableTables(String projectName){

        String method = "GET";
        String para = "/tables_and_columns?project="+projectName;
        return  excute(para,method,null);

    }


    /**
     *
     * @param offset required int Offset used by pagination
     * @param limit required int Cubes per page.
     * @param cubeName optional string Keyword for cube names. To find cubes whose name contains this keyword.
     * @param projectName optional string Project name.
     * @return
     */
    public String listCubes(int offset, int limit, String cubeName, String projectName ){
        String method = "GET";
        String TheThird = "";
        String TheFourth = "";

        if (!(cubeName.equals("") || cubeName == null)) {
            TheThird = "&cubeName=" + cubeName;
        }
        if (!(projectName.equals("") || projectName.equals(null))) {
            TheFourth = "&projectName=" + projectName;
        }

        String para = "/cubes?offset="+offset
                +"&limit="+limit;
        para = para + TheThird + TheFourth;
        System.out.println(para);
        return excute(para,method,null);
    }

    /**
     *
     * @param cubeName  Cube name.
     * @return
     */
    public String getCubeDes(String cubeName){
        String method = "GET";
        String para = "/cube_desc/"+cubeName;
        return excute(para,method,null);

    }


    /**
     *
     * @param cubeName
     * @return
     */
    public String getCube(String cubeName){
        String method = "GET";
        String para = "/cubes/"+cubeName;
        return excute(para,method,null);

    }



    /**
     *
     * @param modelName Data model name, by default it should be the same with cube name.
     * @return
     */
    public String getDataModel(String modelName){
        String method = "GET";
        String para = "/model/"+modelName;
        return excute(para,method,null);

    }

    /**
     *
     * @param cubeName cubeName Cube name.
     * @return
     */
    public String enableCube(String cubeName){

        String method = "PUT";
        String para = "/cubes/"+cubeName+"/enable";
        return excute(para,method,null);

    }

    /**
     *
     * @param cubeName Cube name.
     * @return
     */
    public String disableCube(String cubeName){

        String method = "PUT";
        String para = "/cubes/"+cubeName+"/disable";
        return excute(para,method,null);

    }

    /**
     *
     * @param cubeName Cube name.
     * @return
     */
    public String purgeCube(String cubeName){

        String method = "PUT";
        String para = "/cubes/"+cubeName+"/purge";
        return excute(para,method,null);

    }


    /**
     *
     * @param jobId Job id
     * @return
     */
    public String resumeJob(String jobId){

        String method = "PUT";
        String para = "/jobs/"+jobId+"/resume";
        return excute(para,method,null);

    }


    /**
     * startTime - required long Start timestamp of data to build, e.g. 1388563200000 for 2014-1-1
     * endTime - required long End timestamp of data to build
     * buildType - required string Supported build type: ��BUILD��, ��MERGE��, ��REFRESH��
     * @param cubeName  Cube name.
     * @return
     */
    public String buildCube(String cubeName,String body){
        String method = "PUT";
        String para = "/cubes/"+cubeName+"/rebuild";

        return excute(para,method,body);
    }


    /**
     *
     * @param jobId  Job id.
     * @return
     */
    public String discardJob(String jobId){

        String method = "PUT";
        String para = "/jobs/"+jobId+"/cancel";
        return excute(para,method,null);

    }

    /**
     *
     * @param jobId  Job id.
     * @return
     */
    public String getJobStatus(String jobId){

        String method = "GET";
        String para = "/jobs/"+jobId;
        return excute(para,method,null);

    }

    /**
     *
     * @param jobId Job id.
     * @param stepId  Step id; the step id is composed by jobId with step sequence id;
     * for example, the jobId is ��fb479e54-837f-49a2-b457-651fc50be110��, its 3rd step id
     * is ��fb479e54-837f-49a2-b457-651fc50be110-3��,
     * @return
     */
    public String getJobStepOutput(String jobId,String stepId){
        String method = "GET";
        String para = "/"+jobId+"/steps/"+stepId+"/output";
        return excute(para,method,null);
    }

    /**
     *
     * @param tableName table name to find.
     * @return
     */
    public String getHiveTable(String projectName, String tableName){
        String method = "GET";
        String para = "/tables/"+projectName+"/"+tableName;
        return excute(para,method,null);
    }

    /**
     *
     * @param tableName  table name to find.
     * @return
     */
    public String getHiveTableInfo(String tableName){
        String method = "GET";
        String para = "/tables/"+tableName+"/exd-map";
        return excute(para,method,null);
    }


    /**
     *
     * @param projectName will list all tables in the project.
     * @param extOptional boolean set true to get extend info of table.
     * @return
     */
    public String getHiveTables(String projectName,boolean extOptional){
        String method = "GET";
        String para = "/tables?project="+projectName+"&ext="+extOptional;
        return excute(para,method,null);
    }


    /**
     *
     * @param tables  table names you want to load from hive, separated with comma.
     * @param project the project which the tables will be loaded into.
     * @return
     */
    public String loadHiveTables(String tables,String project){
        String method = "POST";
        String para = "/tables/"+tables+"/"+project;
        return excute(para,method,null);
    }

    /**
     *
     * @param type ��METADATA�� or ��CUBE��
     * @param name  Cache key, e.g the cube name.
     * @param action ��create��, ��update�� or ��drop��
     * @return
     */
    public String wipeCache(String type,String name,String action){
        String method = "POST";
        String para = "/cache/"+type+"/"+name+"/"+action;
        return excute(para,method,null);
    }


    @Override
    public String query (String body) throws Exception{
        String  method = "POST";
        String para = "/query";

        return excute(para,method,body);
    }

    @Override
    public String createModel(String modelName, String projectName, String factTable, String lookups, String dimensions, String metrics) {
        String method = "POST";
        String para = "/models";

//        String modelDesc = "{\"name\": \"123\",\"description\": \"\",\"fact_table\": \"JISHENGWEI.GD_BASIC_INFO_DETAIL\",\"lookups\": [{\"table\": \"JISHENGWEI.GD_BAD_BABY_REGIST\",\"alias\": \"GD_BAD_BABY_REGIST\",\"joinTable\": \"GD_BASIC_INFO_DETAIL\",\"kind\": \"LOOKUP\",\"join\": {\"type\": \"inner\",\"primary_key\": [\"GD_BAD_BABY_REGIST.ID\"],\"foreign_key\": [\"GD_BASIC_INFO_DETAIL.ID\"]}}],\"filter_condition\": \"\",\"dimensions\": [{\"table\": \"GD_BASIC_INFO_DETAIL\",\"columns\": [\"MEDU_LEVEL\",\"FEDU_LEVEL\",\"PHONE_NUM\",\"HAS_CONTENT\"]},{\"table\": \"GD_BAD_BABY_REGIST\",\"columns\": [\"FAMILY_ADDRESS\",\"BABY_BIRTHDAY\",\"BIRTH_NUM\"]}],\"metrics\": [\"GD_BASIC_INFO_DETAIL.OUT_COME\"],\"partition_desc\": {\"partition_type\": \"APPEND\",\"partition_date_format\": \"yyyy-MM-dd\"},\"last_modified\": 0}";
        // 解析参数，添加有效信息至modelDesc
        JSONArray lookupsJson = JSON.parseArray(lookups);
        JSONObject modelDesc = new JSONObject();
        modelDesc.put("name", modelName);
        // 暂时不加database（"JISHENGWEI.FACTTABLE，看看行不行）
        modelDesc.put("fact_table", "JISHENGWEI." + factTable);
        modelDesc.put("lookups", lookupsJson);
        // metrics/measures，需要进行格式转换 avg(measure) --> measure
        JSONArray metricsJson = JSON.parseArray(metrics);
        JSONArray metricsTrans = new JSONArray();
        for (int i = 0; i < metricsJson.size(); i++) {
            String measure = metricsJson.getString(i);
            measure = measure.split("\\(")[1].split("\\)")[0];
            metricsTrans.add(measure);
        }
        modelDesc.put("metrics", metricsTrans);
        // 添加dimensions（格式需要转换）
        JSONArray dimensionJson = JSON.parseArray(dimensions);
        JSONArray dimensionArray = new JSONArray();
        Map<String, List<String>> tempMap = new HashMap<>();
        for (int i = 0; i < dimensionJson.size(); i++) {
            String lookupTable = dimensionJson.getString(i).split("\\.")[0];
            String dimension = dimensionJson.getString(i).split("\\.")[1];
            if (tempMap.isEmpty() || !tempMap.containsKey(lookupTable)) {
                List<String> tempList = new ArrayList<>();
                tempList.add(dimension);
                tempMap.put(lookupTable, tempList);
            }else {
                List<String> tempList = tempMap.get(lookupTable);
                tempList.add(dimension);
            }
        }
        for (Map.Entry<String,List<String>> entry:tempMap.entrySet()) {
            JSONObject tableDimensions = new JSONObject();
            tableDimensions.put("table", entry.getKey());
            JSONArray columns = new JSONArray();
            columns.addAll(entry.getValue());
            tableDimensions.put("columns", columns);
            dimensionArray.add(tableDimensions);
        }
        modelDesc.put("dimensions", dimensionArray);

        // 添加冗余信息至modelDesc
        modelDesc.put("description", "autoModel");
        modelDesc.put("filter_condition", "");
        JSONObject partition_desc = new JSONObject();
        partition_desc.put("partition_type", "APPEND");
        partition_desc.put("partition_date_format", "yyyy-MM-dd");
        modelDesc.put("partition_desc", partition_desc);
        modelDesc.put("last_modified", 0);


        JSONObject json = new JSONObject();
        json.put("modelDescData", modelDesc.toJSONString());
        json.put("project", projectName);

        System.out.println(json.toString());

        return excute(para, method, json.toString());
    }

    @Override
    public String createCube(String cubeName, String projectName, String dimensions, String measures, JSONArray aggregationGroups, JSONObject rowkey) {
        String method = "POST";
        String para = "/cubes";

//        String cubeDesc = "{\"name\":\"112cube2\",\"model_name\":\"112\",\"description\":\"\",\"dimensions\":[{\"name\":\"MNATIONALITY\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"MNATIONALITY\"},{\"name\":\"MID_CARD\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"MID_CARD\"},{\"name\":\"FNATIONALTY\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"FNATIONALTY\"},{\"name\":\"FJOB\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"FJOB\"},{\"name\":\"WEIGHT\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"WEIGHT\"]},{\"name\":\"HEART_RATE\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"HEART_RATE\"]},{\"name\":\"LOW_BLOOD_PRESSURE\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"LOW_BLOOD_PRESSURE\"]},{\"name\":\"FOLLOWUP_TIME\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"FOLLOWUP_TIME\"]},{\"name\":\"BIRTH_WEEK\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"BIRTH_WEEK\"]},{\"name\":\"BIRTH_PLACE_TOWN\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"BIRTH_PLACE_TOWN\"]}],\"measures\":[{\"name\":\"_COUNT_\",\"function\":{\"expression\":\"COUNT\",\"returntype\":\"bigint\",\"parameter\":{\"type\":\"constant\",\"value\":\"1\"},\"configuration\":{}}}],\"dictionaries\":[],\"rowkey\":{\"rowkey_columns\":[{\"column\":\"GD_BASIC_INFO_DETAIL.MNATIONALITY\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.MID_CARD\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.FNATIONALTY\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.FJOB\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.ID\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1}]},\"aggregation_groups\":[{\"includes\":[\"GD_BASIC_INFO_DETAIL.MNATIONALITY\",\"GD_BASIC_INFO_DETAIL.MID_CARD\",\"GD_BASIC_INFO_DETAIL.FNATIONALTY\",\"GD_BASIC_INFO_DETAIL.FJOB\",\"GD_BASIC_INFO_DETAIL.ID\"],\"select_rule\":{\"hierarchy_dims\":[],\"mandatory_dims\":[],\"joint_dims\":[]}}],\"mandatory_dimension_set_list\":[],\"partition_date_start\":0,\"notify_list\":[],\"hbase_mapping\":{\"column_family\":[{\"name\":\"F1\",\"columns\":[{\"qualifier\":\"M\",\"measure_refs\":[\"_COUNT_\"]}]}]},\"volatile_range\":\"0\",\"retention_range\":\"0\",\"status_need_notify\":[\"ERROR\",\"DISCARDED\",\"SUCCEED\"],\"auto_merge_time_ranges\":[604800000,2419200000],\"engine_type\":\"2\",\"storage_type\":\"2\",\"override_kylin_properties\":{}}";
        JSONObject cubeDesc = new JSONObject();
        // 添加cubeName、modelName（暂时同名）
        cubeDesc.put("name", cubeName);
        cubeDesc.put("model_name", cubeName);
        // 添加dimensions（暂时只有一个）
        JSONArray dimensionArray = new JSONArray();
        JSONArray dimensionsJson = JSON.parseArray(dimensions);
        for (int i = 0; i < dimensionsJson.size(); i++) {
            JSONObject dimension = new JSONObject();
            dimension.put("table", dimensionsJson.getString(i).split("\\.")[0]);
            dimension.put("name", dimensionsJson.getString(i).split("\\.")[1]);
            dimension.put("column", dimensionsJson.getString(i).split("\\.")[1]);
            dimensionArray.add(dimension);
        }
        cubeDesc.put("dimensions", dimensionArray);
        // 添加measures
        // measures1: 解析measures
        JSONArray measuresJson = JSON.parseArray(measures);
        JSONArray measureArray = new JSONArray();
        for (int i = 0; i < measuresJson.size(); i++) {
            JSONObject measure = new JSONObject();
            String temp = measuresJson.getString(i);
            measure.put("name", temp);
            JSONObject function = new JSONObject();
            String expression = temp.split("\\(")[0].toUpperCase();
            function.put("expression", expression);
            function.put("returntype", "bigint");
            JSONObject parameter = new JSONObject();
            parameter.put("type", "column");
            String value = temp.split("\\)")[0].split("\\(")[1];
            parameter.put("value", value);
            function.put("parameter", parameter);
            measure.put("function", function);
            measure.put("showDim", false);
            measureArray.add(measure);
        }

        // measures2: 添加count
        JSONObject measure = new JSONObject();
        measure.put("name", "_COUNT_");
        JSONObject function = new JSONObject();
        function.put("expression", "COUNT");
        function.put("returntype", "bigint");
        JSONObject parameter = new JSONObject();
        parameter.put("type", "constant");
        parameter.put("value", "1");
        function.put("parameter", parameter);
        function.put("configuration", new JSONObject());
        measure.put("function", function);
        measureArray.add(measure);
        cubeDesc.put("measures", measureArray);

        // 添加aggregation_groups（必须要有至少一个）
        cubeDesc.put("aggregation_groups", aggregationGroups);
        // 添加rowkey
        cubeDesc.put("rowkey", rowkey);

        // 添加其他冗余信息
        cubeDesc.put("description", "AutoCube");
        cubeDesc.put("dictionaries", new JSONArray());
        cubeDesc.put("mandatory_dimension_set_list", new JSONArray());
        cubeDesc.put("partition_date_start", 0);
        cubeDesc.put("notify_list", new JSONArray());
        // 添加hbase_mapping（有点繁琐）
        JSONObject hbase_mapping = new JSONObject();
        JSONArray column_family = new JSONArray();
        JSONObject column_family_object = new JSONObject();
        column_family_object.put("name", "F1");
        JSONArray columnsArray = new JSONArray();
        JSONObject columnsObject = new JSONObject();
        columnsObject.put("qualifier", "M");
        JSONArray measure_refs = new JSONArray();
        measure_refs.add("_COUNT_");
        columnsObject.put("measure_refs", measure_refs);
        columnsArray.add(columnsObject);
        column_family_object.put("columns", columnsArray);
        column_family.add(column_family_object);
        hbase_mapping.put("column_family", column_family);
        cubeDesc.put("hbase_mapping", hbase_mapping);
        cubeDesc.put("volatile_range", "0");
        cubeDesc.put("retention_range", "0");
        JSONArray status_need_notify = new JSONArray();
        status_need_notify.add("ERROR");
        status_need_notify.add("DISCARDED");
        status_need_notify.add("SUCCEED");
        cubeDesc.put("status_need_notify", status_need_notify);
        JSONArray auto_merge_time_ranges = new JSONArray();
        auto_merge_time_ranges.add(3600000);
        auto_merge_time_ranges.add(4800000);
        cubeDesc.put("auto_merge_time_ranges", auto_merge_time_ranges);
        cubeDesc.put("engine_type", "2");
        cubeDesc.put("storage_type", "2");
        cubeDesc.put("override_kylin_properties", new JSONObject());


        JSONObject json = new JSONObject();
        json.put("cubeDescData", cubeDesc.toJSONString());
        json.put("project", projectName);

        System.out.println("打印create cube的json------------");
        System.out.println(json.toString());

        return excute(para, method, json.toString());
    }



    public String excute(String para,String method,String body){

        StringBuilder out = new StringBuilder();
        try {
            URL url = new URL(baseURL+para);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod(method);
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setRequestProperty  ("Authorization", "Basic " + encoding);
            connection.setRequestProperty("Content-Type","application/json");
            if(body !=null){
                OutputStreamWriter writer = new OutputStreamWriter(connection.getOutputStream(), "utf-8");
                writer.write(body);
                writer.flush();

            }
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                out.append(line);
            }
            in.close();
            connection.disconnect();

        } catch(Exception e) {
            e.printStackTrace();
        }
        return out.toString();
    }


    /**
     * ------------------------------------------以下是单条SQL创建Model和Cube的代码，暂存---------------------------------------

    @Override
    public String createModel(String modelName, String projectName, String factTable, String lookups, JSONArray dimensions, JSONArray metrics) {
        String method = "POST";
        String para = "/models";

//        String modelDesc = "{\"name\": \"123\",\"description\": \"\",\"fact_table\": \"JISHENGWEI.GD_BASIC_INFO_DETAIL\",\"lookups\": [{\"table\": \"JISHENGWEI.GD_BAD_BABY_REGIST\",\"alias\": \"GD_BAD_BABY_REGIST\",\"joinTable\": \"GD_BASIC_INFO_DETAIL\",\"kind\": \"LOOKUP\",\"join\": {\"type\": \"inner\",\"primary_key\": [\"GD_BAD_BABY_REGIST.ID\"],\"foreign_key\": [\"GD_BASIC_INFO_DETAIL.ID\"]}}],\"filter_condition\": \"\",\"dimensions\": [{\"table\": \"GD_BASIC_INFO_DETAIL\",\"columns\": [\"MEDU_LEVEL\",\"FEDU_LEVEL\",\"PHONE_NUM\",\"HAS_CONTENT\"]},{\"table\": \"GD_BAD_BABY_REGIST\",\"columns\": [\"FAMILY_ADDRESS\",\"BABY_BIRTHDAY\",\"BIRTH_NUM\"]}],\"metrics\": [\"GD_BASIC_INFO_DETAIL.OUT_COME\"],\"partition_desc\": {\"partition_type\": \"APPEND\",\"partition_date_format\": \"yyyy-MM-dd\"},\"last_modified\": 0}";
        // 解析参数，添加有效信息至modelDesc
        JSONArray lookupsJSON = JSON.parseArray(lookups);
        JSONObject modelDesc = new JSONObject();
        modelDesc.put("name", modelName);
        // 暂时不加database（"JISHENGWEI.FACTTABLE，看看行不行）
        modelDesc.put("fact_table", factTable);
        modelDesc.put("lookups", lookupsJSON);
        // 添加dimensions、metrics/measures（全量加入所有的dimensions）
        modelDesc.put("dimensions", dimensions);
        modelDesc.put("metrics", metrics);

        // 添加冗余信息至modelDesc
        modelDesc.put("description", "autoModel");
        modelDesc.put("filter_condition", "");
        JSONObject partition_desc = new JSONObject();
        partition_desc.put("partition_type", "APPEND");
        partition_desc.put("partition_date_format", "yyyy-MM-dd");
        modelDesc.put("partition_desc", partition_desc);
        modelDesc.put("last_modified", 0);


        JSONObject json = new JSONObject();
        json.put("modelDescData", modelDesc.toJSONString());
        json.put("project", projectName);

        System.out.println(json.toString());

        return excute(para, method, json.toString());
    }

    @Override
    public String createCube(String cubeName, String projectName, String dimensions, String measures) {
        String method = "POST";
        String para = "/cubes";

//        String cubeDesc = "{\"name\":\"112cube2\",\"model_name\":\"112\",\"description\":\"\",\"dimensions\":[{\"name\":\"MNATIONALITY\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"MNATIONALITY\"},{\"name\":\"MID_CARD\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"MID_CARD\"},{\"name\":\"FNATIONALTY\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"FNATIONALTY\"},{\"name\":\"FJOB\",\"table\":\"GD_BASIC_INFO_DETAIL\",\"column\":\"FJOB\"},{\"name\":\"WEIGHT\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"WEIGHT\"]},{\"name\":\"HEART_RATE\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"HEART_RATE\"]},{\"name\":\"LOW_BLOOD_PRESSURE\",\"table\":\"GD_PHYSICAL_EXAM_W\",\"derived\":[\"LOW_BLOOD_PRESSURE\"]},{\"name\":\"FOLLOWUP_TIME\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"FOLLOWUP_TIME\"]},{\"name\":\"BIRTH_WEEK\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"BIRTH_WEEK\"]},{\"name\":\"BIRTH_PLACE_TOWN\",\"table\":\"GD_PREGENCY_RESULT\",\"derived\":[\"BIRTH_PLACE_TOWN\"]}],\"measures\":[{\"name\":\"_COUNT_\",\"function\":{\"expression\":\"COUNT\",\"returntype\":\"bigint\",\"parameter\":{\"type\":\"constant\",\"value\":\"1\"},\"configuration\":{}}}],\"dictionaries\":[],\"rowkey\":{\"rowkey_columns\":[{\"column\":\"GD_BASIC_INFO_DETAIL.MNATIONALITY\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.MID_CARD\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.FNATIONALTY\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.FJOB\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1},{\"column\":\"GD_BASIC_INFO_DETAIL.ID\",\"encoding\":\"dict\",\"isShardBy\":\"false\",\"encoding_version\":1}]},\"aggregation_groups\":[{\"includes\":[\"GD_BASIC_INFO_DETAIL.MNATIONALITY\",\"GD_BASIC_INFO_DETAIL.MID_CARD\",\"GD_BASIC_INFO_DETAIL.FNATIONALTY\",\"GD_BASIC_INFO_DETAIL.FJOB\",\"GD_BASIC_INFO_DETAIL.ID\"],\"select_rule\":{\"hierarchy_dims\":[],\"mandatory_dims\":[],\"joint_dims\":[]}}],\"mandatory_dimension_set_list\":[],\"partition_date_start\":0,\"notify_list\":[],\"hbase_mapping\":{\"column_family\":[{\"name\":\"F1\",\"columns\":[{\"qualifier\":\"M\",\"measure_refs\":[\"_COUNT_\"]}]}]},\"volatile_range\":\"0\",\"retention_range\":\"0\",\"status_need_notify\":[\"ERROR\",\"DISCARDED\",\"SUCCEED\"],\"auto_merge_time_ranges\":[604800000,2419200000],\"engine_type\":\"2\",\"storage_type\":\"2\",\"override_kylin_properties\":{}}";
        JSONObject cubeDesc = new JSONObject();
        // 添加cubeName、modelName（暂时同名）
        cubeDesc.put("name", cubeName);
        cubeDesc.put("model_name", cubeName);
        // 添加dimensions（暂时只有一个）
        JSONArray dimensionArray = new JSONArray();
        JSONObject dimension = new JSONObject();
        dimension.put("table", dimensions.split("\\.")[0]);
        dimension.put("name", dimensions.split("\\.")[1]);
        dimension.put("column", dimensions.split("\\.")[1]);
        dimensionArray.add(dimension);
        cubeDesc.put("dimensions", dimensionArray);
        // 添加measures（暂时不进行解析，只添加count）
        JSONArray measureArray = new JSONArray();
        JSONObject measure = new JSONObject();
        measure.put("name", "_COUNT_");
        JSONObject function = new JSONObject();
        function.put("expression", "COUNT");
        function.put("returntype", "bigint");
        JSONObject parameter = new JSONObject();
        parameter.put("type", "constant");
        parameter.put("value", "1");
        function.put("parameter", parameter);
        function.put("configuration", new JSONObject());
        measure.put("function", function);
        measureArray.add(measure);
        cubeDesc.put("measures", measureArray);

        // 添加其他冗余信息
        cubeDesc.put("description", "AutoCube");
        cubeDesc.put("dictionaries", new JSONArray());
        // 添加rowkey
        JSONObject rowkey = new JSONObject();
        JSONArray rowkey_columns = new JSONArray();
        JSONObject rowkey_columns_object = new JSONObject();
        rowkey_columns_object.put("column", "GD_PREGENCY_RESULT.BIRTH_WEEK");
        rowkey_columns_object.put("encoding", "dict");
        rowkey_columns_object.put("isShardBy", "false");
        rowkey_columns_object.put("encoding_version", 1);
        rowkey_columns.add(rowkey_columns_object);
        rowkey.put("rowkey_columns", rowkey_columns);
        cubeDesc.put("rowkey", rowkey);
        // 添加aggregation_groups（必须要有至少一个）
        JSONArray aggregation_groups = new JSONArray();
        JSONObject aggregation_groups_object = new JSONObject();
        JSONArray includes = new JSONArray();
        includes.add("GD_PREGENCY_RESULT.BIRTH_WEEK");
        aggregation_groups_object.put("includes", includes);
        JSONObject select_rule = new JSONObject();
        select_rule.put("hierarchy_dims", new JSONArray());
        select_rule.put("mandatory_dims", new JSONArray());
        select_rule.put("joint_dims", new JSONArray());
        aggregation_groups_object.put("select_rule", select_rule);
        aggregation_groups.add(aggregation_groups_object);
        cubeDesc.put("aggregation_groups", aggregation_groups);
        cubeDesc.put("mandatory_dimension_set_list", new JSONArray());
        cubeDesc.put("partition_date_start", 0);
        cubeDesc.put("notify_list", new JSONArray());
        // 添加hbase_mapping（有点繁琐）
        JSONObject hbase_mapping = new JSONObject();
        JSONArray column_family = new JSONArray();
        JSONObject column_family_object = new JSONObject();
        column_family_object.put("name", "F1");
        JSONArray columnsArray = new JSONArray();
        JSONObject columnsObject = new JSONObject();
        columnsObject.put("qualifier", "M");
        JSONArray measure_refs = new JSONArray();
        measure_refs.add("_COUNT_");
        columnsObject.put("measure_refs", measure_refs);
        columnsArray.add(columnsObject);
        column_family_object.put("columns", columnsArray);
        column_family.add(column_family_object);
        hbase_mapping.put("column_family", column_family);
        cubeDesc.put("hbase_mapping", hbase_mapping);
        cubeDesc.put("volatile_range", "0");
        cubeDesc.put("retention_range", "0");
        JSONArray status_need_notify = new JSONArray();
        status_need_notify.add("ERROR");
        status_need_notify.add("DISCARDED");
        status_need_notify.add("SUCCEED");
        cubeDesc.put("status_need_notify", status_need_notify);
        JSONArray auto_merge_time_ranges = new JSONArray();
        auto_merge_time_ranges.add(3600000);
        auto_merge_time_ranges.add(4800000);
        cubeDesc.put("auto_merge_time_ranges", auto_merge_time_ranges);
        cubeDesc.put("engine_type", "2");
        cubeDesc.put("storage_type", "2");
        cubeDesc.put("override_kylin_properties", new JSONObject());


        JSONObject json = new JSONObject();
        json.put("cubeDescData", cubeDesc.toJSONString());
        json.put("project", projectName);

        System.out.println("打印create cube的json------------");
        System.out.println(json.toString());

        return excute(para, method, json.toString());
    }

    */

}
