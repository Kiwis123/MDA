package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.web.algorithm.AggregationGroupDivision;
import bupt.edu.cn.web.common.ReturnModel;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * @description:
 *      Cube运行时优化
 * @author: tc
 * @create: 2020/07/14 01:03
 */
@RestController
@RequestMapping("/runningOptimize")
public class RunningOptimizeController {

    @Autowired
    KylinQueryService kqs;

    private Map<Double, Map> socreDivisionMap;

    private List<List<String>> dimensionCombinationList = new ArrayList<>();

    private Double bestScore = -100.0;
    private Object bestQueryLatency;
    private Object bestExpansionRate;

    private List<Double> list1 = new ArrayList<>();
    private List<Double> list2 = new ArrayList<>();



    /**
     * 测试运行时Cube优化的功能
     * @param itrationNum 迭代次数
     * @param dimensionNum 维度数量
     * @param listNum 测试集规模
     * @return
     */
    @RequestMapping(value = "/runningOptimize", method = RequestMethod.GET)
    public ReturnModel runningOptimize(Integer itrationNum, Integer dimensionNum, Integer listNum){
        ReturnModel result = new ReturnModel();

        socreDivisionMap = new HashMap<>();

        // 重置最佳得分
        bestScore = -100.0;

        // 生成假数据（原始数据）
        dimensionCombinationList = generateDimensionCombinationList(dimensionNum, listNum);

        Double weightThreshold = 0.0;
        int loopNum = 0;
        // 最大边权
        Integer maxWeight = 0;
        AggregationGroupDivision aggregationGroupDivision = new AggregationGroupDivision();
        aggregationGroupDivision.initWeightedGraph(dimensionCombinationList);
        Map<String, Map<String, Integer>> weightedGraph = aggregationGroupDivision.weightedGraph;
        for (Map.Entry<String, Map<String, Integer>> entry: weightedGraph.entrySet()) {
            for (Map.Entry<String, Integer> entry1: entry.getValue().entrySet()) {
                if (!entry.getKey().equals(entry1.getKey()) && entry1.getValue() > maxWeight) {
                    maxWeight = entry1.getValue();
                }
            }
        }
        // 递增数量
        Double increaseWeight = (double)maxWeight / itrationNum;
//        Double increaseWeight = 0.1;
//        if (maxWeight < 10) {
//            increaseWeight = (double)maxWeight / itrationNum;
//        }

        // 多次迭代主函数
        while (loopNum < itrationNum && weightThreshold < maxWeight) {
            System.out.println("-----------------第 " + loopNum + "次迭代，结果为：---------------");
            System.out.println("权重阈值：" + weightThreshold);
            ReturnModel res = runningOptimizeOnce(weightThreshold);
//            Map resMap = (Map)res.getDatum();
//            Double score = (Double) resMap.get("总体得分");
//            System.out.println(score);

            System.out.println("历史统计：");
            System.out.println("最佳得分：" + bestScore);
            System.out.println("最佳查询时延：" + bestQueryLatency);
            System.out.println("最佳膨胀率：" + bestExpansionRate);

            weightThreshold += increaseWeight;
            loopNum++;
        }

        System.out.println(list1);
        System.out.println(list2);


        return result;
    }


    /**
     * 测试运行时Cube优化的功能
     * @return
     */
    @RequestMapping(value = "/runningOptimizeOnce", method = RequestMethod.GET)
    public ReturnModel runningOptimizeOnce(Double weightThreshold){
        ReturnModel result = new ReturnModel();

//        // 装载基数map（由于普通类中无法跨模块装载service，在此处运算，向下传递）
//        kqs.login("KYLIN", "ADMIN");
//        String hiveTables = kqs.getHiveTables("kylinAutoModeling", true);
//        JSONArray hiveTableArray = JSON.parseArray(hiveTables);
//        Map<String, Integer> cardinalityMap = new HashMap<>();
//        for (int i = 0; i < hiveTableArray.size(); i++) {
//            JSONObject hiveTableJson = hiveTableArray.getJSONObject(i);
//            String table = hiveTableJson.getString("name");
//            JSONObject cardinalityJson = hiveTableJson.getJSONObject("cardinality");
//            for (JSONObject.Entry<String, Object> entry: cardinalityJson.entrySet()) {
//                String dimension = table + entry.getKey();
//                // cardinalityMap中只添加dimensionSet里包含的维度
//                cardinalityMap.put(table + "." + entry.getKey(), Integer.parseInt(entry.getValue().toString()));
//            }
//        }
        // 装载基数map（服务器连不上，使用假数据）
        Map<String, Integer> cardinalityMap = generateCardinalityMap();


        // 开始划分
        AggregationGroupDivision aggregationGroupDivision = new AggregationGroupDivision();
        // 平均权重阈值
        Map<String, Object> divideResult = aggregationGroupDivision.aggregationGroupList(dimensionCombinationList, cardinalityMap, weightThreshold);
        result.setDatum(divideResult);
        socreDivisionMap.put((Double) divideResult.get("总体得分"), divideResult);
        System.out.println(divideResult);
        if ((double)divideResult.get("总体得分") > bestScore) {
            bestScore = (double)divideResult.get("总体得分");
            bestQueryLatency = divideResult.get("平均查询时延（估算）");
            bestExpansionRate = divideResult.get("膨胀率");
        }

        Double temp = (int)(weightThreshold * 100) / 100.0;
        list1.add(temp);
        list2.add((Double) divideResult.get("总体得分"));

        return result;
    }


    /**
     * -----------------------------------------------------下面是工具函数-----------------------------------------------------
     */



    /**
     * 生成维度组合列表（实验源数据）
     * @return
     */
    public List<List<String>> generateDimensionCombinationList(Integer dimensionNum, Integer listNum) {
        List<List<String>> result = new ArrayList<>();
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_PREGENCY_RESULT.DEATHPRE"));
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_PREGENCY_RESULT.DEATHPRE,GD_BASIC_INFO_DETAIL.FEDU_LEVEL"));
//        result.add(generateList("GD_PREGENCY_RESULT.DEATHPRE,GD_BASIC_INFO_DETAIL.FJOB"));
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_BASIC_INFO_DETAIL.FEDU_LEVEL"));
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_PREGENCY_RESULT.DEATHPRE,GD_BASIC_INFO_DETAIL.FEDU_LEVEL,GD_BASIC_INFO_DETAIL.FJOB"));
//        result.add(generateList("GD_BASIC_INFO_DETAIL.FNATIONALTY,GD_PHYSICAL_EXAM_W.RETARDATION"));
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_BASIC_INFO_DETAIL.FNATIONALTY"));
//        result.add(generateList("GD_PREGENCY_RESULT.NORMALPRE,GD_BASIC_INFO_DETAIL.FNATIONALTY,GD_PHYSICAL_EXAM_W.RETARDATION"));
//        result.add(generateList("GD_PHYSICAL_EXAM_W.SPECISAL_LOOK,GD_PHYSICAL_EXAM_W.WEIGHT"));
//        result.add(generateList("GD_PREGENCY_RESULT.DEATHPRE,GD_PHYSICAL_EXAM_W.SPECISAL_LOOK,GD_PHYSICAL_EXAM_W.WEIGHT"));
//        result.add(generateList("GD_PREGENCY_RESULT.DEATHPRE,GD_BASIC_INFO_DETAIL.FJOB,GD_PHYSICAL_EXAM_W.SPECISAL_LOOK,GD_PHYSICAL_EXAM_W.WEIGHT"));

        if (dimensionNum == 8 && listNum == 25) {
            result = list825();
        }else if (dimensionNum == 8 && listNum == 50) {
            result = list850();
        }else if (dimensionNum == 16 && listNum == 50) {
            result = list1650();
        }else {
            result = list1675();
        }

        return result;
    }

    private List<List<String>> list825() {
        List<List<String>> result = new ArrayList<>();
        result.add(generateList("ABC"));
        result.add(generateList("ABC"));
        result.add(generateList("ABC"));
        result.add(generateList("ABC"));
        result.add(generateList("AB"));
        result.add(generateList("AB"));
        result.add(generateList("AC"));
        result.add(generateList("BC"));
        result.add(generateList("BC"));
        result.add(generateList("AGH"));
        result.add(generateList("AGH"));
        result.add(generateList("AGH"));
        result.add(generateList("AGH"));
        result.add(generateList("GH"));
        result.add(generateList("GH"));
        result.add(generateList("GH"));
        result.add(generateList("AG"));
        result.add(generateList("AG"));
        result.add(generateList("DEF"));
        result.add(generateList("DEF"));
        result.add(generateList("DEF"));
        result.add(generateList("DE"));
        result.add(generateList("DE"));
        result.add(generateList("DF"));
        result.add(generateList("EF"));
        return result;
    }

    private List<List<String>> list850() {
        List<List<String>> result = list825();
        result.add(generateList("ABC"));
        result.add(generateList("ABC"));
        result.add(generateList("ABC"));
        result.add(generateList("AB"));
        result.add(generateList("AB"));
        result.add(generateList("AB"));
        result.add(generateList("BC"));
        result.add(generateList("AC"));
        result.add(generateList("AC"));
        result.add(generateList("AGH"));
        result.add(generateList("AGH"));
        result.add(generateList("AGH"));
        result.add(generateList("AG"));
        result.add(generateList("AG"));
        result.add(generateList("AH"));
        result.add(generateList("GH"));
        result.add(generateList("GH"));
        result.add(generateList("DEF"));
        result.add(generateList("DEF"));
        result.add(generateList("DEF"));
        result.add(generateList("DE"));
        result.add(generateList("DE"));
        result.add(generateList("DF"));
        result.add(generateList("DF"));
        result.add(generateList("EF"));

        return result;
    }

    private List<List<String>> list1650() {
        List<List<String>> result = list825();
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("JKL"));
        result.add(generateList("JKL"));
        result.add(generateList("JKL"));
        result.add(generateList("IKL"));
        result.add(generateList("IKL"));
        result.add(generateList("IJK"));
        result.add(generateList("IJK"));
        result.add(generateList("IJK"));
        result.add(generateList("MN"));
        result.add(generateList("MN"));
        result.add(generateList("MN"));
        result.add(generateList("MN"));
        result.add(generateList("MN"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        result.add(generateList("O"));
        result.add(generateList("P"));
        return result;
    }

    private List<List<String>> list1675() {
        List<List<String>> result = list1650();
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJKL"));
        result.add(generateList("IJK"));
        result.add(generateList("IJK"));
        result.add(generateList("JKL"));
        result.add(generateList("JKL"));
        result.add(generateList("IKL"));
        result.add(generateList("IJ"));
        result.add(generateList("JK"));
        result.add(generateList("JK"));
        result.add(generateList("KL"));
        result.add(generateList("KL"));
        result.add(generateList("IK"));
        result.add(generateList("IL"));
        result.add(generateList("JK"));
        result.add(generateList("JL"));
        result.add(generateList("MN"));
        result.add(generateList("MN"));
        result.add(generateList("M"));
        result.add(generateList("N"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        result.add(generateList("OP"));
        return result;
    }

    /**
     * 生成基数map假数据
     * @return
     */
    public Map<String, Integer> generateCardinalityMap() {
        Map<String, Integer> cardinalityMap = new HashMap<>();
        cardinalityMap.put("GD_PREGENCY_RESULT.NORMALPRE", 3);
        cardinalityMap.put("GD_PREGENCY_RESULT.DEATHPRE", 3);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.FEDU_LEVEL", 7);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.FJOB", 15);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.FNATIONALTY", 58);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.RETARDATION", 3);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.SPECISAL_LOOK", 199);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.WEIGHT", 804);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.MNATIONALITY", 57);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.MEDU_LEVEL", 8);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.MJOB", 16);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.HAS_CONTENT", 4);
        cardinalityMap.put("GD_BASIC_INFO_DETAIL.ADDRESS_CITY", 322);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.BMI", 3613);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.HEART_RATE", 180);
        cardinalityMap.put("GD_PHYSICAL_EXAM_W.HIGHT_BLOOD_PRESSURE", 190);

        return cardinalityMap;
    }

    // 生成子列表
    private List<String> generateList(String str) {
        List<String> result = new ArrayList<>();
        // 生成代号、维度对应表
        Map<Character, String> map = new HashMap<>();
        map.put('A', "GD_PREGENCY_RESULT.NORMALPRE");
        map.put('B', "GD_PREGENCY_RESULT.DEATHPRE");
        map.put('C', "GD_BASIC_INFO_DETAIL.FEDU_LEVEL");
        map.put('D', "GD_BASIC_INFO_DETAIL.FJOB");
        map.put('E', "GD_BASIC_INFO_DETAIL.FNATIONALTY");
        map.put('F', "GD_PHYSICAL_EXAM_W.RETARDATION");
        map.put('G', "GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
        map.put('H', "GD_PHYSICAL_EXAM_W.WEIGHT");
        map.put('I', "GD_BASIC_INFO_DETAIL.MNATIONALITY");
        map.put('J', "GD_BASIC_INFO_DETAIL.MEDU_LEVEL");
        map.put('K', "GD_BASIC_INFO_DETAIL.MJOB");
        map.put('L', "GD_BASIC_INFO_DETAIL.HAS_CONTENT");
        map.put('M', "GD_BASIC_INFO_DETAIL.ADDRESS_CITY");
        map.put('N', "GD_PHYSICAL_EXAM_W.BMI");
        map.put('O', "GD_PHYSICAL_EXAM_W.HEART_RATE");
        map.put('P', "GD_PHYSICAL_EXAM_W.HIGHT_BLOOD_PRESSURE");

        char[] strings = str.toCharArray();
        for (int i = 0; i < strings.length; i++) {
            result.add(map.get(strings[i]));
        }
        return result;
    }

    // 生成dimensionSet（8维）
    public Set<String> generateDimensionSet8() {
        Set<String> result = new HashSet<>();
        result.add("GD_PREGENCY_RESULT.NORMALPRE");
        result.add("GD_PREGENCY_RESULT.DEATHPRE");
        result.add("GD_BASIC_INFO_DETAIL.FEDU_LEVEL");
        result.add("GD_BASIC_INFO_DETAIL.FJOB");
        result.add("GD_BASIC_INFO_DETAIL.FNATIONALTY");
        result.add("GD_PHYSICAL_EXAM_W.RETARDATION");
        result.add("GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
        result.add("GD_PHYSICAL_EXAM_W.WEIGHT");
        return result;
    }

    // 生成dimensionSet（16维）
    public Set<String> generateDimensionSet16() {
        Set<String> result = generateDimensionSet8();
        result.add("GD_BASIC_INFO_DETAIL.MNATIONALITY");
        result.add("GD_BASIC_INFO_DETAIL.MEDU_LEVEL");
        result.add("GD_BASIC_INFO_DETAIL.MJOB");
        result.add("GD_BASIC_INFO_DETAIL.HAS_CONTENT");
        result.add("GD_BASIC_INFO_DETAIL.ADDRESS_CITY");
        result.add("GD_PHYSICAL_EXAM_W.BMI");
        result.add("GD_PHYSICAL_EXAM_W.HEART_RATE");
        result.add("GD_PHYSICAL_EXAM_W.HIGHT_BLOOD_PRESSURE");
        return result;
    }

}
