package bupt.edu.cn.web.pojo;

import java.io.Serializable;
import java.sql.Timestamp;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Table(name = "diagram")
@Data
@Entity
public class Diagram implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id", nullable = false)
    private Integer projectId;

    @Column(name = "work_id", nullable = false)
    private Integer workId;

    /**
     * 图表内容
     */
    @Column(name = "chart", nullable = false)
    private String chart;

    @Column(name = "data_source_id")
    private String dataSourceId;

    @Column(name = "name")
    private String name;

    /**
     * 保存状态
     */
    @Column(name = "saved")
    private String saved;

    @Column(name = "update_time")
    private Timestamp updateTime;

    /**
     * 关联图表的ID(,分割)
     */
    @Column(name = "association_ids")
    private String associationIds;

    @Column(name = "user_id")
    private String userId;

    /**
     * 分类
     */
    @Column(name = "classification")
    private String classification;

    
}