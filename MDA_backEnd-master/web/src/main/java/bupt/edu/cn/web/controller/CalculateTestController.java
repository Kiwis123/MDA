package bupt.edu.cn.web.controller;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.TestResult;
import bupt.edu.cn.web.repository.TestResultRepository;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.util.*;


/**
 * @description:
 *      测试Kylin“推算”功能
 * @author: tc
 * @create: 2020/07/05 23:53
 */
@RestController
@RequestMapping("/calculateTest")
public class CalculateTestController {

    @Autowired
    KylinQueryService kylinQueryService;
    @Autowired
    TestResultRepository testResultRepository;


    /**
     * 开始试验主程序
     * @return
     */
    @RequestMapping(value = "/testRun", method = RequestMethod.GET)
    public ReturnModel testRun(){
        ReturnModel result = new ReturnModel();
        kylinQueryService.login("KYLIN", "ADMIN");

        List<String> dimensionList = getDimensionList();
        List<String> measureList = getMeasureList();

        for (int i = 0; i < measureList.size(); i++) {
            String measure = measureList.get(i);
            for (int j = 0; j < dimensionList.size(); j++) {
                System.out.println("----------------------开始查询----------------------");
                String queryAlias = dimensionList.get(j);
                String output;
                System.out.println("dimensions: " + queryAlias);
                System.out.println("measure: " + measure);
                try {
                    output = kylinQueryService.query(queryBody(queryAlias, measure));
                    System.out.println(output);
                    parseOutput(output, queryAlias, measure);
                }catch (Exception e){
                    //查询失败
                    result.setReason("查询失败");
                    result.setResult(false);
                    return result;
                }
            }
        }

        System.out.println("----------------------实验结束----------------------");
        return result;
    }


    // 测试集 -- 维度
    private List<String> getDimensionList() {
        List<String> list = new ArrayList<String>(Arrays.asList(
                "CDFG","CDF","ABD",
                "ABCDEFGHIJKLMNO","BCDEFGHIJKLMNO","BCDEFGHIJKLMN","CDEFGHIJKLMN","CDEFGHIJKLM","DEFGHIJKLM","DEFGHIJKL",
                "EFGHIJKL","EFGHIJK","FGHIJK","FGHIJ","GHIJ","GHI","HI",
                "ABCDEFGHIJKLMNOP","ACDFG","AF","ACDF","ABCD"
        ));
        return list;
    }

    // 测试集 -- 度量
    private List<String> getMeasureList() {
        List<String> list = new ArrayList<String>(Arrays.asList(
                "count(1)","SUM(GD_PREGENCY_RESULT.BIRTH_NUM)","MAX(GD_PREGENCY_RESULT.BIRTH_WEEK)"
        ));
        return list;
    }

    // 测试项对应的层数差
    private int getLayerDiffer(String queryAlias) {
        Map<String, Integer> map = new HashMap<>();
        map.put("CDFG", 1);
        map.put("CDF", 1);
        map.put("ABD", 1);
        map.put("ACDF", 0);
        map.put("ABCD", 0);
        map.put("ABCDEFGHIJKLMNO", 1);
        map.put("BCDEFGHIJKLMNO", 2);
        map.put("BCDEFGHIJKLMN", 3);
        map.put("CDEFGHIJKLMN", 4);
        map.put("CDEFGHIJKLM", 5);
        map.put("DEFGHIJKLM", 6);
        map.put("DEFGHIJKL", 7);
        map.put("EFGHIJKL", 8);
        map.put("EFGHIJK", 9);
        map.put("FGHIJK", 10);
        map.put("FGHIJ", 11);
        map.put("GHIJ", 12);
        map.put("GHI", 13);
        map.put("HI", 14);
        map.put("ABCDEFGHIJKLMNOP", 0);
        map.put("ACDFG", 0);
        map.put("AF", 0);

        return map.get(queryAlias);
    }

    // 整理出kylin需要的查询body
    private String queryBody(String queryAlias, String measure) {
        String dimensions = dimensionsOf(queryAlias);
        String sql = "select " + measure + "," + dimensions + " from GD_PREGENCY_RESULT inner join GD_BASIC_INFO_DETAIL on GD_PREGENCY_RESULT.ID = GD_BASIC_INFO_DETAIL.ID inner join GD_PHYSICAL_EXAM_W on GD_PREGENCY_RESULT.ID = GD_PHYSICAL_EXAM_W.ID"
                + " group by " + dimensions;

        return "{\"sql\":\""+ sql +"\",\"offset\":0,\"limit\":1000000,\"acceptPartial\":false,\"project\":\"kylinAutoModeling\"}";
    }

    // 把别名组合转化为dimensions
    private String dimensionsOf(String queryAlias) {
        // dimension和别名的对应表
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

        String dimensions = "";
        for (int i = 0; i < queryAlias.length(); i++) {
            dimensions += map.get(queryAlias.charAt(i));
            if (i != queryAlias.length() - 1) {
                dimensions += ",";
            }
        }
        return dimensions;
    }

    // 整理查询结果
    private void parseOutput(String output, String queryAlias, String measure) {
        JSONObject outputJson = JSON.parseObject(output);
        TestResult testResult = new TestResult();
        testResult.setDimensions(queryAlias);
        testResult.setMeasure(measure);
        testResult.setLayerDiffer(getLayerDiffer(queryAlias));
        testResult.setQueryLatency(outputJson.getInteger("duration"));
        testResult.setTotalScanCount(outputJson.getInteger("totalScanCount"));
        testResult.setResultRowCount(outputJson.getJSONArray("results").size());
        testResult.setTime(new Timestamp(System.currentTimeMillis()));

        System.out.println(testResult);
        testResultRepository.saveAndFlush(testResult);
    }

}
