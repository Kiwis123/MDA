package bupt.edu.cn.kylin.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

/**
 * 访问kylin的查询接口
 *
 */
public interface KylinQueryService {
    String login(String user, String passwd);
    String listQueryableTables(String projectName);
    /**
     *
     * @param offset required int Offset used by pagination
     * @param limit required int Cubes per page.
     * @param cubeName optional string Keyword for cube names. To find cubes whose name contains this keyword.
     * @param projectName optional string Project name.
     * @return
     */
    String listCubes(int offset, int limit, String cubeName, String projectName);

    /**
     *
     * @param cubeName  Cube name.
     * @return
     */
    String getCubeDes(String cubeName);

    /**
     *
     * @param cubeName
     * @return
     */
    String getCube(String cubeName);

    /**
     *
     * @param modelName Data model name, by default it should be the same with cube name.
     * @return
     */
    String getDataModel(String modelName);

    /**
     *
     * @param cubeName cubeName Cube name.
     * @return
     */
    String enableCube(String cubeName);

    /**
     *
     * @param cubeName Cube name.
     * @return
     */
    String disableCube(String cubeName);

    /**
     *
     * @param cubeName Cube name.
     * @return
     */
    String purgeCube(String cubeName);

    /**
     *
     * @param jobId Job id
     * @return
     */
    String resumeJob(String jobId);

    /**
     * startTime - required long Start timestamp of data to build, e.g. 1388563200000 for 2014-1-1
     * endTime - required long End timestamp of data to build
     * buildType - required string Supported build type: ��BUILD��, ��MERGE��, ��REFRESH��
     * @param cubeName  Cube name.
     * @return
     */
    String buildCube(String cubeName, String body);

    /**
     *
     * @param jobId  Job id.
     * @return
     */
    String discardJob(String jobId);

    /**
     *
     * @param jobId  Job id.
     * @return
     */
    String getJobStatus(String jobId);

    /**
     *
     * @param jobId Job id.
     * @param stepId  Step id; the step id is composed by jobId with step sequence id;
     * for example, the jobId is ��fb479e54-837f-49a2-b457-651fc50be110��, its 3rd step id
     * is ��fb479e54-837f-49a2-b457-651fc50be110-3��,
     * @return
     */
    String getJobStepOutput(String jobId, String stepId);

    /**
     *
     * @param tableName table name to find.
     * @return
     */
    String getHiveTable(String projectName, String tableName);

    /**
     *
     * @param tableName  table name to find.
     * @return
     */
    String getHiveTableInfo(String tableName);

    /**
     *
     * @param projectName will list all tables in the project.
     * @param extOptional boolean set true to get extend info of table.
     *                    当ext为true时，可以返回如cardinality等扩展信息
     * @return
     */
    String getHiveTables(String projectName, boolean extOptional);

    /**
     *
     * @param tables  table names you want to load from hive, separated with comma.
     * @param project the project which the tables will be loaded into.
     * @return
     */
    String loadHiveTables(String tables, String project);

    /**
     *
     * @param type ��METADATA�� or ��CUBE��
     * @param name  Cache key, e.g the cube name.
     * @param action ��create��, ��update�� or ��drop��
     * @return
     */
    String wipeCache(String type, String name, String action);

    String query(String body) throws Exception;

    /**
     * 创建Model
     * @param modelName
     * @param projectName
     * @param factTable
     * @param lookups
     * @param dimensions
     * @param metrics
     * @return
     */
    String createModel(String modelName, String projectName, String factTable, String lookups, String dimensions, String metrics);

    /**
     * 创建/设计 Cube
     * @param cubeName
     * @param projectName
     * @param dimensions
     * @param measures
     * @param aggregationGroups
     * @param rowkey
     * @return
     */
    String createCube(String cubeName, String projectName, String dimensions, String measures, JSONArray aggregationGroups, JSONObject rowkey);

    String excute(String para, String method, String body);
}
