package bupt.edu.cn.web.controller;

import bupt.edu.cn.spark.common.SpSession;
import bupt.edu.cn.spark.service.impl.SparkSqlServiceImpl;
import bupt.edu.cn.web.chartsmodel.ChartModelOne;
import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.common.WebConstant;
import bupt.edu.cn.web.pojo.Diagram;
import bupt.edu.cn.web.repository.DashboardRepository;
import bupt.edu.cn.web.repository.DiagramRepository;
import bupt.edu.cn.web.service.DashboardService;
import bupt.edu.cn.web.service.DiagramService;
import bupt.edu.cn.web.service.OptionService;
import bupt.edu.cn.web.util.SQLGenerate;
//import net.minidev.json.JSONObject;
import bupt.edu.cn.web.util.StringUtil;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Encoders;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class SparkSqlController {

    @Autowired
    SparkSqlServiceImpl sparkSqlService;

    @Autowired
    SpSession spSession;

    @Autowired
    OptionService optionService;
    @Autowired
    DashboardService dashboardService;
    @Autowired
    DiagramService diagramService;

    @Autowired
    DashboardRepository dashboardRepository;

    @Autowired
    DiagramRepository diagramRepository;

    @RequestMapping("/sparkSQLOption")
    public ReturnModel sparkSQLOption(
//            @RequestParam(value = "diagramId") String diagramId,
//            @RequestParam(value = "diagramName") String diagramName,
//            @RequestParam(value = "classificaion") String classificaion,
            @RequestParam(value = "userId") String userId,
            @RequestParam(value = "dataSourceId") String dataSourceId,
            @RequestParam(value = "dims") String dims,
            @RequestParam(value = "meas") String meas,
            @RequestParam(value = "fileUrl") String fileUrl,
            @RequestParam(value = "tableName") String tableName,
            @RequestParam(value = "fileType") String fileType){
        System.out.println("-----------???????????? /sparkSQLOption----------");
        System.out.println("-----------??????1???dims = " + dims);
        System.out.println("-----------??????2???meas = " + meas);
        System.out.println("-----------??????3???fileUrl = " + fileUrl);
        System.out.println("-----------??????4???tableName = " + tableName);
        System.out.println("-----------??????5???fileType = " + fileType);
        String[] dimArr = {};
        String[] funAndMeaArr = {};
        List<String> meaArr = new ArrayList<>();
        List<String> funArr = new ArrayList<>();

        SparkSession spark = spSession.getSparkSession();
        ReturnModel result = new ReturnModel();

        if(dims != null && !dims.equals("") && !dims.equals(" ")){
            dimArr = dims.split(",");
        }
        if(meas != null && !meas.equals("") && !meas.equals(" ")){
            meas = StringUtil.custom_trim(meas,',');
            System.out.println("-----------???,??????meas = " + meas);
            funAndMeaArr = meas.split(",");
            for (int i = 0; i <funAndMeaArr.length; i++){
                System.out.println(funAndMeaArr[i]);
                funArr.add(funAndMeaArr[i].split("\\.")[0]);
                meaArr.add(funAndMeaArr[i].split("\\.")[1]);
            }
        }

        SQLGenerate sqlGenerate = new SQLGenerate();
        //??????SQL
        String sql = sqlGenerate.getWithGroup(dimArr, funArr, meaArr,tableName,fileType,fileUrl,"spark","10");

        //??????
        Dataset<Row> ds;
        try{
            ds = sparkSqlService.sparkSQL(spark,fileUrl,tableName,sql);
        }catch (Exception e){
            result.setResult(WebConstant.QUERY_ERROR.isResult());
            result.setReason(WebConstant.QUERY_ERROR.getReason());
            spark.stop();
            return result;
        }

        //??????????????????
        List<String> listOne = ds.toJSON().as(Encoders.STRING()).collectAsList();
        List<Map> listJson  = new ArrayList<>();

        try {
            for (int i = 0; i<listOne.size();i++){
                JSONObject jsonObject = new JSONObject(listOne.get(i));
                listJson.add(jsonObject.toMap());
            }
        } catch (Exception e) {
            //?????????????????????
        }

        List<String> mea_fun = new ArrayList<>();
        for (int i = 0;i<meaArr.size();i++){
            mea_fun.add(meaArr.get(i)+"_"+funArr.get(i));
        }
        //??????option
        com.alibaba.fastjson.JSONObject op = optionService.createOptionSpark(dimArr,mea_fun,listJson);
        //????????????Diagram diagramid ="-1" ?????????Diagram???????????????????????????classificaion:"2" ???????????????????????????
        String clas ="2";
        if (mea_fun.size()>1){
            clas = "4";
        }
        Diagram diagram = diagramService.createDiagram("-1","picture",op.toString(),clas,userId,dataSourceId,0 , 0);
        //
        com.alibaba.fastjson.JSONObject re = new com.alibaba.fastjson.JSONObject();
        re.put("option",op);
        re.put("diagramId",diagram.getId());
        re.put("diagramName",diagram.getName());
        re.put("classificaion",diagram.getClassification());
        re.put("userId",diagram.getUserId());
        re.put("dataSourceId",diagram.getDataSourceId());

        result.setResult(WebConstant.QUERY_SUCCESS.isResult());
        result.setReason(WebConstant.QUERY_SUCCESS.getReason());
        result.setDatum(re);
        spark.stop();
        return result;
    }


//    @RequestMapping("/sparkSQL")
//    public ReturnModel QuerySparkSQL(
//                            @RequestParam(value = "dims") String dims,
//                            @RequestParam(value = "meas") String meas,
//                            @RequestParam(value = "fileUrl") String fileUrl,
//                            @RequestParam(value = "tableName") String tableName){
//        System.out.println("-----------???????????? /sparkSQL----------");
//        System.out.println("-----------??????1???dims = " + dims);
//        System.out.println("-----------??????2???meas = " + meas);
//        System.out.println("-----------??????3???fileUrl = " + fileUrl);
//        System.out.println("-----------??????4???tableName = " + tableName);
//        String[] dimArr = {};
//        String[] meaArr = {};
//
//        SparkSession spark = spSession.getSparkSession();
//        ReturnModel result = new ReturnModel();
//
//        if(dims != null && !dims.equals("") && !dims.equals(" ")){
//            dimArr = dims.split(",");
//        }
//        if(meas != null && !meas.equals("") && !meas.equals(" ")){
//            meaArr = meas.split(",");
//        }
//
//        SQLGenerate sqlGenerate = new SQLGenerate();
//        //??????SQL
//        String sql = sqlGenerate.getWithGroup(dimArr,meaArr,tableName);
//
//        //??????
//        Dataset<Row> ds;
//        try{
//            ds = sparkSqlService.sparkSQL(spark,fileUrl,tableName,sql);
//        }catch (Exception e){
//            result.setResult(WebConstant.QUERY_ERROR.isResult());
//            result.setReason(WebConstant.QUERY_ERROR.getReason());
//            spark.stop();
//            return result;
//        }
//
//        //??????????????????
//        List<String> listOne = ds.toJSON().as(Encoders.STRING()).collectAsList();
//        List<Map> listJson  = new ArrayList<>();
//
//        try {
//            for (int i = 0; i<listOne.size();i++){
//                JSONObject jsonObject = new JSONObject(listOne.get(i));
//                listJson.add(jsonObject.toMap());
//            }
//        } catch (Exception e) {
//            //?????????????????????
//        }
//        result.setResult(WebConstant.QUERY_SUCCESS.isResult());
//        result.setReason(WebConstant.QUERY_SUCCESS.getReason());
//        result.setDatum(listJson);
//        spark.stop();
//        return result;
//    }
}
