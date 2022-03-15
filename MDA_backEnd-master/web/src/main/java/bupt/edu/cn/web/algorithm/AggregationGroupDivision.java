package bupt.edu.cn.web.algorithm;

import java.util.*;

/**
 * @description:
 *      场景：运行时的Cube优化 -- 重新划分聚合组
 *      是一种基于带权图的、有重叠的聚合组划分
 * @author: tc
 * @create: 2020/07/14 00:07
 */
public class AggregationGroupDivision {


    // 无向带权图
    public Map<String, Map<String, Integer>> weightedGraph;
    // 维度集合
    private Set<String> dimensionSet;
    // 衰减系数
    private Double weakenParam = 2.0;

    /**
     * 生成聚合组划分结果
     * @param dimensionCombinationList 维度组合列表
     * @param cardinalityMap 基数map
     * @param weightThreshold 平均权重阈值
     * @return 聚合组列表（每一项为一个聚合组）
     */
    public Map<String, Object> aggregationGroupList(List<List<String>> dimensionCombinationList, Map<String, Integer> cardinalityMap, Double weightThreshold) {

        Map<String, Object> result = new HashMap<>();
        List<List<String>> aggregationGroupList = new ArrayList<>();
        // 初始化无向带权图
        initWeightedGraph(dimensionCombinationList);

        // 结束条件1：所有的维度均已在聚合组中，使用allDimensionInGroup判断
        Map<String, Boolean> dimensionContainedMap = new HashMap<>();
        for (String dimension: dimensionSet) {
            dimensionContainedMap.put(dimension, false);
        }

        // 开始算法步骤
        boolean newGroup = true;
        List<String> aggregationGroup = new ArrayList<>();
        // 最外面循环为【结束条件1】
        while (!allDimensionInGroup(dimensionContainedMap)) {
            // 新建聚合组，并添加广度较高的节点
            if (newGroup) {
                aggregationGroup = new ArrayList<>();
                String startVertex = chooseStartVertex(dimensionContainedMap);
                aggregationGroup.add(startVertex);
                dimensionContainedMap.put(startVertex, true);
                newGroup = false;
                continue;
            }
            // 遍历dimensionSet，计算平均权重，将最佳节点加入聚合组中
            if (!addBestVertexToGroup(aggregationGroup, dimensionContainedMap, weightThreshold)) {
                // 如果添加失败【结束条件2】，封闭聚合组并添加至result中
                aggregationGroupList.add(new ArrayList<>(aggregationGroup));
                // 至新聚合组标志为true
                newGroup = true;
            }
        }
        aggregationGroupList.add(aggregationGroup);

        Map<String, Double> evaluationIndex = aggregationGroupEvaluate(aggregationGroupList, dimensionCombinationList, cardinalityMap);

        result.put("聚合组划分结果", aggregationGroupList);
        result.put("平均查询时延（估算）", evaluationIndex.get("avgQueryLatency"));
        // 膨胀率转换格式，百分比，保留一位小数
        String expansionRateStr = ((int)(evaluationIndex.get("expansionRate") * 1000) / 10.0) + "%";
        result.put("膨胀率", expansionRateStr);
        result.put("总体得分", evaluationIndex.get("score"));


        return result;
    }


    /**
     * -------------------------------------------------------下面是工具函数-------------------------------------------------------
     */

    /**
     * 初始化无向带权图
     * @param dimensionCombinationList
     * @return
     */
    public void initWeightedGraph(List<List<String>> dimensionCombinationList) {
        weightedGraph = new HashMap<>();
        dimensionSet = new HashSet<>();
        for (int i = 0; i < dimensionCombinationList.size(); i++) {
            List<String> dimensionCombination = dimensionCombinationList.get(i);
            // 遍历一个维度组合，将其加入带权图中
            for (int j = 0; j < dimensionCombination.size(); j++) {
                dimensionSet.add(dimensionCombination.get(j));
                for (int k = 0; k < dimensionCombination.size(); k++) {
                    if (j == k) {
                        continue;
                    }
                    String startVertex = dimensionCombination.get(j);
                    String endVertex = dimensionCombination.get(k);
                    Integer edgeWeight = getEdgeWeight(startVertex, endVertex);
                    // 若两节点之间已有边
                    if (edgeWeight != 0) {
                        // 权重+1
                        weightedGraph.get(startVertex).put(endVertex, edgeWeight + 1);
                    }else {
                        //若两节点之间没有边，进行初始化，并赋值1
                        if (!weightedGraph.containsKey(startVertex)) {
                            Map<String, Integer> map = new HashMap<>();
                            map.put(endVertex, 1);
                            weightedGraph.put(startVertex, map);
                        }else {
                            weightedGraph.get(startVertex).put(endVertex, 1);
                        }
                    }
                }
            }
        }


    }

    /**
     * 根据起点和终点查询边的权重
     *       起点、终点可互换，图为无向图，在存储时有数据冗余（双向边均存储）
     * @param startVertex 起点
     * @param endVertex 终点
     * @return
     */
    private Integer getEdgeWeight(String startVertex, String endVertex) {
        if (!weightedGraph.containsKey(startVertex) || !weightedGraph.get(startVertex).containsKey(endVertex)) {
            return 0;
        }else {
            return weightedGraph.get(startVertex).get(endVertex);
        }
    }

    /**
     * 判断是否所有维度均已被划分至聚合组中
     * @param dimensionContainedMap
     * @return
     */
    private boolean allDimensionInGroup(Map<String, Boolean> dimensionContainedMap) {
        for (String dimension: dimensionSet) {
            if (!dimensionContainedMap.get(dimension)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 选取聚合组的起始节点
     *      需要该节点不在其他任何聚合组中，且广度（与其他节点的连接数）较高
     * @param dimensionContainedMap
     * @return
     */
    private String chooseStartVertex(Map<String, Boolean> dimensionContainedMap) {
        String result = "";
        for (String dimension: dimensionSet) {
            if (!dimensionContainedMap.get(dimension)) {
                if ("".equals(result)) {
                    result = dimension;
                }else {
                    // 取广度较高的节点为result
                    int oldBroad = weightedGraph.get(result).size();
                    int newBroad = weightedGraph.get(dimension).size();
                    if (newBroad > oldBroad) {
                        result = dimension;
                    }
                }
            }
        }
        return result;
    }

    /**
     * 计算平均权重，将平均权重最大的节点加入聚合组中
     *      > 如果最大的平均权重小于权重阈值，则返回false，以便上层函数结束循环
     * @param aggregationGroup
     * @param dimensionContainedMap
     * @param weightThreshold 平均权重阈值
     * @return
     */
    private boolean addBestVertexToGroup(List<String> aggregationGroup, Map<String, Boolean> dimensionContainedMap, Double weightThreshold) {
        String bestVertex = "";
        Double bestAvgWeight = -1.0;
        // 未加入聚合组的节点集合
        Set<String> unChoosedDimensionSet = new HashSet<>();
        for (String dimension: dimensionSet) {
            if (!dimensionInList(dimension, aggregationGroup)) {
                unChoosedDimensionSet.add(dimension);
            }
        }
        // 遍历该集合，逐个计算平均权重
        for (String dimension: unChoosedDimensionSet) {
            List<String> tempList = new ArrayList<>(aggregationGroup);
            tempList.add(dimension);
            Double totalWeight = 0.0;
            // 将此轮尝试的节点加入tempList中，一起加和得出总权重，再除以边数求平均
            for (int i = 0; i < tempList.size(); i++) {
                for (int j = 0; j < tempList.size(); j++) {
                    if (i == j) {
                        continue;
                    }
                    totalWeight += getEdgeWeight(tempList.get(i), tempList.get(j));
                }
            }
            Double avgWeight = totalWeight / (tempList.size() * (tempList.size() - 1));
            if (avgWeight > bestAvgWeight) {
                bestAvgWeight = avgWeight;
                bestVertex = dimension;
            }
        }
        // 结束条件2：最大平均权重小于权重阈值，则结束当轮的添加节点，封闭聚合组
        if (bestAvgWeight >= weightThreshold) {
            aggregationGroup.add(bestVertex);
            // 至“已添加”标志位为true
            dimensionContainedMap.put(bestVertex, true);
            return true;
        }else {
            return false;
        }
    }

    // 判断维度是否已在聚合组中
    private boolean dimensionInList(String dimension, List<String> aggregationGroup) {
        for (String temp: aggregationGroup) {
            if (dimension.equals(temp)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 计算聚合组划分结果的 评价指标
     *      包括：平均查询时延、膨胀率
     * @param aggregationGroupList 聚合组结果列表
     * @param dimensionCombinationList 源数据列表
     * @return
     */
    private Map<String, Double> aggregationGroupEvaluate(List<List<String>> aggregationGroupList, List<List<String>> dimensionCombinationList, Map<String, Integer> cardinalityMap) {
        Map<String, Double> result = new HashMap<>();

        /**
         * 估算平均查询时延
         */
        // 计算baseCuboid的行数（如没有精确命中，则从此cuboid开始推算）
        Double baseCuboidRow = 0.0001;
        if (dimensionSet.size() > 4) {
            for (String dimension: dimensionSet) {
                baseCuboidRow *= weakenRow(cardinalityMap.get(dimension));
            }
        }else {
            for (String dimension: dimensionSet) {
                baseCuboidRow *= cardinalityMap.get(dimension) / weakenParam;
            }
        }

        // 遍历聚合组列表，计算评价指标
        // 两个“行数”都需要被衰减（通过衰减函数weakenRow），且单位为：万行
        Double totalQueryLatency = 0.0;
        for (List<String> dimensionCombination: dimensionCombinationList) {
            // 扫描行数
            Double scanRow = 0.0001;
            if (preciseHit(dimensionCombination, aggregationGroupList)) {
                for (String dimension: dimensionCombination) {
                    scanRow *= cardinalityMap.get(dimension) / weakenParam;
                }
            }else {
                scanRow = baseCuboidRow;
            }
            // 结果行数
            Double resultRow = 0.0001;
            for (String dimension: dimensionCombination) {
                resultRow *= cardinalityMap.get(dimension) / weakenParam;
            }
            Double queryLatency = estimateQueryLatency(scanRow, resultRow);
            totalQueryLatency += queryLatency;
        }
        // 平均查询时延
        Double avgQueryLatency = totalQueryLatency / dimensionCombinationList.size();
        // 小数点后三位
        avgQueryLatency = (int)(avgQueryLatency * 1000) / 1000.0;
        result.put("avgQueryLatency", avgQueryLatency);


        /**
         * 测试衰减函数
         */
//        System.out.println("开始测试衰减函数~~~~~~~");
//        List<String> list = new ArrayList<>();
//        list.add("GD_PREGENCY_RESULT.NORMALPRE");
//        list.add("GD_PREGENCY_RESULT.DEATHPRE");
//        list.add("GD_BASIC_INFO_DETAIL.FEDU_LEVEL");
//        list.add("GD_BASIC_INFO_DETAIL.FJOB");
//        list.add("GD_BASIC_INFO_DETAIL.FNATIONALTY");
//        list.add("GD_PHYSICAL_EXAM_W.RETARDATION");
//        list.add("GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
//        list.add("GD_PHYSICAL_EXAM_W.WEIGHT");
//        list.add("GD_BASIC_INFO_DETAIL.MNATIONALITY");
//        list.add("GD_BASIC_INFO_DETAIL.MEDU_LEVEL");
//        list.add("GD_BASIC_INFO_DETAIL.MJOB");
//        list.add("GD_BASIC_INFO_DETAIL.HAS_CONTENT");
//        list.add("GD_BASIC_INFO_DETAIL.ADDRESS_CITY");
//        list.add("GD_PHYSICAL_EXAM_W.BMI");
//        list.add("GD_PHYSICAL_EXAM_W.HEART_RATE");
//        list.add("GD_PHYSICAL_EXAM_W.HIGHT_BLOOD_PRESSURE");
//
//        Double row = 0.0001;
//        Double weakenRow1 = 0.0001;
//        for (int i = 0; i < list.size(); i++) {
//            String dimension = list.get(i);
//            if (i < 4) {
//                weakenRow1 *= cardinalityMap.get(dimension) / weakenParam;
//            }else {
//                weakenRow1 *= weakenRow(cardinalityMap.get(dimension));
//            }
//        }
//        System.out.println(row);
//        System.out.println(weakenRow1);
//        System.out.println("测试结束~~~~~~~");


        /**
         * 估算膨胀率
         * TODO: 使用真数据时，将100万行替换为hive宽表行数
         */
        // 原始宽表大小
        // 暂时写死：100万行 * 维度数 的数据规模
        Double recordSize = 100.0 * dimensionSet.size();
        // Cube大小
        Double cubeSize = 0.0;
        for (List<String> aggregationGroup: aggregationGroupList) {
            Double cuboidSize = 0.0001;
            for (int i = 0; i < aggregationGroup.size(); i++) {
                String dimension = aggregationGroup.get(i);
                if (i < 4) {
                    cuboidSize *= cardinalityMap.get(dimension) / weakenParam * aggregationGroup.size();
                }else {
                    cuboidSize *= weakenRow(cardinalityMap.get(dimension)) * aggregationGroup.size();
                }
            }
            cubeSize += cuboidSize;
        }
        // 计算膨胀率
        Double expansionRate = cubeSize / recordSize;
        result.put("expansionRate", expansionRate);

        // 计算综合得分
        Double score = 10.0 / avgQueryLatency;
        if (expansionRate > 3) {
            score -= Math.log(expansionRate - 3);
        }
        score = (int)(score * 10) / 10.0;
        result.put("score", score);

        return result;
    }

    // 判断是否精确命中
    private boolean preciseHit(List<String> dimensionCombination, List<List<String>> aggregationGroupList) {
        for (List<String> aggregationGroup: aggregationGroupList) {
            // 取交集，若交集与原列表相同，则精确命中
            List<String> tempList = new ArrayList<>(dimensionCombination);
            tempList.retainAll(aggregationGroup);
            if (dimensionCombination.size() == tempList.size()) {
                return true;
            }
        }
        return false;
    }

    // 基数衰减函数【4维以上的场景使用】
    private Double weakenRow(Integer row) {
        // 大于1000的维度过于爆炸，不与其他维度产生关联，直接返回1.5；
        // 其余皆把累乘的成熟衰减至 1 ~ 3 的范围内即可
        if (row >= 1000) {
            return 1.5;
        }else if (row >= 500) {
            return row / 400.0;
        }else if (row >= 200) {
            return row / 160.0;
        }else if (row >= 80) {
            return row / 64.0;
        }else if (row >= 30) {
            return row / 24.0;
        }else if (row >= 10) {
            return row / 8.0;
        }else if (row >= 3) {
            return row / 2.4;
        }
        return row / 1.0;
    }

    /**
     * 根据数据规模估算查询时延
     *      参数为实验得出的经验值
     * @param scanRow
     * @param resultRow
     * @return
     */
    private Double estimateQueryLatency(Double scanRow, Double resultRow) {
        Double scanLatency = 0.0;
        if (scanRow < 0.1) {
            scanLatency = scanRow * 2.28;
        }else if (scanRow < 2) {
            scanLatency = scanRow * 0.206;
        }else {
            scanLatency = scanRow * 0.017;
        }
        Double resultLatency = 0.0;
        if (scanRow < 0.1) {
            resultLatency = resultRow * 5.22;
        }else if (scanRow < 2) {
            resultLatency = resultRow * 0.571;
        }else {
            resultLatency = resultRow * 0.263;
        }
        return 0.3 + scanLatency + resultLatency;
    }

}
