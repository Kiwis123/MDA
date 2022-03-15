package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.CubeStatus;
import bupt.edu.cn.web.repository.CubeStatusRepository;
import bupt.edu.cn.web.repository.QueriedSqlRepository;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @description:
 *      为“查询引擎概览”页面提供数据
 * @author: tc
 * @create: 2020/06/22 22:48
 */
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    QueriedSqlRepository queriedSqlRepository;
    @Autowired
    CubeStatusRepository cubeStatusRepository;
    @Autowired
    KylinQueryService kylinQueryService;

    /**
     * 统计总查询次数&各引擎查询次数
     * @return
     */
    @RequestMapping(value = "/queryCount", method = RequestMethod.GET)
    public ReturnModel queryCount(Integer projectId){
        ReturnModel result = new ReturnModel();
        Map<String, BigInteger> queryCount = new HashMap<>();
        BigInteger totalCount = queriedSqlRepository.count(projectId);
        System.out.println(totalCount);
        queryCount.put("total", totalCount);
        List list = queriedSqlRepository.countByQueryEngine(projectId);
        for (Object row: list) {
            Object[] cells = (Object[]) row;
            queryCount.put((String) cells[0], (BigInteger) cells[1]);
        }
        result.setDatum(queryCount);
        result.setResult(true);

        return result;
    }


    /**
     * 按月统计平均查询时延，并计算月环比增长率
     * @return
     */
    @RequestMapping(value = "/getQueryLatencyByMonth", method = RequestMethod.GET)
    public ReturnModel getQueryLatencyByMonth(Integer projectId){
        ReturnModel result = new ReturnModel();
        // 近一个月的平均查询时延，单位s，精确到小数点后两位
        Double latency = (int)(queriedSqlRepository.countLatencyLastMonth(1) / 10) / 100.0;
        // 上个月的平均查询时延
        Double latencyOld = (int)(queriedSqlRepository.countLatencyLastTwoMonth(1) / 10) / 100.0;
        Double changeValue = (int)(latency - latencyOld * 100) / 100.0;
        Map<String, String> map = new HashMap<>();
        map.put("value", latency + "s");
        map.put("changeType", changeType(changeValue.toString()));
        map.put("changeValue", Math.abs(changeValue) + "s");
        result.setDatum(map);
        result.setResult(true);

        return result;
    }


    /**
     * 按月统计Cube个数、大小、平均膨胀率，并计算环比增长【当前状态与近一个月的比较】
     * @return
     */
    @RequestMapping(value = "/getCubeStatusByMonth", method = RequestMethod.GET)
    public ReturnModel getCubeStatusByMonth(Integer projectId){
        ReturnModel result = new ReturnModel();
        // 获取当前cube状态
        Map<String, Object> currentCube = getCubeStatus("kylinAutoModeling");
        Integer cubeNum = (int) currentCube.get("cubeNum");
        Double cubeSize = (Double) currentCube.get("cubeSize");
        Double expansionRate = (Double) currentCube.get("expansionRate");
        // 统计近一个月（-1 ~ -31天）的cube状态
        Integer cubeNumOld = (int)Math.round(cubeStatusRepository.countCubeNumLastMonth(projectId));
        Double cubeSizeOld = cubeStatusRepository.countCubeSizeLastMonth(projectId);
        Double expansionRateOld = cubeStatusRepository.countExpansionRateLastMonth(projectId);
        // 整理返回数据
        JSONArray datum = new JSONArray();
        // 1、cube个数
        JSONObject cubeNumJson = new JSONObject();
        cubeNumJson.put("name", "cubeNum");
        cubeNumJson.put("value", cubeNum);
        Integer cubeNumChangeValue = cubeNum - cubeNumOld;
        cubeNumJson.put("changeType", changeType(cubeNumChangeValue.toString()));
        cubeNumJson.put("changeValue", Math.abs(cubeNumChangeValue));
        datum.add(cubeNumJson);
        // 2、cube大小
        JSONObject cubeSizeJson = new JSONObject();
        cubeSizeJson.put("name", "cubeSize");
        cubeSizeJson.put("value", (int)(cubeSize * 100) / 100.0 + "GB");
        Double cubeSizeChangeValue = cubeSize - cubeSizeOld;
        cubeSizeJson.put("changeType", changeType(cubeSizeChangeValue.toString()));
        cubeSizeJson.put("changeValue", Math.abs((int)(cubeSizeChangeValue * 100) / 100.0) + "GB");
        datum.add(cubeSizeJson);
        // 3、膨胀率
        JSONObject expansionRateJson = new JSONObject();
        expansionRateJson.put("name", "expansionRate");
        expansionRateJson.put("value", (int)(expansionRate * 1000) / 10.0 + "%");
        Double expansionRateChangeValue = expansionRate - expansionRateOld;
        expansionRateJson.put("changeType", changeType(expansionRateChangeValue.toString()));
        expansionRateJson.put("changeValue", Math.abs((int)(expansionRateChangeValue * 1000) / 10.0) + "%");
        datum.add(expansionRateJson);

        result.setDatum(datum);
        result.setResult(true);

        return result;
    }


    /**
     * 统计并保存Cube个数、大小、平均膨胀率（使用场景：构建后的保存）
     * @return
     */
    @RequestMapping(value = "/saveCubeStatusByMonth", method = RequestMethod.POST)
    public ReturnModel saveCubeStatusByMonth(Integer projectId){
        ReturnModel result = new ReturnModel();
        CubeStatus cubeStatus = new CubeStatus();
        Map map = getCubeStatus("kylinAutoModeling");
        int cubeNum = (int)map.get("cubeNum");
        Double cubeSize = (Double) map.get("cubeSize");
        Double expansionRate = (Double) map.get("expansionRate");
        cubeStatus.setCubeNum(cubeNum);
        cubeStatus.setCubeSize(cubeSize);
        cubeStatus.setExpansionRate(expansionRate);
        cubeStatus.setProjectId(projectId);
        cubeStatus.setTime(new Timestamp(System.currentTimeMillis()));
        try {
            cubeStatusRepository.saveAndFlush(cubeStatus);
            result.setResult(true);
            result.setDatum(cubeStatus);
        }catch (Exception e) {
            System.out.println(e);
            result.setResult(false);
        }

        return result;
    }


    /**
     * 统计多个月份的膨胀率、平均查询时延
     *      为折线图提供数据
     * @return
     */
    @RequestMapping(value = "/getExpansionAndLatencyByMultipleMonth", method = RequestMethod.GET)
    public ReturnModel getExpansionAndLatencyByMultipleMonth(Integer projectId){
        ReturnModel result = new ReturnModel();
        JSONArray month = new JSONArray();
        JSONArray expansionRate = new JSONArray();
        JSONArray queryLatency = new JSONArray();
        // 统计膨胀率
        List list1 = cubeStatusRepository.countExpansionRateMultipleMonth(projectId);
        for (Object row: list1) {
            Object[] cells = (Object[]) row;
            expansionRate.add((int)((double)cells[0] * 1000) / 10.0);
            month.add("2020." + cells[1]);
        }
        // 统计查询时延
        List list2 = queriedSqlRepository.countQueryLatencyMultipleMonth(projectId);
        for (Object row: list2) {
            Object[] cells = (Object[]) row;
            System.out.println(cells[0]);
            Double latency = Double.valueOf(((BigDecimal) cells[0]).toString());
            System.out.println(latency);
            // 单位ms --> s，取小数点后两位
            latency = (int)(latency / 10) / 100.0;
            queryLatency.add(latency);
        }
        // 整理到result中
        JSONObject datum = new JSONObject();
        datum.put("month", month);
        datum.put("expansionRate", expansionRate);
        datum.put("queryLatency", queryLatency);
        result.setDatum(datum);
        result.setResult(true);

        return result;
    }


    /**
     * 统计各查询引擎对应的查询次数、平均查询时延
     *      为柱状图提供数据
     * @return
     */
    @RequestMapping(value = "/getQueryCountAndLatencyByQueryEngine", method = RequestMethod.GET)
    public ReturnModel getQueryCountAndLatencyByQueryEngine(Integer projectId){
        ReturnModel result = new ReturnModel();
        JSONArray queryEngine = new JSONArray();
        JSONArray queryCount = new JSONArray();
        JSONArray queryLatency = new JSONArray();
        // 统计查询次数
        List list1 = queriedSqlRepository.countByQueryEngine(projectId);
        for (Object row: list1) {
            Object[] cells = (Object[]) row;
            System.out.println(cells[0]);
            System.out.println(cells[1]);
            queryCount.add(Integer.valueOf(cells[1].toString()));
            queryEngine.add(cells[0]);
        }
        // 统计平均查询时延
        List list2 = queriedSqlRepository.countQueryLatencyByQueryEngine(projectId);
        for (Object row: list2) {
            Object[] cells = (Object[]) row;
            System.out.println(cells[0]);
            System.out.println(cells[1]);
            Double latency = Double.parseDouble(cells[0].toString());
            // 单位ms --> s，取小数点后两位
            latency = (int)(latency / 10) / 100.0;
            queryLatency.add(latency);
        }
        // 整理到result中
        JSONObject datum = new JSONObject();
        datum.put("queryEngine", queryEngine);
        datum.put("queryCount", queryCount);
        datum.put("queryLatency", queryLatency);
        result.setDatum(datum);
        result.setResult(true);

        return result;
    }











    /**
     * ------------------------------------------------------下面是工具函数------------------------------------------------------
     */

    /**
     * 获取当前Cube状态：
     *      cube个数，大小，平均膨胀率
     * @return
     */
    public Map<String, Object> getCubeStatus(String projectName) {
        Map<String, Object> result = new HashMap<>();
        kylinQueryService.login("ADMIN", "KYLIN");
        String cubes = kylinQueryService.listCubes(0, 50000, "", projectName);
        JSONArray cubesJson = JSON.parseArray(cubes);
        // cube个数、cube总体积，cube总膨胀率
        int cubeNum = 0;
        Double totalCubeSize = 0.0;
        Double totalExpansionRate = 0.0;
        // 遍历cube获取信息
        for (int i = 0; i < cubesJson.size(); i++) {
            JSONObject cube = cubesJson.getJSONObject(i);
            if ("READY".equals(cube.getString("status"))) {
                cubeNum++;
                // 获取cube大小，单位KB
                Integer cubeSize = cube.getInteger("size_kb");
                // 获取原始数据大小，单位B
                Integer recordSize = cube.getInteger("input_records_size");
                totalCubeSize = totalCubeSize + cubeSize / 1024;
                Double expansionRate = cubeSize * 1024.0 / recordSize;
                totalExpansionRate = totalExpansionRate + expansionRate;
            }
        }
        // 计算并整理数据格式(不带单位，最原始的格式，例如：60% == 0.6；0.123G == 0.123)
        Double expansionRate = totalExpansionRate / cubeNum;
        totalCubeSize = totalCubeSize / 1024;
        result.put("cubeNum", cubeNum); // 单位：个
        result.put("cubeSize", totalCubeSize); // 单位：G
        result.put("expansionRate", expansionRate); // 单位：无（60% == 0.6）

        return result;
    }

    // 判断changeType
    private String changeType(String changeValue){
        if (changeValue.startsWith("-")) {
            return "change-down";
        } else if (changeValue.startsWith("0") && changeValue.endsWith("0")) {
            return "not-change";
        }else {
            return "change-up";
        }
    }

}
