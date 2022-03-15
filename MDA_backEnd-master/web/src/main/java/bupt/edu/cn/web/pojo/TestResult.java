package bupt.edu.cn.web.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Kylin推算功能实验记录表
 */
@Table(name = "test_result")
@Data
@Entity
public class TestResult implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    /**
     * 查询的维度，使用别名
     */
    @Column(name = "dimensions")
    private String dimensions;

    /**
     * 查询的度量
     */
    @Column(name = "measure")
    private String measure;

    /**
     * 扫描的总行数
     */
    @Column(name = "total_scan_count")
    private Integer totalScanCount;

    /**
     * 结果行数
     */
    @Column(name = "result_row_count")
    private Integer resultRowCount;

    /**
     * 查询目标与推算起点--父cuboid的层数差
     */
    @Column(name = "layer_differ")
    private Integer layerDiffer;

    /**
     * 查询时延（ms）
     */
    @Column(name = "query_latency")
    private Integer queryLatency;

    /**
     * 查询时刻
     */
    @Column(name = "time")
    private Timestamp time;

    
}