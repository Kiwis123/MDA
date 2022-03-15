package bupt.edu.cn.web.controller;

import bupt.edu.cn.web.algorithm.GeneticAlgorithm;
import bupt.edu.cn.web.common.ReturnModel;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

/**
 * @description:
 *      做算法对比实验使用
 * @author: tc
 * @create: 2020/07/27 23:51
 */
@RestController
@RequestMapping("/algorithmTest")
public class AlgorithmTestController {

    /**
     * 测试运行时Cube优化的功能
     * @return
     */
    @RequestMapping(value = "/run", method = RequestMethod.GET)
    public ReturnModel run(Integer itrationNum, Integer dimensionNum, Integer listNum){
        ReturnModel result = new ReturnModel();

        RunningOptimizeController runningOptimizeController = new RunningOptimizeController();
        // 生成假数据（原始数据）
        List<List<String>> dimensionCombinationList = runningOptimizeController.generateDimensionCombinationList(dimensionNum, listNum);
        Map<String, Integer> cardinalityMap = runningOptimizeController.generateCardinalityMap();
        Set<String> dimensionSet = new HashSet<>();
        if (dimensionNum == 8) {
            dimensionSet = runningOptimizeController.generateDimensionSet8();
        }else {
            dimensionSet = runningOptimizeController.generateDimensionSet16();
        }

        System.out.println(dimensionCombinationList);
        System.out.println(cardinalityMap);
        System.out.println(dimensionSet);

        GeneticAlgorithm geneticAlgorithm = new GeneticAlgorithm();
        geneticAlgorithm.run(itrationNum,dimensionCombinationList, cardinalityMap, dimensionSet);



        return result;
    }

}
