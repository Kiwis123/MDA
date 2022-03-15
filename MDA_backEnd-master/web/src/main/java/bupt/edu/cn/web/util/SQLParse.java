package bupt.edu.cn.web.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.*;

/**
 * @description:
 *      SQL解析器
 *          主要服务：将SQL列表解析成params，供KylinAutoModelingService使用
 * @author: tc
 * @create: 2020/05/17 23:16
 */
public class SQLParse {

    /**
     * SQL解析主函数
     *      将最初的SqlList经过 筛选、分组 后，解析成params，供KylinAutoModelingService使用
     *      注：params的类型为JSONArray，其中部分字段直接解析成modelDesc所需的格式(lookups字段)
     * @param groupedSqls
     * @param database
     * @return [{modelName: String, fact_table: String, lookups: JSONArray, dimensions: JSONArray, measures: JSONArray, filters: JSONArray}, ...]
     */
    public static JSONArray parseToParams(Map<String, List<String>> groupedSqls, String database) {
        JSONArray params = new JSONArray();

        // 遍历map，解析 groupedSqlList --> params
        for (Map.Entry<String,List<String>> entry:groupedSqls.entrySet()) {
            String modelName = entry.getKey();
            List<String> groupedSqlList = entry.getValue();
            JSONObject param = new JSONObject();

            // 开始解析
            // 1、factTable
            String factTable = groupedSqlList.get(0).split("from ")[1].split(" ")[0];
            // 2、lookupTable
            String lookupsSql = "";
            for (int i = 0; i < groupedSqlList.size(); i++) {
                String sql = groupedSqlList.get(i);
                if (parseModelName(sql).equals(modelName)) {
                    lookupsSql = sql;
                }
            }
            lookupsSql = lookupsSql.split(" group by")[0].split(" where")[0];
            JSONArray lookups = new JSONArray();
            String[] sqlSplitByJoin = lookupsSql.split(" join ");
            for (int i = 1; i < sqlSplitByJoin.length; i++) {
                // 添加lookup至lookups
                String lookupTable = sqlSplitByJoin[i].split(" on ")[0];
                JSONObject lookup = new JSONObject();
                lookup.put("table", database + "." + lookupTable);
                lookup.put("alias", lookupTable);
                lookup.put("joinTable", factTable);
                lookup.put("kind", "LOOKUP");
                JSONObject join = new JSONObject();
                lookup.put("join", join);
                String joinType = sqlSplitByJoin[i - 1].substring(sqlSplitByJoin[i - 1].lastIndexOf(" ") + 1);
                join.put("type", joinType);
                String temp = sqlSplitByJoin[i].replace(" " + joinType, "");
                temp = temp.split(" on ")[1];
                JSONArray joinKey0 = new JSONArray();
                joinKey0.add(temp.split(" = ")[0]);
                JSONArray joinKey1 = new JSONArray();
                joinKey1.add(temp.split(" = ")[1]);
                if (temp.split(" = ")[0].split("\\.")[0].equals(lookupTable)) {
                    join.put("primary_key", joinKey0);
                    join.put("foreign_key", joinKey1);
                }else {
                    join.put("primary_key", joinKey1);
                    join.put("foreign_key", joinKey0);
                }
                lookups.add(lookup);
            }
            // 3、dimensions(格式为：table.dimension)
            JSONArray dimensions = new JSONArray();
            Set<String> dimensionSet = new HashSet<>();
            for (int i = 0; i < groupedSqlList.size(); i++) {
                String sql = groupedSqlList.get(i);
                // 去除having和空格
                sql = sql.split("group by ")[1].split(" having")[0];
                sql = sql.replace(" ", "");
                String[] dimensionList = sql.split(",");
                for (int j = 0; j < dimensionList.length; j++) {
                    dimensionSet.add(dimensionList[j]);
                }
            }
            dimensions.addAll(dimensionSet);
            // 4、measures(格式为：SUM(table.sum))，不包括count
            JSONArray measures = new JSONArray();
            Set<String> measureSet = new HashSet<>();
            for (int i = 0; i < groupedSqlList.size(); i++) {
                String sql = groupedSqlList.get(i);
                sql = sql.split("select ")[1].split(" from")[0];
                String[] measureList = sql.split(",");
                for (int j = 0; j < measureList.length; j++) {
                    String measure = measureList[j];
                    // 去除as XXX和空格
                    measure = measure.split(" as")[0];
                    measure = measure.replace(" ", "");
                    // 校验是否是dimension，如果非dimension且不是count，添加至measureSet中
                    if (!dimensionSet.contains(measure) && !measure.startsWith("count")) {
                        measureSet.add(measure);
                    }
                }
            }
            measures.addAll(measureSet);
            // 5、filter（where、having等，格式为：[table1.dimension1: 5, table2.dimension2: 2, ...]）
            Map<String, Integer> filterMap = new HashMap<>();
            for (int i = 0; i < groupedSqlList.size(); i++) {
                String sql = groupedSqlList.get(i);
                if (sql.contains("where ")) {
                    sql = sql.split("where ")[1].split(" ")[0];
                }else if (sql.contains("having ")) {
                    sql = sql.split("having ")[1].split(" ")[0];
                }else {
                    continue;
                }
                sql = sql.replace(" ", "");
                String filter = sql.split("=")[0];
                if (filterMap.containsKey(filter)) {
                    Integer value = filterMap.get(filter) + 1;
                    filterMap.put(filter, value);
                }else {
                    filterMap.put(filter, 1);
                }
            }
            // 5.1、借助list，对filterMap按值排序
            List<Map.Entry<String, Integer>> list = new ArrayList<Map.Entry<String, Integer>>(filterMap.entrySet());
            // 5.2、list.sort()，按值降序排列
            list.sort(new Comparator<Map.Entry<String, Integer>>() {
                @Override
                public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                    return o2.getValue().compareTo(o1.getValue());
                }
            });
            JSONArray filters = new JSONArray();
            filters.addAll(list);

            // 添加至参数中
            param.put("modelName", modelName);
            param.put("fact_table", factTable);
            param.put("lookups", lookups);
            param.put("dimensions", dimensions);
            param.put("measures", measures);
            param.put("filters", filters);

            params.add(param);
        }


        return params;
    }

    /**
     * SQL筛选 -- 排除掉不适合构建Cube的SQL
     * @param sqlList
     * @return
     */
    public static List<String> filtedSqlList(List<String> sqlList) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < sqlList.size(); i++) {
            String sql = sqlList.get(i);
            // 1、排除select *
            if (sql.startsWith("select *")) {
                continue;
            }
            // 2、排除没有“join”和“group by”的SQL
            if (sql.lastIndexOf("join") == -1 || sql.lastIndexOf("group by") == -1) {
                continue;
            }
            // 3、排除度量来自lookupTable的情况
            boolean measureInLookupTable = false;
            String factTable = sql.split("from ")[1].split(" ")[0];
            String measureStr = sql.split(" from")[0].split("select ")[1];
            measureStr = measureStr.replace(" ", "");
            String dimensionStr = sql.split("group by ")[1].split(" where")[0].split(" having")[0];
            dimensionStr = dimensionStr.replace(" ", "");
            String[] measures = measureStr.split(",");
            String[] dimensions = dimensionStr.split(",");
            // 3.1、逐一对比，筛选出维度
            for (int j = 0; j < measures.length; j++) {
                String measure = measures[j];
                boolean isDimension = false;
                for (int k = 0; k < dimensions.length; k++) {
                    if (measure.equals(dimensions[k])) {
                        isDimension = true;
                    }
                }
                if (!isDimension) {
                    // 3.2、对于非count型维度，例如sum(table.column)，校验其是否来自lookupTable
                    if (!"count(1)".equals(measure) && !"count(*)".equals(measure)) {
                        measure = measure.split("\\(")[1].split("\\)")[0];
                        String table = measure.split("\\.")[0];
                        // 3.3、校验得知：measure是来自lookupTable的
                        if (!table.equals(factTable)) {
                            measureInLookupTable = true;
                        }
                    }
                }
            }
            // 3.4、若measure来自lookupTable，将其剔除
            if (measureInLookupTable) {
                continue;
            }

            // 符合条件，加入List中
            result.add(sql);
        }

        return result;
    }

    /**
     * SQL分组 -- 按照模型对SQL进行分组，每个SQL组产生一个Cube
     *      返回值：Map: {modelName1: [sql1, sql2, ...], modelName2: [sql5, sql6, ...]}
     * @param sqlList
     * @return
     */
    public static Map<String, List<String>> groupedSqls(List<String> sqlList) {
        Map<String, List<String>> result = new HashMap<>();
        // 首先确定modelName集合（最大聚合组）
        // 这个逻辑是将小model并入大model中一起计算的
        List<String> modelList = new ArrayList<>();
        for (int i = 0; i < sqlList.size(); i++) {
            String sql = sqlList.get(i);
            String modelName = parseModelName(sql);
            if (modelList.size() == 0) {
                modelList.add(modelName);
                continue;
            }
            boolean modelNotInList = true;
            int pos = -1;
            for (int j = 0; j < modelList.size(); j++) {
                if (aIncludeb(modelList.get(j), modelName)) {
                    modelNotInList = false;
                    pos = j;
                }
            }
            if (!modelNotInList) {
                modelList.add(modelName);
                if (aIncludeb(modelName, modelList.get(pos))) {
                    modelList.remove(pos);
                }
            }
        }
        // 根据modelName集合添加sql
        for (int i = 0; i < modelList.size(); i++) {
            result.put(modelList.get(i), new ArrayList<>());
        }
        for (int i = 0; i < sqlList.size(); i++) {
            String sql = sqlList.get(i);
            String modelName = parseModelName(sql);
            for (int j = 0; j < modelList.size(); j++) {
                if (aIncludeb(modelName, modelList.get(j))) {
                    List<String> list = result.get(modelList.get(j));
                    list.add(sql);
                }
            }
        }

        return result;
    }

    /**
     * 提取模型名称
     *      sql --> factTable2lookupTableA2lookupTableB
     *      lookupTable按照字典序排列
     * @param sql
     * @return
     */
    public static String parseModelName(String sql) {
        String factTable = sql.split("from ")[1].split(" ")[0];
        List<String> lookupTables = new ArrayList<>();
        String[] sqlSplited = sql.split("join ");
        for (int i = 1; i < sqlSplited.length; i++) {
            lookupTables.add(sqlSplited[i].split(" on")[0]);
        }
        lookupTables.sort(null);
        String modelName = factTable;
        for (int i = 0; i < lookupTables.size(); i++) {
            modelName += "2" + lookupTables.get(i);
        }

        return modelName;
    }


    /**
     * 判断模型的包含关系，A是否包含B
     * @param modelA 大（包含B 即 A>=B）
     * @param modelB 小（包含于A）
     * @return
     */
    private static boolean aIncludeb(String modelA, String modelB) {
        if (modelA.equals(modelB)) {
            return true;
        }
        String[] aList = modelA.split("2");
        String[] bList = modelB.split("2");
        if (aList.length < bList.length || !aList[0].equals(bList[0])) {
            return false;
        }
        int i = 1;
        int gap = 0;
        while (i < bList.length && i + gap < aList.length) {
            if (aList[i + gap].equals(bList[i])) {
                i++;
            }else {
                gap++;
            }
        }
        if (i  < bList.length && i + gap >= aList.length) {
            return false;
        }

        return true;
    }
}
