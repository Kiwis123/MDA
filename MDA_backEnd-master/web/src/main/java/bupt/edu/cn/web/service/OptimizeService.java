package bupt.edu.cn.web.service;

import bupt.edu.cn.kylin.service.KylinQueryService;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * @description:
 *      kylin自动建模的优化服务
 * @author: tc
 * @create: 2020/05/19 23:55
 */
@Service
public class OptimizeService {

    @Autowired
    KylinQueryService kqs;

    /**
     * 根据sqlList生成聚合组（场景：初次构建Cube的优化）
     *      返回格式为cubeDesc所需JSONArray
     * @param sqlList 经过筛选、分组产生的 其中一组sql
     * @return
     */
    public JSONArray aggregationGroups(List<String> sqlList) {
        JSONArray result = new JSONArray();
        // 1、解析sqlList，每条sql --> 一个聚合组，放入aggregationGroupList中
        List<List<String>> aggregationGroupList = new ArrayList<>();
        for (int i = 0; i < sqlList.size(); i++) {
            String sql = sqlList.get(i);
            List<String> temp = new ArrayList<>();
            // 去除having和空格
            sql = sql.split("group by ")[1].split(" having")[0];
            sql = sql.replace(" ", "");
            String[] dimensionList = sql.split(",");
            for (int j = 0; j < dimensionList.length; j++) {
                temp.add(dimensionList[j]);
            }
            aggregationGroupList.add(temp);
        }
        // 2、遍历aggregationGroupList，删除被包含的聚合组
        int len = aggregationGroupList.size();
        // 删除标志数组
        boolean[] deleted = new boolean[len];
        for (int i = 0; i < len; i++) {
            deleted[i] = false;
        }
        // 循环标志位（当一趟遍历完成后，没有聚合组被删除，表示循环完毕，最终的聚合组被生成）
        boolean wellDone = false;
        while (!wellDone) {
            wellDone = true;
            for (int i = 0; i < len; i++) {
                if (deleted[i]) {
                    continue;
                }
                for (int j = 0; j < len; j++) {
                    if (i == j || deleted[j]) {
                        continue;
                    }
                    // 如果 a包含b ，则删除b，并将wellDone置为false
                    if (aIncludeb(aggregationGroupList.get(i), aggregationGroupList.get(j))) {
                        deleted[j] = true;
                        wellDone = false;
                    }
                }
            }
        }
        // 3、将最终的aggregationGroupList整理成为cubeDesc所需的格式
        for (int i = 0; i < aggregationGroupList.size(); i++) {
            if (!deleted[i]){
                JSONObject aggregationGroup = new JSONObject();
                aggregationGroup.put("includes", aggregationGroupList.get(i));
                JSONObject selectRule = new JSONObject();
                selectRule.put("hierarchy_dims", new JSONArray());
                selectRule.put("joint_dims", new JSONArray());
                selectRule.put("mandatory_dims", new JSONArray());
                aggregationGroup.put("select_rule", selectRule);
                result.add(aggregationGroup);
            }
        }

        return result;
    }


    /**
     * 根据hiveTables和filters生成rowkey（场景：初次构建Cube的优化）
     *      返回格式为cubeDesc所需JSONObject
     * @param projectName 项目名称
     * @param filters param内包含的参数，筛选项（where、having）
     * @return
     */
    public JSONObject rowkey(String projectName, String filters, JSONArray dimensions) {
        JSONObject result = new JSONObject();
        // 格式化参数
        String hiveTables = kqs.getHiveTables(projectName, true);
        JSONArray hiveTableArray = JSON.parseArray(hiveTables);
        JSONArray filterArray = JSON.parseArray(filters);
        // 解析hiveTables，提取基数cardinality
        Map<String, Integer> cardinalityMap = new HashMap<>();
        for (int i = 0; i < hiveTableArray.size(); i++) {
            JSONObject hiveTableJson = hiveTableArray.getJSONObject(i);
            String table = hiveTableJson.getString("name");
            JSONObject cardinalityJson = hiveTableJson.getJSONObject("cardinality");
            for (JSONObject.Entry<String, Object> entry: cardinalityJson.entrySet()) {
                String dimension = table + entry.getKey();
                // cardinalityMap中只添加dimensions里包含的维度
                if (dimensions.contains(dimension)) {
                    cardinalityMap.put(table + entry.getKey(), Integer.parseInt(entry.getValue().toString()));
                }
            }
        }

        // 开始排序，逻辑：被筛选次数多的排在前面，基数高的排在前面
        // 排序1：将filterArray中，查询次数相同的按照基数降序排列
        List<String> sortedDimensions = sortByCardinality(filterArray, cardinalityMap);
        // 排序2：将cardinalityMap中剩余的元素按照基数降序排列，并加入sortedDimensions中
        List<Map.Entry<String, Integer>> cardinalityList = new ArrayList<Map.Entry<String, Integer>>(cardinalityMap.entrySet());
        cardinalityList.sort(new Comparator<Map.Entry<String, Integer>>() {
            @Override
            public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) {
                return o2.getValue().compareTo(o1.getValue());
            }
        });
        for (int i = 0; i < cardinalityList.size(); i++) {
            sortedDimensions.add(cardinalityList.get(i).getKey());
        }

        // 整理结果：将sortedDimensions逐个格式化，并添加至result
        JSONArray rowkeyColumns = new JSONArray();
        for (int i = 0; i < sortedDimensions.size(); i++) {
            String dimension = sortedDimensions.get(i);
            JSONObject column = new JSONObject();
            column.put("column", dimension);
            column.put("encoding", "dict");
            column.put("isShardBy", "false");
            column.put("encoding_version", 1);
            rowkeyColumns.add(column);
        }
        result.put("rowkey_columns", rowkeyColumns);

        return result;
    }


    /**
     * 根据sqlList生成聚合组（场景：运行时Cube的优化）
     *      返回格式为cubeDesc所需JSONArray
     * @param sqlList 经过筛选、分组产生的 其中一组sql
     * @return
     */
    public JSONArray aggregationGroupsRunning(List<String> sqlList) {
        JSONArray result = new JSONArray();


        return result;
    }


    /**
     * ---------------------------------------------------下面是工具函数----------------------------------------------------
     */

    /**
     * 判断聚合组的包含关系，A是否包含B
     * @param aggregationGroupA 大（包含B 即 A>=B）
     * @param aggregationGroupB 小（包含于A）
     * @return
     */
    private static boolean aIncludeb(List<String> aggregationGroupA, List<String> aggregationGroupB) {
        aggregationGroupA.sort(null);
        aggregationGroupB.sort(null);
        if (aggregationGroupA.size() < aggregationGroupB.size()) {
            return false;
        }
        int i = 0;
        int gap = 0;
        while (i < aggregationGroupB.size() && i + gap < aggregationGroupA.size()) {
            if (aggregationGroupA.get(i + gap).equals(aggregationGroupB.get(i))) {
                i++;
            }else {
                gap++;
            }
        }
        if (i  < aggregationGroupB.size() && i + gap >= aggregationGroupA.size()) {
            return false;
        }
        return true;
    }


    /**
     * 将基本有序的filterArray再次排序
     *      对于filter中频次相等的情况，按照基数降序排列
     *      已加入结果集中的元素，将从cardinalityMap中剔除，以便后续工作
     * @param filterArray
     * @param cardinalityMap
     * @return
     */
    private List<String> sortByCardinality(JSONArray filterArray, Map<String, Integer> cardinalityMap) {
        List<String> result = new ArrayList<>();
        List<Map.Entry<String, Integer>> filterList = new ArrayList<>();
        for (int i = 0; i < filterArray.size(); i++) {
            Map.Entry<String, Integer> entry = (Map.Entry<String, Integer>)filterArray.get(i);
            filterList.add(entry);
        }
        // 排序
        boolean swaped = true;
        while (swaped) {
            swaped = false;
            for (int i = 0; i < filterList.size() - 1; i++) {
                String dimension = filterList.get(i).getKey();
                Integer filterNum = filterList.get(i).getValue();
                Integer cardinality = cardinalityMap.get(dimension);
                String dimensionNext = filterList.get(i + 1).getKey();
                Integer filterNumNext = filterList.get(i + 1).getValue();
                Integer cardinalityNext = cardinalityMap.get(dimensionNext);
                // 若filterNum相同，而基数比后一个元素小，则发生交换，且置交换位为true
                if (filterNum.equals(filterNumNext) && cardinality < cardinalityNext) {
                    Collections.swap(filterList, i, i + 1);
                    swaped = true;
                }
            }
        }

        // 整理结果，并剔除cardinalityMap中已加入result的元素
        for (int i = 0; i < filterList.size(); i++) {
            String dimension = filterList.get(i).getKey();
            result.add(dimension);
            cardinalityMap.remove(dimension);
        }

        return result;
    }

}
