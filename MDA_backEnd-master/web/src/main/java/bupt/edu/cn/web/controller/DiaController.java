package bupt.edu.cn.web.controller;
import breeze.linalg.dim;
import bupt.edu.cn.spark.utils.FileOperate;
import bupt.edu.cn.web.common.WebConstant;
import bupt.edu.cn.web.pojo.*;
import bupt.edu.cn.web.repository.*;
import bupt.edu.cn.web.service.DiagramService;
import bupt.edu.cn.web.service.NewOptionService;
import bupt.edu.cn.web.service.QueryService;
import bupt.edu.cn.web.util.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Timestamp;
import java.util.*;

import static bupt.edu.cn.web.conf.consist.DRILLPATH;

@RestController
public class DiaController {

    @Autowired
    DiagramRepository diagramRepository;

    @Autowired
    DiagramSQLRepository diagramSQLRepository;

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Autowired
    DiagramService diagramService;

    @Autowired
    NewOptionService newoptionService;

    @Autowired
    QueryService queryService;

    @Autowired
    QueryRoute queryRoute;

    @Autowired
    QueriedSqlRepository queriedSqlRepository;

    @RequestMapping("/queryData")
    public String queryData(String userId, String dataSourceId, String dims, String meas, String fileUrl, String tableName, String fileType,String limit){
        if (System.getProperty("os.name").split(" ")[0] == "Windows")
            if (System.getProperty("os.name").split(" ")[0].equals("Windows"))  //为了FatBird电脑的配置 System.setProperty("hadoop.home.dir", "e:/hadoop");
                System.out.println("-----------进入方法 /queryData----------");
        System.out.println("-----------参数1：dims = " + dims);
        System.out.println("-----------参数2：meas = " + meas);
        System.out.println("-----------参数3：fileUrl = " + fileUrl);
        System.out.println("-----------参数4：tableName = " + tableName);
        System.out.println("-----------参数5：fileType = " + fileType);
        String[] dimArr = {};
        String[] funAndMeaArr;
        List<String> meaArr = new ArrayList<>();
        List<String> funArr = new ArrayList<>();

        if (dims.equals("") && meas.equals(""))       //两个都是空的时候直接返回空值
            return "";

        JSONObject result = new JSONObject();

        if(dims != null && !dims.equals("") && !dims.equals(" ")){
            dims = StringUtil.custom_trim(dims,',');
            dimArr = dims.split(",");
            if (fileUrl.startsWith("select ")){
                for (int i = 0;i<dimArr.length;i++) {
                    if (dimArr[i].split("\\.").length == 3){
                        dimArr[i] = dimArr[i].split("\\.")[1]+"."+dimArr[i].split("\\.")[2];
                    }else if (dimArr[i].split("\\.").length == 2){ //GD_GENERAL_INFO_W.EXAMINE_DATE_DAY
                        dimArr[i] = dimArr[i];
                    }
                }
            }
        }
        if(meas != null && !meas.equals("") && !meas.equals(" ")){
            meas = StringUtil.custom_trim(meas,',');
            System.out.println("--------去,后：meas = " + meas);
            funAndMeaArr = meas.split(",");
            for (String item : funAndMeaArr) {
                System.out.println(item);
                item = StringUtil.custom_trim(item,'.'); //去除首尾'.'
                System.out.println("--------去.后：item = " + item);
                String[] itemSplit = item.split("\\.");
                funArr.add(itemSplit[0]);
                if (itemSplit.length == 4){ //操作名.数据库名.表名.维度
                    meaArr.add(itemSplit[2]+"."+itemSplit[3]);
                }else if (itemSplit.length == 2){ //操作名.维度
                    meaArr.add(itemSplit[1]);
                }else if (itemSplit.length == 3){ //操作名.表名.维度
                    meaArr.add(itemSplit[1]+"."+itemSplit[2]);
                }
            }
        }

        //路由
        String routeStr = queryRoute.route(Arrays.asList(dimArr), funArr, meaArr,tableName,fileUrl);
        if (routeStr.equals("hive")){ //hive 查询出来列名都变成小写了
            for (int i = 0;i<dimArr.length;i++){
                dimArr[i] = dimArr[i].toLowerCase();
            }
            for (int i = 0;i<meaArr.size();i++){
                meaArr.set(i,meaArr.get(i).toLowerCase());
            }
        }
        SQLGenerate sqlGenerate = new SQLGenerate();
        //获取SQL
        String sql;
        if (meaArr.size() == 1 && dimArr.length == 0)     //兼容指标卡的特殊Option
            sql =sqlGenerate.getWithOnemeas(funArr,meaArr,tableName,fileType,fileUrl,routeStr);
        else
            sql = sqlGenerate.getWithGroup(dimArr, funArr, meaArr,tableName,fileType,fileUrl,routeStr,limit);
        System.out.println("The SQL is: " + sql);
        List<Map> listJson = queryService.getQueryData(Arrays.asList(dimArr), funArr, meaArr, fileUrl, tableName, sql, routeStr);

//        List<String> mea_fun = new ArrayList<>();
//        for (int i = 0;i<meaArr.size();i++){
//            mea_fun.add(meaArr.get(i)+"_"+funArr.get(i));
//        }
//        JSONObject jo = newoptionService.newcreateOptionSpark(dimArr,mea_fun,listJson);
//
//        String clas ="2";
//        if (mea_fun.size()>1){
//            clas = "4";
//        }
//        Diagram diagram = diagramService.createDiagram("-1","unset",jo.toString(),clas,userId,dataSourceId);
//        JSONObject re = new JSONObject();
//        re.put("option",jo);
//        re.put("diagramId",diagram.getId());
//        re.put("diagramName",diagram.getName());
//        re.put("classificaion",diagram.getClassification());
//        re.put("userId",diagram.getUserId());
//        re.put("dataSourceId",diagram.getDataSourceId());

        result.put("result",WebConstant.QUERY_SUCCESS.isResult());
        result.put("reason",WebConstant.QUERY_SUCCESS.getReason());
        result.put("datum",listJson);

        return result.toString();
    }

    @RequestMapping("/initDiagram")
    public String initDiagram(String userId, String dataSourceId, String dims, String meas, String fileUrl, String tableName, String fileType, String limit,String rows){

        /**
         * 将此处的sum改成avg，使其有意义
         * SQL有问题，先注释掉
         * by tc
         */
//        meas = meas.replace("sum", "avg");

        if (System.getProperty("os.name").split(" ")[0] == "Windows")
            if (System.getProperty("os.name").split(" ")[0].equals("Windows"))  //为了FatBird电脑的配置
                System.setProperty("hadoop.home.dir", "e:/hadoop");
        System.out.println("-----------进入方法 /initDiagram----------");
        System.out.println("-----------参数1：dims = " + dims);
        System.out.println("-----------参数2：meas = " + meas);
        System.out.println("-----------参数3：fileUrl = " + fileUrl);
        System.out.println("-----------参数4：tableName = " + tableName);
        System.out.println("-----------参数5：fileType = " + fileType);
        System.out.println("-----------参数6：rows = " + rows);
        System.out.println("-----------参数6：limit = " + limit);
        if(rows == null )
            rows = "";
        if (limit == null)
            limit = "";

        if (dims.length() == 0 || dims.charAt(dims.length()-1) == ','){
            dims = dims + rows;
        }else {
            dims = dims +","+ rows;
        }
        String[] dimArr = {};
        String[] funAndMeaArr;
        String[] rowArr = {};
        List<String> meaArr = new ArrayList<>();
        List<String> funArr = new ArrayList<>();

        // 找到真正的 data_source_id
        // !!!!! 如果数据库中没有符合条件的，此处会出错
        DiagramSql diagramSql = new DiagramSql();
        try {
            /**
             * 第一处错误：没有datasource表
             * 已排除，现在获取的datasourceId为658（通过写死的前端字段）
             */
            List<DataSource> dsList = dataSourceRepository.findByFileNameAndFileUrl(tableName, fileUrl);
            dataSourceId = String.valueOf(dsList.get(0).getId());
            diagramSql.setDataSourceId(dataSourceId);
            diagramSql.setUserId(userId);
            diagramSql.setRows(rows);
            diagramSql.setDims(dims);
            diagramSql.setMeas(meas);
            diagramSql.setUpdateTime(new Date());
        } catch (Exception e){
            e.printStackTrace();
        }

        System.out.println("打印datasourceId~~~~~~~~~~");
        System.out.println(dataSourceId);

        if (dims.equals("") && meas.equals(""))       //两个都是空的时候直接返回空值
            return "";

        JSONObject result = new JSONObject();

        if(dims != null && !dims.equals("") && !dims.equals(" ")){
            dims = StringUtil.custom_trim(dims,',');
            System.out.println("--------去,后：dims = " + dims);
            dimArr = dims.split(",");
            if (fileUrl.startsWith("select ")){
                for (int i = 0;i<dimArr.length;i++) {
                    if (dimArr[i].split("\\.").length == 3){
                        dimArr[i] = dimArr[i].split("\\.")[1]+"."+dimArr[i].split("\\.")[2];
                    }else if (dimArr[i].split("\\.").length == 2){ //GD_GENERAL_INFO_W.EXAMINE_DATE_DAY
                        dimArr[i] = dimArr[i];
                    }
                }
            }
        }
        if(meas != null && !meas.equals("") && !meas.equals(" ")){
            meas = StringUtil.custom_trim(meas,',');
            System.out.println("--------去,后：meas = " + meas);
            funAndMeaArr = meas.split(",");
            for (String item : funAndMeaArr) {
                item = StringUtil.custom_trim(item,'.'); //去除首尾'.'
                String[] itemSplit = item.split("\\.");
                funArr.add(itemSplit[0]);
                if (itemSplit.length == 4){         //操作名.数据库名.表名.维度
                    meaArr.add(itemSplit[2]+"."+itemSplit[3]);
                }else if (itemSplit.length == 2){   //操作名.维度
                    meaArr.add(itemSplit[1]);
                }else if (itemSplit.length == 3){   //操作名.表名.维度
                    meaArr.add(itemSplit[1]+"."+itemSplit[2]);
                }
            }
        }

        if(rows != null && !rows.equals("") && !rows.equals(" ")){
            rowArr = rows.split(",");
        }
        //路由
        String routeStr = queryRoute.route(Arrays.asList(dimArr), funArr, meaArr,tableName,fileUrl);
        System.out.println("------------查询引擎是：" + routeStr + "-------------");
        if (routeStr.equals("hive") || routeStr.equals("spark")){ //hive 查询出来列名都变成小写了
            for (int i = 0;i<dimArr.length;i++){
                dimArr[i] = dimArr[i].toLowerCase();
            }
            for (int i = 0;i<meaArr.size();i++){
                meaArr.set(i,meaArr.get(i).toLowerCase());
            }
        }
        SQLGenerate sqlGenerate = new SQLGenerate();
        //获取SQL
        String sql;

        String drillFileNameJudge = "-1";
        String drillpath = DRILLPATH;
//        String drillpath = "/Users/user1/Desktop/";
        if (meaArr.size() > 0 && funArr.size() > 0 && dimArr.length ==1)
            drillFileNameJudge =tableName + "-" + meaArr.get(0) + "_" + funArr.get(0) + "-" + dimArr[0];
        // 存储计算结果
        List<Map> listJson = new ArrayList<>();
        // 怎么判断是否是上卷下钻
        System.out.println("Judge:::");
        System.out.println(!FileOperate.initDrillJudge(drillpath,drillFileNameJudge));
        System.out.println(rows != null);
        if (!FileOperate.initDrillJudge(drillpath,drillFileNameJudge) ||
                (rows != null && !rows.equals(""))  ||    //多维表格模式
                (meaArr.size()>1 && dimArr.length==1) ||    //雷达图模式
                (meaArr.size() == 1 && dimArr.length==0)    //指标卡模式
        ){     //不是上卷下钻或目录中无之前的文件
//        if (!dims.contains("日期")){     //不是上卷下钻且目录中无之前的文件
//            进入了非上卷下钻的操作
            System.out.println("---------NONONONONONO-------非上卷下钻的操作----------------------");
            if (meaArr.size() == 1 && dimArr.length == 0)     //兼容指标卡的特殊Option
                sql =sqlGenerate.getWithOnemeas(funArr,meaArr,tableName,fileType,fileUrl,routeStr);
            else
                sql = sqlGenerate.getWithGroup(dimArr, funArr, meaArr,tableName,fileType,fileUrl,routeStr,limit);
            diagramSql.setSqlinfo(sql);
            /**
             * 第二处错误：kylin查询错误500
             * 已排除，目前因为数据原因，只能使用cube：DupTest4babyS_badR
             * ---------
             * 添加存储sql的逻辑：
             *      存：sql、查询引擎、查询时间、查询时延等信息
             */
            Timestamp startTime = new Timestamp(System.currentTimeMillis());
            System.out.println("-----------------------开始查询: " + startTime + " --------------------------");
            System.out.println("The SQL is: " + sql);
            // 查询结果
            listJson = queryService.getQueryData(Arrays.asList(dimArr), funArr, meaArr, fileUrl, tableName, sql, routeStr);
            Timestamp endTime = new Timestamp(System.currentTimeMillis());
            // 查询时延（s）
            long queryLatency = endTime.getTime() - startTime.getTime();
            System.out.println("-----------------------查询结束，查询时延为: " + queryLatency + " ms-------------------");
            System.out.println("listJson: " + listJson);
            // 存储sql
            QueriedSql toBeStoredSql = new QueriedSql();
            toBeStoredSql.setModel(SQLParse.parseModelName(sql));
            toBeStoredSql.setQueryEngine(routeStr);
            toBeStoredSql.setQueryLatency(queryLatency);
            toBeStoredSql.setQueriedSql(sql);
            toBeStoredSql.setTime(startTime);
            queriedSqlRepository.saveAndFlush(toBeStoredSql);

        }else if(dimArr.length==1){
//            进入了上卷下钻的操作 &&
            sql = sqlGenerate.getWithScrollDrill(drillFileNameJudge,meas.split("\\."),-1,-1,-1,-1);
            diagramSql.setSqlinfo(sql);
            listJson = queryService.getQueryDataWithDate(drillpath + drillFileNameJudge,drillFileNameJudge,sql);
        }

        /**
         * 暂时注释掉上卷下钻的判断
         * by tc
         */
        Boolean drillflag = false;
//        if (listJson.size() != 0 && !fileUrl.contains("select"))
//            if (!listJson.get(0).containsKey(dims) && !(dimArr.length == 0 && meaArr.size()!=0) && !(dimArr.length>1&&meaArr.size()==1) && dimArr.length==1)  //用来判断是否是可以上卷下钻的
//                drillflag = true;
//        if (drillflag){                             // 为上卷下钻排序并增加一个"年"的后缀
//            Collections.sort(listJson, new Comparator<Map>() {  //給整个listJson进行排序
//                public int compare(Map o1, Map o2) {
//                    Integer date1 = Integer.valueOf(o1.get("year").toString());
//                    Integer date2 = Integer.valueOf(o2.get("year").toString());
//                    return date1.compareTo(date2);
//                }
//            });
//            for (Map tempmap : listJson){
//                tempmap.put("year",tempmap.get("year").toString() + "年");
//            }
//        }
        //生成图的类型
        String clas ="";
        if (dimArr.length == 0){
            clas = "-2"; //指标卡类型
            diagramSql.setChartType(-2);
        }
        if (dimArr.length == 1 && meaArr.size() >1){
            clas = "4"; //雷达图
            diagramSql.setChartType(4);
        }else if (dimArr.length == 1 && meaArr.size() ==1){
            clas = "2"; //面积图
            diagramSql.setChartType(2);
        }else if (dimArr.length == 1 && meaArr.size() == 0){
            clas = "-1"; //只有横轴的半成品图
            diagramSql.setChartType(-1);
        }
        if(dimArr.length > 1){
            clas = "-3"; //数据表格类型
            diagramSql.setChartType(-3);
        }
        JSONObject re = new JSONObject();
        Diagram diagram = new Diagram();

        if (rowArr.length < 1){ //返回option
            List<String> mea_fun = new ArrayList<>();
            for (int i = 0;i<meaArr.size();i++){
                mea_fun.add(meaArr.get(i)+"_"+funArr.get(i));
            }
            System.out.println("mea_fun: " + mea_fun);
            JSONObject jo = newoptionService.newcreateOptionSpark(dimArr,mea_fun,listJson);

            /**
             * 第三处错误：没有为projectId赋值
             * 已排除，暂时把projectId和workId都赋值为0
             */
            diagram = diagramService.createDiagram("-1","picture",jo.toString(),clas,userId,dataSourceId, 0, 0);
            re.put("option",jo);

        }else if(rowArr.length >0){ //返回数据表格
            diagram = diagramService.createDiagram("-1","picture",listJson.toString(),clas,userId,dataSourceId, 0, 0);

            //整理数据格式
            //构造列结构

            com.alibaba.fastjson.JSONArray cowJson = new GenerateTable().generateCowJSON(dimArr, rowArr, listJson);
            com.alibaba.fastjson.JSONArray rowJson = new GenerateTable().generateRowJSON(dimArr, meaArr, funArr,rowArr,listJson);

            com.alibaba.fastjson.JSONObject op = new com.alibaba.fastjson.JSONObject();
            op.put("row",rows);
            op.put("cows",cowJson);
            op.put("rows",rowJson);
            re.put("option",op);
        }
        diagramSql.setDiagramid(diagram.getId());
        /**
         * 暂时注释掉diagramSQL的保存
         * by tc
         */
//        diagramSQLRepository.saveAndFlush(diagramSql);
        re.put("diagramId",diagram.getId());
        re.put("diagramName",diagram.getName());
        re.put("classificaion",diagram.getClassification());
        re.put("userId",diagram.getUserId());
        re.put("dataSourceId",diagram.getDataSourceId());
        re.put("drillflag",drillflag);

        result.put("result",WebConstant.QUERY_SUCCESS.isResult());
        result.put("reason",WebConstant.QUERY_SUCCESS.getReason());
        result.put("datum",re);
        return result.toString();
    }

    public int isExistInJSONArray(com.alibaba.fastjson.JSONArray jsonArray,String name,String value){
        for(int i = 0;i<jsonArray.size();i++){
            if (jsonArray.getJSONObject(i).getString(name).equals(value))
                return i;
        }
        return -1;
    }


    @RequestMapping("/newupdateDiagram")
    public String newupdateDiagram(int diagramId, String diagramName, int diagramType, int userId, HttpServletRequest request, HttpServletResponse response){
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------newupdateDiagram-----------");
        System.out.println("diagramId = "+ diagramId +";diagramName = " + diagramId + ";diagramType = " + diagramType + ";userID = "+ userId);
        Optional<Diagram> diagram;
        diagram = diagramRepository.findById(Integer.valueOf(diagramId));
        JSONObject result = new JSONObject();
        result.put("result",true);
        result.put("reson","");
        //判断是否存在，新增/更新
        Diagram newDiagram;
        if (diagram.isPresent()){
            newDiagram = diagram.get();
        }else {
            result.put("result",false);
            result.put("reson","No such option");
            return result.toString();
        }
        //获取option
        String ch = newDiagram.getChart();
        //获取转换前option的类型
        System.out.println(ch);
        JSONObject chOption = new JSONObject(ch);
        int int_typeBefore = new chartsBase().getOptionType(chOption);
        System.out.println("typeBefore: "+int_typeBefore);
        System.out.println("typeAfter: "+diagramType);
        String str_newDiagram = new chartsBase().transDiagram(int_typeBefore,diagramType,ch);

        diagramService.updateDiagram(diagramId + "", diagramName, str_newDiagram, "5", userId + "");

        //组datum对象
        JSONObject datum = new JSONObject();
        datum.put("option",new JSONObject(str_newDiagram));
        datum.put("diagramId",diagramId);
        datum.put("diagramName",diagramName);
//        datum.put("classification",newDiagram.getClassification());
        datum.put("userId",userId);
//        datum.put("dataSourceId",newDiagram.getDataSourceId());
        result.put("datum",datum);

        return result.toString();
    }
    @RequestMapping("/DataScrollDrill")
    public String DataScrollDrill(String userId, String dataSourceId, String dim, String mea, int year, int month, int day, int season, int chartType,
                                  String tableName,HttpServletResponse response,HttpServletRequest request){

        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------DataScrollDrill-----------");
        System.out.println("year = " + year + ", season = " + season + ", month = " + month + ", day = " + day);
        JSONObject result = new JSONObject();

        String[] measArr = mea.split("\\.");
        String[] dimArr = dim.split(",");
        for (int i = 0;i<dimArr.length;i++) {
            if (dimArr[i].split("\\.").length == 3){
                dimArr[i] = dimArr[i].split("\\.")[1]+"."+dimArr[i].split("\\.")[2];
            }else if (dimArr[i].split("\\.").length == 2){
                dimArr[i] = dimArr[i];
            }
        }

        String fileName = tableName + "-" + measArr[1] + "_" + measArr[0] + "-" + dimArr[0];

        SQLGenerate sqlGenerate = new SQLGenerate();
        String sql = "";
//        String pathurl = "/Users/kang/D/projectFile/";
        String pathurl = DRILLPATH;
        sql = sqlGenerate.getWithScrollDrill(fileName, measArr, year, season, month, day);
        System.out.println("The SQL is : " + sql);
        List<Map> listJson = queryService.getQueryDataWithDate(pathurl+fileName,fileName,sql);

        //整理一下最后的list
        final String colName = StringUtil.getcolname(listJson);
        String colNameInCN = "";
        switch (colName){
            case "year":
                colNameInCN = "年";
                break;
            case "month":
                colNameInCN = "月";
                break;
            case "day":
                colNameInCN = "日";
                break;
            case "season":
                colNameInCN = "季度";
            default:
                break;
        }
        Collections.sort(listJson, new Comparator<Map>() {  //給整个listJson进行排序
            public int compare(Map o1, Map o2) {
                Integer date1 = Integer.valueOf(o1.get(colName).toString());
                Integer date2 = Integer.valueOf(o2.get(colName).toString());
                return date1.compareTo(date2);
            }
        });
        for (Map tempmap : listJson){
            tempmap.put(colName,tempmap.get(colName).toString() + colNameInCN);
        }
        //整理listJson结束

        JSONObject re = new JSONObject();
        Diagram diagram = new Diagram();
        List<String> mea_fun = new ArrayList<>();
        mea_fun.add(measArr[1] + "_" + measArr[0]);
        JSONObject jo = newoptionService.newcreateOptionSpark(dimArr,mea_fun,listJson);
        diagram = diagramService.createDiagram("-1","picture",jo.toString(),"2",userId,dataSourceId, 0, 0);
        String str_newDiagram = new chartsBase().transDiagram(2,chartType,diagram.getChart());
        diagramService.updateDiagram(diagram.getId() + "", diagram.getName(), str_newDiagram, "5", userId + "");

        re.put("option",new JSONObject(str_newDiagram));
        re.put("diagramId",diagram.getId());
        re.put("diagramName",diagram.getName());
        re.put("classificaion",diagram.getClassification());
        re.put("userId",diagram.getUserId());
        re.put("year",year);
        re.put("month",month);
        re.put("day",day);
        re.put("dataSourceId",diagram.getDataSourceId());
        re.put("drillflag",true);

        result.put("result",WebConstant.QUERY_SUCCESS.isResult());
        result.put("reason",WebConstant.QUERY_SUCCESS.getReason());
        result.put("datum",re);
        return result.toString();
    }
}
