package bupt.edu.cn.web.algorithm;

import java.util.*;

/**
 * @description:
 *      基因算法，作为实验对比项使用
 * @author: tc
 * @create: 2020/07/27 23:36
 */
public class GeneticAlgorithm {

    // 维度数量
    private int dimensionNum = 8;
    // 基因数量
    private int ChrNum = 10;
    // 族群
    private List<String> geneList = new ArrayList<>();
    // 最佳得分
    private Double bestScore = -1000.0;
    // 最优字符串
    private String bestStr = "";

    // 最佳得分下的平均查询时延和膨胀率
    private Double bestAvgQueryLatency = 0.0;
    private Double bestExpansionRate = 100.0;


    // 测试数据
    List<List<String>> dimensionCombinationList = new ArrayList<>();
    // 维度集合
    private Set<String> dimensionSet = new HashSet<>();
    // 基数map
    private Map<String, Integer> cardinalityMap = new HashMap<>();
    // 衰减系数
    private Double weakenParam = 2.0;

    /**
     * 主函数
     */
    public void run(Integer itrationNum, List<List<String>> dimensionCombinationList1, Map<String, Integer> cardinalityMap1, Set<String> dimensionSet1){
        // 接收参数
        dimensionCombinationList = dimensionCombinationList1;
        dimensionSet = dimensionSet1;
        cardinalityMap = cardinalityMap1;
        // 初始化族群
        geneList = initGeneList();
        for (int i = 0; i < geneList.size(); i++) {
            System.out.println(geneList.get(i));
        }
        for (int i = 0; i < itrationNum; i++) {
            // 选择
            List<String> selectedStr = select();
            // 交叉
            String crossedStr = cross(selectedStr);
            // 突变
            String mutatedStr = mutation(crossedStr);
            // 加入族群
            geneList.add(mutatedStr);
            System.out.println("第 " + i + " 次迭代：--------");
            System.out.println("最佳得分为：" + bestScore);
            System.out.println("平均查询时延：" + bestAvgQueryLatency);
            System.out.println("膨胀率：" + bestExpansionRate);
            System.out.println(bestStr);
        }

    }

    /**
     * 初始化一条染色体（用二进制字符串表示）
     */
    private String initChr() {
        String res = "";
        for (int i = 0; i < Math.pow(2, dimensionNum); i++) {
            if (Math.random() > 0.5) {
                res += "0";
            } else {
                res += "1";
            }
        }
        return res;
    }

    /**
     * 初始化一个种群(10个基因)
     */
    private List<String> initGeneList() {
        List<String> geneList = new ArrayList<>();
        for (int i = 0; i < ChrNum; i++) {
            geneList.add(initChr());
        }
        return geneList;
    }

    /**
     * 计算fitness
     */
    private Map<String, Double> calculateFitness(String str) {
        Map<String, Double> result = new HashMap<>();
        List<List<String>> aggregationGroupList = str2AggregationGroupList(str);

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
        // 计算膨胀率（基因算法中，膨胀率*3【因为生成树的关系，无法精确计算】）
        Double expansionRate = cubeSize / recordSize;
        result.put("expansionRate", expansionRate);

        // 计算综合得分
        Double score = 10.0 / avgQueryLatency;
        if (expansionRate > 3) {
//            score -= Math.sqrt(expansionRate - 3);
            score -= Math.log(expansionRate - 3);
        }
        score = (int)(score * 10) / 10.0;
        result.put("score", score);

        return result;
    }

    /**
     * 选择 select
     * 使用轮盘赌选择算法，选到的几率为fitness / totalFitness
     */
    private List<String> select(){
        List<String> result = new ArrayList<>();
        // 各染色体选择概率
        double p[] = new double[geneList.size()];
        // 计算fitness、p
        Double minScore = 1000.0;
        Double[] fitness = new Double[geneList.size()];
        for (int i = 0; i < geneList.size(); i++) {
            String str = geneList.get(i);
            Double score = calculateFitness(str).get("score");
            fitness[i] = score;
            if (score < minScore) {
                minScore = score;
            }
            if (score > bestScore) {
                bestScore = score;
                bestStr = geneList.get(i);
                bestAvgQueryLatency = calculateFitness(str).get("avgQueryLatency");
                bestExpansionRate = calculateFitness(str).get("expansionRate");
            }
        }
        Double totalFitness = 0.0;
        for (int i = 0; i < fitness.length; i++) {
            fitness[i] = fitness[i] - minScore + 1;
            totalFitness += fitness[i];
        }
        for (int i = 0; i < fitness.length; i++) {
            p[i] = fitness[i] / totalFitness;
        }
        // 选择两个基因
        while (result.size() < 2) {
            for (int i = 0; i < geneList.size(); i++) {
                Double r = Math.random();
                if (p[i] > r) {
                    result.add(geneList.get(i));
                }
            }
        }

        return result;
    }

    /**
     * 交叉（单点交叉，11 --> 1，其余为0）
     * @param selectedStr
     * @return
     */
    private String cross(List<String> selectedStr) {
        String result = "";

        for (int i = 0; i < selectedStr.get(0).length(); i++) {
            if (selectedStr.get(0).charAt(i) == '1' && selectedStr.get(1).charAt(i) == '1'){
                result += "1";
            }else {
                result += "0";
            }
        }

        return result;
    }

    /**
     * 基因突变（1%比例）
     * @param str
     * @return
     */
    private String mutation(String str) {
        char[] strings = str.toCharArray();
        for (int i = 0; i < Math.pow(2, dimensionNum); i++) {
            int num = (int)(Math.random() * Math.pow(2, dimensionNum));
            if (strings[num] == '0') {
                strings[num] = '1';
            }else {
                strings[num] = '0';
            }
        }

        return String.valueOf(strings);
    }


    /**
     * ------------------------------------------下面是工具函数----------------------------------------------
     */

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

    /**
     * 将基因字符串转换成聚合组列表
     * @param str
     * @return
     */
    private List<List<String>> str2AggregationGroupList(String str) {
        List<List<String>> result = new ArrayList<>();
        Set<String> tempSet = new HashSet<>(dimensionSet);
        char[] strings = str.toCharArray();
        for (int i = 0; i < strings.length; i++) {
            if (strings[i] == '1') {
                List<String> list = posNum2DimensionList(i);
                if (!alreadyInGroup(list, result)) {
                    result.add(list);
                    for (int j = 0; j < list.size(); j++) {
                        tempSet.remove(list.get(j));
                    }
                }
            }
        }
        result.add(new ArrayList<>(tempSet));
        return result;
    }

    // 位数 --> 维度列表（如：第0位 --> ABCDEFG）
    private List<String> posNum2DimensionList(int posNum) {
        List<String> result = new ArrayList<>();
        // 序列 -- 维度 对照表
        Map<Integer, String> map = new HashMap<>();
        map.put(0, "GD_PREGENCY_RESULT.NORMALPRE");
        map.put(1, "GD_PREGENCY_RESULT.DEATHPRE");
        map.put(2, "GD_BASIC_INFO_DETAIL.FEDU_LEVEL");
        map.put(3, "GD_BASIC_INFO_DETAIL.FJOB");
        map.put(4, "GD_BASIC_INFO_DETAIL.FNATIONALTY");
        map.put(5, "GD_PHYSICAL_EXAM_W.RETARDATION");
        map.put(6, "GD_PHYSICAL_EXAM_W.SPECISAL_LOOK");
        map.put(7, "GD_PHYSICAL_EXAM_W.WEIGHT");
        map.put(8, "GD_BASIC_INFO_DETAIL.MNATIONALITY");
        map.put(9, "GD_BASIC_INFO_DETAIL.MEDU_LEVEL");
        map.put(10, "GD_BASIC_INFO_DETAIL.MJOB");
        map.put(11, "GD_BASIC_INFO_DETAIL.HAS_CONTENT");
        map.put(12, "GD_BASIC_INFO_DETAIL.ADDRESS_CITY");
        map.put(13, "GD_PHYSICAL_EXAM_W.BMI");
        map.put(14, "GD_PHYSICAL_EXAM_W.HEART_RATE");
        map.put(15, "GD_PHYSICAL_EXAM_W.HIGHT_BLOOD_PRESSURE");
        // 位数 转换
        Integer num = (int)Math.pow(2, dimensionNum) - 2 - posNum;
        int count = dimensionNum - 1;
        while (num > 0) {
            if (num % 2 == 1) {
                result.add(map.get(count));
            }
            num /= 2;
            count--;
        }
        Collections.reverse(result);
        return result;
    }

    // 判断list是否已在聚合组集合中
    // 使用了包含逻辑进行修正，即：AB包含于ABC
    private boolean alreadyInGroup(List<String> list, List<List<String>> group) {
        boolean result = false;
        for (int i = 0; i < group.size(); i++) {
            List<String> temp = group.get(i);
            if (aIncludedInB(list, temp)) {
                return true;
            }
        }
        return result;
    }

    private boolean aIncludedInB(List<String> a, List<String> b) {
        int i = 0;
        int gap = 0;
        while (i < a.size() && i + gap < b.size()) {
            if (!a.get(i).equals(b.get(i + gap))) {
                gap++;
            }else {
                i++;
            }
        }
        if (i < a.size() && i + gap >= b.size()) {
            return false;
        }else {
            return true;
        }
    }

}
