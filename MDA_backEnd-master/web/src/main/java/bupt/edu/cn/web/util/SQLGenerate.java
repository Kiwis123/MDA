package bupt.edu.cn.web.util;

import breeze.linalg.dim;
import bupt.edu.cn.kylin.service.KylinQueryService;
import bupt.edu.cn.kylin.service.impl.KylinQueryServiceImpl;
import com.alibaba.fastjson.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class SQLGenerate {


    /**
     * 生成宽表SQL
     * @param str
     * @return
     */
    public String[] getFaltTableSql(String str){
        String SQL = "";
        String sql1 = "";
        String sql2 = "";
        String tables = "";
        JSONObject jsonObject = new JSONObject(str);
        String factTable = jsonObject.getString("fact_table");
        System.out.println(factTable);
        String[] factTableSplit = factTable.split("\\.");
        System.out.println(factTableSplit.length);
        String factTableName = factTableSplit[1];
        System.out.println(factTableName);
        tables = factTable.split("\\.")[1];
        sql1 = "select " + factTableName + ".* ";
        sql2 = "from " + factTable +" ";

        JSONArray lookups = jsonObject.getJSONArray("lookups");

        for (int i = 0; i<lookups.length();i++){
            JSONObject lookup = lookups.getJSONObject(i);
            String table = lookup.getString("table");
            String alias = lookup.getString("alias");
//            table = table.split(".")[0]+"."+alias;

//            String[] tableSplit = table.split("\\.");
//            String tableName = tableSplit[1];

            sql1 = sql1 + ", "+ alias +".* ";
            JSONObject jo = lookup.getJSONObject("join");
            String type = jo.getString("type");
//            System.out.println(jo.get("primary_key").toString().getClass());
            String[] primary_key = (jo.get("primary_key").toString().substring(1,jo.get("primary_key").toString().length()-1)).split(",");
            String[] foreign_key = (jo.get("foreign_key").toString().substring(1,jo.get("foreign_key").toString().length()-1)).split(",");
            tables = tables + "," + alias ;
            sql2 = sql2 + type + " join " + table+" "+alias + " on ";
            sql2 = sql2 + primary_key[0].substring(1,primary_key[0].length() - 1)+"="+foreign_key[0].substring(1,foreign_key[0].length() - 1)+" ";
            if (primary_key.length>1){
                for (int j = 1;j<primary_key.length;j++){
                    sql2 = sql2 + "and " + primary_key[j].substring(1,primary_key[j].length() - 1)+"="+foreign_key[j].substring(1,foreign_key[j].length() - 1) + " ";
                }
            }
        }
        SQL = sql1 + sql2;
        String[] result = new String[2];
        // default总报错 替换掉
        System.out.println(SQL);
        SQL = SQL.replace("DEFAULT.","");
        System.out.println("--------------替换DEFAULT.");
        System.out.println(SQL);
        result[0] = SQL;
        result[1] = tables;
        return result;
    }

    public String getbydim(String[] dim, String[] mea, String tablename){
        String hdl = " from " + tablename;
        String dimString = "";
        String meaString = "";
        if (dim.length==0 || mea.length==0){
            return "ERROR";
        }

        if (mea.length == 1){
            meaString += mea[0];
        }else{
            for (int i = 0;i < mea.length-1;i++){
                meaString += (mea[i] + ",");
            }
            meaString += mea[mea.length-1];
        }

        if (dim.length == 1){
            dimString = dimString + dim[0];
        }else{
            for (int i = 0;i < dim.length-1;i++){
                dimString += (dim[i] + ",");
            }
            dimString += dim[dim.length-1];
        }
        hdl = "select " + dimString + ","+ meaString + hdl;
        return hdl;
    }

    public String getWithGroup(String[] dim, List<String> fun, List<String> mea, String tablename,String fileType,String fileUrl,String routeStr,String limit){

        String hdl ="";
        if (fileType.equals("CSV")){ //生成sparkSQL
            hdl = " from `" + tablename + "` group by ";
            String dimString = "";
            String meaString = "";

            if (dim.length==0){
                return "ERROR";
            }

            if (dim.length == 1){
                dimString = dimString +"`"+ dim[0]+"`";
            }else{
                for (int i = 0;i < dim.length-1;i++){
                    dimString += ("`"+dim[i]+"`" + ",");
                }
                dimString =dimString +"`"+ dim[dim.length-1]+"`";
            }


            if (mea.size() != 0) {
                if (mea.size() == 1) {
                    meaString += (fun.get(0)+"(`" + mea.get(0) + "`) as `" + mea.get(0)+"_"+fun.get(0)+"`");
                } else {
                    for (int i = 0; i < mea.size() - 1; i++) {
                        meaString += (fun.get(i)+"(`" + mea.get(i) + "`) as `" + mea.get(i)+"_"+fun.get(i) + "`,");
                    }
                    meaString += (fun.get(mea.size() - 1)+"(`" + mea.get(mea.size() - 1) + "`) as `" + mea.get(mea.size() - 1)+"_"+fun.get(mea.size()-1)+"`");
                }
                if(limit == null || limit.equals(""))
                    hdl = "select " + meaString + ","+ dimString + hdl + dimString;
                else
                    hdl = "select " + meaString + ","+ dimString + hdl + dimString + " limit "+limit;
            }else {
                if(limit == null || limit.equals(""))
                    hdl = "select " + dimString  + hdl + dimString;
                else
                    hdl = "select " + dimString  + hdl + dimString + " limit "+limit;
            }
        }else if (fileType.equals("FALT") || fileType.equals("kylin")){
            if (!routeStr.startsWith("select")){ //生成kylin SQL

                /**
                 * 由于fileUrl的逻辑发生变化，hql的拼接也需要添加新的功能进行补充:
                 * 拼接数据模型的SQL语句（例如：table1 left join table2 on table1.xx = table2.yy）
                 * add by tc
                 */
                KylinQueryService kqs = new KylinQueryServiceImpl();

                /**
                 * 根据tableName（cubeName）获取【cube的描述信息】，包括:
                 *      表名、列名, modelName
                 */
                kqs.login("ADMIN","KYLIN");
                String cubeDes = kqs.getCubeDes(fileUrl);
                // 格式化cubeDes，转化为可解析的JSONArray
                cubeDes = cubeDes.substring(1, cubeDes.length() - 1);
                com.alibaba.fastjson.JSONObject jsonObject = com.alibaba.fastjson.JSONArray.parseObject(cubeDes);
                String modelName = (String) jsonObject.get("model_name");
                com.alibaba.fastjson.JSONArray jsonArray = (com.alibaba.fastjson.JSONArray)jsonObject.get("dimensions");

                hdl += " from ";

                /**
                 * 根据tableName（cubeName）获取【model的描述信息】，包括:
                 *      表间关联信息, 筛选条件
                 */
                String modelDes = kqs.getDataModel(modelName);
                // 格式化modelDes，转化为可解析的JSONArray
                jsonObject = com.alibaba.fastjson.JSONArray.parseObject(modelDes);
                String factTable = (String) jsonObject.get("fact_table");
                jsonArray = (com.alibaba.fastjson.JSONArray)jsonObject.get("lookups");
                // 遍历jsonArray，输出 【from factTalbe xxjoin lookupTable on xxx】 至 sql 中
                System.out.println("~~~~~~~factTable: " + factTable);
                System.out.println(factTable.split("\\.").length);
                if (factTable.split("\\.").length != 0) {
                    hdl += factTable.split("\\.")[1];
                }else {
                    hdl += factTable;
                }
                for (int i = 0; i < jsonArray.size(); i++) {
                    com.alibaba.fastjson.JSONObject lookup = (com.alibaba.fastjson.JSONObject)jsonArray.get(i);
                    String lookupTable = (String) lookup.get("table");
                    System.out.println("~~~~~~~~lookupTable" + lookupTable);
                    com.alibaba.fastjson.JSONObject join = (com.alibaba.fastjson.JSONObject) lookup.get("join");
                    String type = (String) join.get("type");
                    com.alibaba.fastjson.JSONArray tempArray = (com.alibaba.fastjson.JSONArray) join.get("primary_key");
                    String primary_key = tempArray.get(0).toString();
                    tempArray = (com.alibaba.fastjson.JSONArray) join.get("foreign_key");
                    String foreign_key = tempArray.get(0).toString();
                    if (lookupTable.split("\\.").length != 0) {
                        hdl += " " + type + " join " + lookupTable.split("\\.")[1] + " on " + primary_key + " = " + foreign_key;
                    }else {
                        hdl += " " + type + " join " + lookupTable + " on " + primary_key + " = " + foreign_key;
                    }
                }
                String filterCondition = (String) jsonObject.get("filter_condition");
                if (!"".equals(filterCondition)) {
                    hdl += " where " + filterCondition;
                }

                hdl += " group by ";


//                hdl = " from " + fileUrl.split(" from ")[1] + " group by ";
                String dimString = "";
                String meaString = "";

                if (dim.length==0){
                    return "ERROR";
                }

                if (dim.length == 1){
                    dimString = dimString + dim[0];
                }else{
                    for (int i = 0;i < dim.length-1;i++){
                        dimString += (dim[i] + ",");
                    }
                    dimString =dimString + dim[dim.length-1];
                }


                if (mea.size() != 0) {
                    if (mea.size() == 1) {
//                        meaString += (fun.get(0)+"(" + mea.get(0) + ") ");
                        meaString += (fun.get(0)+"(" + mea.get(0) + ") ");
                    } else {
                        for (int i = 0; i < mea.size() - 1; i++) {
                            meaString += (fun.get(i)+"(" + mea.get(i) + ") " + ",");
                        }
                        meaString += (fun.get(mea.size() - 1)+"(" + mea.get(mea.size() - 1) + ") ");
                    }
                    if (limit == null || limit.equals(""))
                        hdl = "select " + meaString + ","+ dimString + hdl + dimString;
                    else
                        hdl = "select " + meaString + ","+ dimString + hdl + dimString + " limit "+limit;
                }else {
                    if (limit == null || limit.equals(""))
                        hdl = "select " + dimString  + hdl + dimString;
                    else
                        hdl = "select " + dimString  + hdl + dimString + " limit "+limit;
                }
            }else {  //生成宽表 hive SQL
                hdl = " from " + fileUrl.split(" from ")[1] + " group by ";
                String dimString = "";
                String meaString = "";

                if (dim.length==0){
                    return "ERROR";
                }

                if (dim.length == 1){
                    dimString = dimString + dim[0];
                }else{
                    for (int i = 0;i < dim.length-1;i++){
                        dimString += (dim[i] + ",");
                    }
                    dimString =dimString + dim[dim.length-1];
                }

                if (mea.size() != 0) {
                    if (mea.size() == 1) {
                        meaString += (fun.get(0)+"(" + mea.get(0) + ") as `" + mea.get(0)+"_"+fun.get(0)+"`");
                    } else {
                        for (int i = 0; i < mea.size() - 1; i++) {
                            meaString += (fun.get(i)+"(" + mea.get(i) + ") as `" + mea.get(i)+"_"+fun.get(i) + "`,");
                        }
                        meaString += (fun.get(mea.size() - 1)+"(" + mea.get(mea.size() - 1) + ") as `" + mea.get(mea.size() - 1)+"_"+fun.get(mea.size()-1)+"`");
                    }
                    if (limit == null || limit.equals(""))
                        hdl = "select " + meaString + ","+ dimString + hdl + dimString;
                    else
                        hdl = "select " + meaString + ","+ dimString + hdl + dimString + " limit "+limit;
                }else {
                    if (limit == null || limit.equals(""))
                        hdl = "select " + dimString  + hdl + dimString;
                    else
                        hdl = "select " + dimString  + hdl + dimString + " limit "+limit;
                }
            }


        } else { //生成hive SQL
            hdl = " from " + fileUrl.split(" from ")[1] + " group by ";
            String dimString = "";
            String meaString = "";

            if (dim.length==0){
                return "ERROR";
            }

            if (dim.length == 1){
                dimString = dimString + dim[0];
            }else{
                for (int i = 0;i < dim.length-1;i++){
                    dimString += (dim[i] + ",");
                }
                dimString =dimString + dim[dim.length-1];
            }


            if (mea.size() != 0) {
                if (mea.size() == 1) {
//                    meaString += (fun.get(0)+"(" + mea.get(0) + ") as " + mea.get(0)+"_"+fun.get(0));
                    meaString += (fun.get(0)+"(" + mea.get(0) + ")");
                } else {
                    for (int i = 0; i < mea.size() - 1; i++) {
                        meaString += (fun.get(i)+"(" + mea.get(i) + ") as " + mea.get(i)+"_"+fun.get(i) + ",");
                    }
                    meaString += (fun.get(mea.size() - 1)+"(" + mea.get(mea.size() - 1) + ") as " + mea.get(mea.size() - 1)+"_"+fun.get(mea.size()-1));
                }
                if (limit == null || limit.equals(""))
                    hdl = "select " + meaString + ","+ dimString + hdl + dimString;
                else
                    hdl = "select " + meaString + ","+ dimString + hdl + dimString + " limit "+limit;
            }else {
                if (limit == null || limit.equals(""))
                    hdl = "select " + dimString  + hdl + dimString;
                else
                    hdl = "select " + dimString  + hdl + dimString + " limit "+limit;
            }
        }


        return hdl;
    }

    public String getWithOnemeas(List<String> fun, List<String> mea, String tablename,String fileType,String fileUrl,String routeStr){
        String hdl ="";
        if (fileType.equals("CSV")){
            hdl = " from `" + tablename + "`";
            String meaString = "";

            if (mea.size() == 1)
                meaString += (fun.get(0)+"(`" + mea.get(0) + "`) as `" + mea.get(0)+"_"+fun.get(0) +"`");

            hdl = "select " + meaString  + hdl;
        }else if (fileType.equals("FALT")){
            if (routeStr.startsWith("kylin")){
                hdl = " from " + fileUrl.split(" from ")[1];
                String meaString = "";
                if (mea.size() == 1)
                    meaString += (fun.get(0)+"(" + mea.get(0) + ") ");

                hdl = "select " + meaString  + hdl;
            }else {
                hdl = " from " + fileUrl.split(" from ")[1];
                String meaString = "";
                if (mea.size() == 1)
                    meaString += (fun.get(0)+"(" + mea.get(0) + ") as `" + mea.get(0)+"_"+fun.get(0) +"`");

                hdl = "select " + meaString  + hdl;
            }
        }else{
            hdl = " from " + tablename;
            String meaString = "";

            if (mea.size() == 1)
                meaString += (fun.get(0)+"(" + mea.get(0) + ") as " + mea.get(0)+"_"+fun.get(0));

            hdl = "select " + meaString  + hdl;
        }


        return hdl;
    }

    public String getWithScrollDrill(String tablename, String[] measArr, int year, int season, int month, int day){
        //上卷下钻专用SQL生成器
        String result = "";
//Y        sql = "select month, min(`Transaction_min`) as Transaction_min from `BreadBasket_DMS-Transaction_min` where year = `2017` group by month";
//M        sql = "select day, min(`Transaction_min`) as Transaction_min from `BreadBasket_DMS-Transaction_min` where year = '2017' and month = '3' group by day";
//XXX      sql = "select year, min(`Transaction_min`) as Transaction_min from `BreadBasket_DMS-Transaction_min` group by year"
//D        sql = "select day, Transaction_min as Transaction_min from `BreadBasket_DMS-Transaction_min` where year = '2017' and month = '3' and day = '11'";
        String paramName = measArr[0] + "(`" + measArr[1] + "_" + measArr[0] + "`)";       //min(`Transaction_min`)
        if (year != -1 && season == -1 && month == -1 && day == -1){        //以1年的4个季度为维度进行计算
            result = "select season, " + paramName + " as `" + measArr[1] + "_" + measArr[0] + "` from `" + tablename + "` where year = '" + year + "' group by season";
        }else if (year != -1 && season != -1 && month == -1 && day == -1) {  //以1季度的3个月为维度进行计算
            result = "select month, " + paramName + " as `" + measArr[1] + "_" + measArr[0] + "` from `" + tablename + "` where year = '" + year + "' and season = '" + season + "' group by month";
        }else if (year != -1 && season != -1 && month != -1 && day == -1){   //以一个月的30天为维度计算
            result = "select day, " + paramName + " as `" + measArr[1] + "_" + measArr[0] + "` from `" + tablename + "` where year = '" + year + "' and season = '" + season + "' and month = '" + month + "' group by day";
        }else if (year != -1 && season != -1 && month != -1 && day != -1){  //以1日为维度进行计算（意义不大）
            result = "select day, `" + measArr[1] + "_" + measArr[0] + "` from `" + tablename + "` where year = '" + year + "' and season = '" + season + "' and month = '" + month + "' and day = '" + day + "'";
        }else if (year == -1 && month == -1 && day == -1 && season == -1){  //以初始的n年为维度进行计算
            result = "select year, " + paramName + " as `" + measArr[1] + "_" + measArr[0] + "` from `" + tablename + "` group by year";
        }else{
            result = "select * from `" + tablename + "` limit 1";
            System.out.println("输入year, month, day数据格式有误.");
        }
        System.out.println("The Drill SQL is :" + result);
        return result;
    }
}
