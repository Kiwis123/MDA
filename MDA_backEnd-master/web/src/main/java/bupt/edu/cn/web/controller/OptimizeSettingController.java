package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.OptimizeSetting;
import bupt.edu.cn.web.repository.OptimizeSettingRepository;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.json.JSONString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;


/**
 * @description:
 * @author: tc
 * @create: 2020/06/29 12:09
 */
@RestController
@RequestMapping("/optimizeSetting")
public class OptimizeSettingController {

    @Autowired
    OptimizeSettingRepository optimizeSettingRepository;
    @Autowired
    KylinQueryService kylinQueryService;

    /**
     * 保存cube优化项设置（包括全局、cube）
     * @return
     */
    @RequestMapping(value = "/saveOptimizeSetting", method = RequestMethod.POST)
    public ReturnModel saveOptimizeSetting(String cubeName, boolean aggregationGroupPrefer, Integer queryCountWeight, Integer cardinalityWeight,
                                           Integer gapDay, Integer missRate, Double queryLatency, String cubeAggregationGroup){
        ReturnModel result = new ReturnModel();

        OptimizeSetting optimizeSetting = optimizeSettingRepository.findByCubeName(cubeName);
        if (optimizeSetting == null) {
            optimizeSetting = new OptimizeSetting();
        }

        optimizeSetting.setCubeName(cubeName);
        optimizeSetting.setAggregationGroupPrefer(aggregationGroupPrefer);
        optimizeSetting.setQueryCountWeight(queryCountWeight);
        optimizeSetting.setCardinalityWeight(cardinalityWeight);
        optimizeSetting.setGapDay(gapDay);
        optimizeSetting.setMissRate(missRate);
        optimizeSetting.setQueryLatency(queryLatency);

        if (!"global".equals(cubeName)) {
            System.out.println(cubeAggregationGroup);
            optimizeSetting.setCubeAggregationGroup(cubeAggregationGroup);
        }

        try {
            optimizeSettingRepository.saveAndFlush(optimizeSetting);
            result.setResult(true);
            result.setDatum(optimizeSetting);
        }catch (Exception e) {
            System.out.println(e);
            result.setResult(false);
        }

        return result;
    }


    /**
     * 获取cube优化项设置（包括全局、cube）
     * @return
     */
    @RequestMapping(value = "/getOptimizeSetting", method = RequestMethod.GET)
    public ReturnModel getOptimizeSetting(String cubeName){
        ReturnModel result = new ReturnModel();

        OptimizeSetting optimizeSetting = optimizeSettingRepository.findByCubeName(cubeName);
        result.setDatum(optimizeSetting);
        result.setResult(true);

        return result;
    }


    /**
     * 获取cube列表
     * @return
     */
    @RequestMapping(value = "/getCubeList", method = RequestMethod.GET)
    public ReturnModel getCubeList(){
        ReturnModel result = new ReturnModel();
        List<String> cubeList = new ArrayList<>();

        kylinQueryService.login("KYLIN", "ADMIN");
        String cubes = kylinQueryService.listCubes(0, 50000, "", "KylinAutoModeling");
        JSONArray cubesJson = JSON.parseArray(cubes);
        for (int i = 0; i < cubesJson.size(); i++) {
            JSONObject cube = cubesJson.getJSONObject(i);
            System.out.println(cubesJson.get(i));
            cubeList.add(cube.getString("descriptor"));
        }
        result.setDatum(cubeList);
        result.setResult(true);

        return result;
    }


    /**
     * 获取cube的dimension列表
     * @return
     */
    @RequestMapping(value = "/getDimensionListByCube", method = RequestMethod.GET)
    public ReturnModel getDimensionListByCube(String cubeName){
        ReturnModel result = new ReturnModel();
        List<String> dimensionList = new ArrayList<>();

        kylinQueryService.login("KYLIN", "ADMIN");
        System.out.println(kylinQueryService.getCubeDes(cubeName));
        JSONArray tmp = JSON.parseArray(kylinQueryService.getCubeDes(cubeName));
        JSONObject cube = tmp.getJSONObject(0);
        JSONArray dimensionArray = cube.getJSONArray("dimensions");
        for (int i = 0; i < dimensionArray.size(); i++) {
            JSONObject dimension = dimensionArray.getJSONObject(i);
            System.out.println(dimension.getString("name"));
            dimensionList.add(dimension.getString("name"));
        }

        result.setDatum(dimensionList);
        result.setResult(true);

        return result;
    }

}
