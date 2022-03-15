package bupt.edu.cn.web.pojo;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 查询sql列表，作为kylin自动建模的语料
 */
@Entity
@Data
@Table(name = "sql")
public class Sql implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id")
    private Integer projectId = 1;

    /**
     * 模型名称（factTable2lookupTable格式，非“数据准备”中的模型名称）
     */
    @Column(name = "model")
    private String model;

    @Column(name = "sql")
    private String sql;

    /**
     * 查询引擎类型{kylin、sparkSql、...}
     */
    @Column(name = "query_engine")
    private String queryEngine;

    /**
     * 查询时间（时刻）
     */
    @Column(name = "time")
    @JsonFormat(shape=JsonFormat.Shape.STRING,pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Timestamp time;

    /**
     * 查询时延（ms）
     */
    @Column(name = "query_latency")
    private Long queryLatency;

    
}