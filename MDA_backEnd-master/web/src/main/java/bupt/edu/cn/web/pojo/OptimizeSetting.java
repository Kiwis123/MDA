package bupt.edu.cn.web.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 优化策略设置
 */
@Entity
@Table(name = "optimize_setting")
@Data
public class OptimizeSetting implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id")
    private Integer projectId = 1;

    /**
     * cube名称【或global】
     */
    @Column(name = "cube_name")
    private String cubeName;

    /**
     * 聚合组优化倾向{true：低膨胀率，false：低时延}
     */
    @Column(name = "aggregation_group_prefer")
    private Boolean aggregationGroupPrefer;

    /**
     * 查询次数权重（0~100）
     */
    @Column(name = "query_count_weight")
    private Integer queryCountWeight;

    /**
     * 基数权重（0~100）
     */
    @Column(name = "cardinality_weight")
    private Integer cardinalityWeight;

    /**
     * 间隔天数
     */
    @Column(name = "gap_day")
    private Integer gapDay;

    /**
     * 同模型未命中率（0~100）
     */
    @Column(name = "miss_rate")
    private Integer missRate;

    /**
     * 查询时延（s）
     */
    @Column(name = "query_latency")
    private Double queryLatency;

    /**
     * cube的各聚合组，及其下属的维度列表、联合维度、必要维度、层级维度
     */
    @Column(name = "cube_aggregation_group")
    private String cubeAggregationGroup;

    
}