package bupt.edu.cn.web.service;

import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.spark.common.SpSession;
import bupt.edu.cn.spark.service.impl.SparkSqlServiceImpl;
import bupt.edu.cn.web.conf.hiveConf;
import bupt.edu.cn.web.repository.DiagramRepository;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Encoders;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QueryService {

    @Autowired
    DiagramRepository diagramRepository;
    @Autowired
    DiagramService diagramService;
    @Autowired
    NewOptionService newoptionService;
    @Autowired
    SparkSqlServiceImpl sparkSqlService;
    @Autowired
    SpSession spSession;
    @Autowired
    HiveService hiveService;
    @Autowired
    KylinQueryService kylinQueryService;

    public synchronized List<Map> getQueryDataWithDate(String fileUrl, String tableName, String sql){
        List<Map> listJson = new ArrayList<>();
        SparkSession spark = spSession.getSparkSession();
        try{
            System.out.println(fileUrl);
            System.out.println(tableName);
            Dataset<Row> ds = sparkSqlService.sparkSQL(spark,fileUrl + ".csv",tableName,sql);
            List<String> listOne = ds.toJSON().as(Encoders.STRING()).collectAsList();
            System.out.println("----------");
            System.out.println(listOne);
            System.out.println("----------");
            for (int i = 0;i<listOne.size();i++){
                org.json.JSONObject jsonObject = new org.json.JSONObject(listOne.get(i));
                listJson.add(jsonObject.toMap());
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            spark.stop();
        }
        return listJson;
    }

    public List<Map> getQueryData(List<String> dimArr, List<String> funArr, List<String> meaArr, String fileUrl, String tableName, String sql,String routeStr){
        List<Map> listJson  = new ArrayList<>();//??????????????????
        //?????????????????????
        if (routeStr.equals("spark")){ //spark ??????
            try{
//                //??????
//                Dataset<Row> ds = sparkSqlService.sparkSQL(spark,fileUrl,tableName,sql);
//                //??????????????????
//                List<String> listOne = ds.toJSON().as(Encoders.STRING()).collectAsList();
//                System.out.println("++++++++++");
//                System.out.println(listOne);
//                System.out.println("++++++++++");
//                for (int i = 0; i<listOne.size();i++){
//                    org.json.JSONObject jsonObject = new org.json.JSONObject(listOne.get(i));
//                    listJson.add(jsonObject.toMap());
//                }
                /**
                 * ??????spark????????????
                 * by tc
                 */
                listJson = sparkSqlService.queryBySpark("jishengwei", sql);
            }catch (Exception e){
                System.out.println("????????????"+e.toString());
            }

        }else if (routeStr.equals("hive")){  //hive ??????
            try{
                /**
                 * ????????????csv???????????????fileUrl???????????????????????????????????????jishengwei????????????hive??????
                 */
//                if (fileUrl.startsWith("select ")){
//                    listJson = hiveService.selectData(hiveConf.DATABASEURL,"jishengwei",sql);
//                }else {
//                    listJson = hiveService.selectData(fileUrl.split("/")[0],sql);
//                }
                listJson = hiveService.selectData(hiveConf.DATABASEURL,"jishengwei",sql);
            }catch (Exception e){
                System.out.println("????????????"+e.toString());
            }finally {

            }

        }else if (routeStr.startsWith("kylin")) {  //kylin ??????
            String body = "{\"sql\":\""+ sql +"\",\"offset\":0,\"limit\":50000,\"acceptPartial\":false,\"project\":\""+routeStr.split("/")[1]+"\"}";
            String output="";
            try{
                kylinQueryService.login("ADMIN","KYLIN");
                output = kylinQueryService.query(body);
                System.out.println(output);
                JSONObject jsonObject = JSON.parseObject(output);
                JSONArray columnMetas = jsonObject.getJSONArray("columnMetas");
                JSONArray results = jsonObject.getJSONArray("results");
                if (columnMetas.size() != (funArr.size()+dimArr.size())){
                    System.out.println("??????????????????????????????????????????????????????????????????");
                }
                for (int i = 0;i<results.size();i++){
                    Map<String, String> row = new HashMap<>();
                    for (int j = 0;j<funArr.size();j++){
                        row.put(meaArr.get(j)+"_"+funArr.get(j),results.getJSONArray(i).getString(j));
                    }
                    for (int j = funArr.size();j<dimArr.size()+funArr.size();j++){
                        row.put(dimArr.get(j-funArr.size()),results.getJSONArray(i).getString(j));
                    }
                    listJson.add(row);
                }
            }catch (Exception e){
                System.out.println(e.toString());
            }
        }
        // ??????
        for (int i = 0;i<listJson.size();i++){
            if(null == listJson.get(i) || listJson.get(i).size() == 0){
                listJson.remove(i);
            }
        }
        return  listJson;
    }


}
