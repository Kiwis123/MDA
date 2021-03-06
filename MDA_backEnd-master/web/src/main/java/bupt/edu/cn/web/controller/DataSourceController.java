package bupt.edu.cn.web.controller;

import bupt.edu.cn.web.common.ReturnModel;
import bupt.edu.cn.web.pojo.DataSource;
import bupt.edu.cn.web.pojo.FaltTable;
import bupt.edu.cn.web.repository.DataSourceRepository;
import bupt.edu.cn.web.repository.FaltTableRepository;
import bupt.edu.cn.web.service.DataSourceService;
import bupt.edu.cn.web.service.DataTableInfoService;
import bupt.edu.cn.web.service.HiveService;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.*;

import static bupt.edu.cn.web.conf.consist.CSVDIR;
import static bupt.edu.cn.web.util.FileUtil.getCSVDataSourceByPath;
import static bupt.edu.cn.web.util.FileUtil.getCSVDataSourceContainInPath;

@RestController
public class DataSourceController {

    @Autowired
    DataSourceRepository dataSourceRepository;
    @Autowired
    DataTableInfoService dataTableInfoService;
    @Autowired
    FaltTableRepository faltTableRepository;
    @Autowired
    HiveService hiveService;
    @Autowired
    DataSourceService dataSourceService;

    /**
     * 预览数据源表接口
     * @param fileName
     * @param fileUrl
     * @param fileType
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/previewData")
    public ReturnModel previewData(String fileName, String fileUrl, String fileType, HttpServletResponse response, HttpServletRequest request) {
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------previewData--------------");
        System.out.println("fileName = "+ fileName);
        System.out.println("fileUrl = "+ fileUrl);
        System.out.println("fileType = "+ fileType);

        ReturnModel result = new ReturnModel();
        result.setDatum(dataSourceService.preview(fileName, fileUrl, fileType));
        result.setResult(true);
        return result;
    }


    /**
     * 更新HIVE数据源接口
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/updateDataSource")
    public ReturnModel updateDataSource(HttpServletResponse response, HttpServletRequest request){
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------updateDataSource--------------");

        ReturnModel result = new ReturnModel();

        try {

            //查出hive表
            List<String> databaseNameList = hiveService.showDatabases();
            List<String> tableName = new ArrayList<>();
            List<String> tableUrl = new ArrayList<>();//hive表url
            for (int i =0; i<databaseNameList.size(); i++){
                String databasei = databaseNameList.get(i);
                List<String> tableiName = hiveService.showTables(databasei);
                tableName.addAll(tableiName);
                for (int j = 0; j<tableiName.size(); j++){
                    tableUrl.add(databasei+"/"+tableiName.get(j));
                }
            }
            Set<String> setHiveTableUrl = new HashSet<>(tableUrl); //list转set
            //查出mysql hive表记录
            List<DataSource>  dataSources = dataSourceRepository.findByFileType("HIVE");
            Set<String> setMysqlTableUrl = new HashSet<>(); //list转set
            for (int i = 0;i<dataSources.size();i++){
                setMysqlTableUrl.add(dataSources.get(i).getFileUrl());
            }

            Set<String> setResult = new HashSet<>();
            //要删除的记录（差集）
            setResult.clear();
            setResult.addAll(setMysqlTableUrl);
            setResult.removeAll(setHiveTableUrl);
            System.out.println("删除差集:"+setResult);
            //删除datasource表中的"HIVE"数据
            for (String url : setResult){
                dataSourceRepository.deleteByFileUrlAndFileType(url,"HIVE");
            }
            System.out.println("已删除HIVE表");
            //要增加的记录（差集）
            setResult.clear();
            setResult.addAll(setHiveTableUrl);
            setResult.removeAll(setMysqlTableUrl);
            System.out.println("增加差集:"+setResult);
            //新增"HIVE"数据
            for (String url : setResult){
                DataSource dataSource = new DataSource();
                dataSource.setFileType("HIVE");
                dataSource.setFileUrl(url);
                dataSource.setFileName(url.split("/")[1]);
                dataSourceRepository.saveAndFlush(dataSource);
            }
        }catch (Exception e){
            System.out.println(e.toString());
            result.setResult(false);
            result.setReason("查询表hive列表出错");
            return result;
        }

        result.setResult(true);
        result.setReason("更新hive数据源");
        return result;
    }

    /**
     * 获取所有的数据源（data_source表）接口
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/getDataSource")
    public ReturnModel getDataSource(HttpServletResponse response, HttpServletRequest request){
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------getDataSource--------------");
        ReturnModel result = new ReturnModel();
//        //更新
//        if(dataSourceService.updateDataSource()==false){
//            System.out.println("更新数据源失败");
//            result.setReason("更新数据源失败");
//        }
        //查询mysql中的记录
        List<DataSource> dataSources = new ArrayList<>();
        try {
            dataSources.addAll(dataSourceRepository.findAll());
        }catch (Exception e){
            e.printStackTrace();
        }
//        //查询本地具体文件夹下的csv表
//        try {
//            for(int i = 0; i< CSVDIR.length;i++){
//                dataSources.addAll(getCSVDataSourceByPath(CSVDIR[i]));
//            }
//        }catch (Exception e){
//            e.printStackTrace();
//        }
        result.setResult(true);
        result.setDatum(dataSources);
        return result;
    }

    /**
     * 获取所有的数据源（data_source表）接口
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/getDataSourceContains")
    public ReturnModel getDataSourceContains(String content, HttpServletResponse response, HttpServletRequest request){
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------getDataSourceContains--------------");
        System.out.println("----------------参数：content = " + content);
        ReturnModel result = new ReturnModel();
        //查询mysql中的记录
        List<DataSource> dataSources = new ArrayList<>();
        try {
            int contentNum = Integer.valueOf(content);
            try {dataSources.addAll(dataSourceRepository.findById(contentNum));}catch (Exception exc){ exc.printStackTrace(); }
        }catch (Exception e){
        }
        try {
            dataSources.addAll(dataSourceRepository.findByFileNameContains(content));
        }catch (Exception e){
            e.printStackTrace();
        }
        //查询本地具体文件夹下的csv表
        try {
            for(int i = 0; i< CSVDIR.length;i++){
                dataSources.addAll(getCSVDataSourceContainInPath(CSVDIR[i], content));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        result.setResult(true);
        result.setDatum(dataSources);
        return result;
    }

    /**
     * 返回FALT表中某一hive表的维度和度量
     * @param hiveTableName
     * @param fileName
     * @param fileUrl
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/getHiveDim")
    public ReturnModel getHiveDim(String hiveTableName,String fileName,String fileUrl,HttpServletResponse response, HttpServletRequest request) {
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------getHiveDim--------------");
        System.out.println("hiveTableName = " + hiveTableName);
        System.out.println("fileName = " + fileName);
        System.out.println("fileUrl = " + fileUrl);

        ReturnModel result = new ReturnModel();
        result.setResult(true);
        if (fileUrl.startsWith("select ")){//获取FALT中hive表的维度和度量
            List<FaltTable> faltTables = faltTableRepository.findByNameAndTableSql(fileName,fileUrl);
            if (faltTables.size()==1){
                result.setDatum(dataTableInfoService.getHiveTableDimsByKylin(faltTables.get(0).getProject(),hiveTableName));
            }else if (faltTables.size() ==0){
                result.setResult(false);
                result.setReason("数据库中没有该条宽表记录");
            }else {
                result.setResult(false);
                result.setReason("数据库中存在多条相同的宽表记录");
            }
        }

        return result;
    }


    /**
     * 获取数据源的维度数组和度量数组接口
     * @param fileName
     * @param fileUrl
     * @param response
     * @param request
     * @return
     */
    @RequestMapping("/getDim")
    public ReturnModel getDim(String fileName,String fileUrl,HttpServletResponse response, HttpServletRequest request){
        // 解决Ajax跨域请求问题
        response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
        response.setHeader("Access-Control-Allow-Credentials", "true");
        System.out.println("----------------getDim--------------");
        System.out.println("fileName = "+ fileName);
        System.out.println("fileUrl = "+ fileUrl);

        ReturnModel result = new ReturnModel();
        result.setResult(true);

        if (fileUrl.startsWith("select ")){//获取FALT表的维度和度量
            List<FaltTable> faltTables = faltTableRepository.findByNameAndTableSql(fileName,fileUrl);
            System.out.println(faltTables);
            if (faltTables.size()==1){
//                result.setDatum(dataTableInfoService.getFaltTableDims(faltTables.get(0).getProject(),faltTables.get(0).getTables()));
                result.setDatum(dataTableInfoService.getFaltTableTables(faltTables.get(0).getProject(),faltTables.get(0).getTables()));
//                result.setDatum(dataTableInfoService.getFaltTableDimsGroupByTables(faltTables.get(0).getProject(),faltTables.get(0).getTables()));
            }else if (faltTables.size() ==0){
                result.setResult(false);
                result.setReason("数据库中没有该条宽表记录");
            }else {
                result.setResult(false);
                result.setReason("数据库中存在多条相同的宽表记录");
            }
        }else if (fileUrl.indexOf(".csv") !=-1){//获取CSV表的维度和度量
            result.setDatum(dataTableInfoService.getCsvDim(fileUrl));
        }else if ((fileUrl.split("/").length == 2)  && fileUrl.endsWith(fileName)){//获取CSV表的维度和度量
            List<Map<String,String>> hiveR = new ArrayList<>();
            try {
                hiveR = hiveService.descTable(fileUrl.split("/")[0],fileUrl.split("/")[1]);
            }catch (Exception e){
                System.out.println("获取表信息出错");
            }
            Map<String,List<String>> dimAndMea= new HashMap<>();
            List<String> dims=new ArrayList<>();
            List<String> meas=new ArrayList<>();
            for (int i = 0;i<hiveR.size();i++){
                if (hiveR.get(i).get("type").equals("string")){
                    dims.add(hiveR.get(i).get("name"));
                }else {
                    meas.add(hiveR.get(i).get("name"));
                }
            }
            dimAndMea.put("dims", dims);
            dimAndMea.put("meas", meas);
            result.setDatum(dimAndMea);
        }
        return result;
    }

    /**
     * 新增（存储）datasource接口
     */
    @RequestMapping(value = "/saveDataSource", method = RequestMethod.POST)
    public ReturnModel saveDataSource(String id, String fileName, String fileType, String fileUrl, Integer projectId, String description){
        System.out.println("----------------saveDataSource--------------");
        System.out.println("id:" + id);
        System.out.println("fileName:" + fileName);
        System.out.println("fileType:" + fileType);
        System.out.println("fileUrl:" + fileUrl);
        System.out.println("projectId:" + projectId);
        System.out.println("description:" + description);
        ReturnModel result = new ReturnModel();

        DataSource dataSource = dataSourceRepository.findById(Integer.valueOf(id)).orElse(null);
        if (dataSource == null) {
            dataSource = new DataSource();
        }
        dataSource.setFileName(fileName);
        dataSource.setFileType(fileType);
        dataSource.setFileUrl(fileUrl);
        dataSource.setProjectId(projectId);
        dataSource.setDescription(description);
        dataSource.setUpdateTime(new Timestamp(System.currentTimeMillis()));

        try {
            dataSourceRepository.saveAndFlush(dataSource);
            result.setResult(true);
        } catch (Exception e) {
            System.out.println(e);
            result.setResult(false);
        }
        result.setDatum(dataSource);
        return result;
    }

    /**
     * 删除datasource接口
     */
    @RequestMapping(value = "/deleteDataSource", method = RequestMethod.POST)
    public ReturnModel deleteDataSource(String id){
        System.out.println("----------------deleteDataSource--------------");
        System.out.println("id:" + id);
        ReturnModel result = new ReturnModel();

        try {
            dataSourceRepository.deleteById(Integer.valueOf(id));
            result.setResult(true);
        } catch (Exception e) {
            System.out.println(e);
            result.setResult(false);
        }
        return result;
    }
}
