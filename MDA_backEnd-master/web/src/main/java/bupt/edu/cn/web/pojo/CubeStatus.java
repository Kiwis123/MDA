package bupt.edu.cn.web.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

/**
 * cube概览
 */
@Entity
@Table(name = "cube_status")
@Data
public class CubeStatus implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id")
    private Integer projectId = 1;

    /**
     * cube总体积，单位G
     */
    @Column(name = "cube_size")
    private Double cubeSize;

    /**
     * 平均膨胀率，无单位，60% == 0.6
     */
    @Column(name = "expansion_rate")
    private Double expansionRate;

    @Column(name = "time")
    private Timestamp time;

    @Column(name = "cube_num")
    private Integer cubeNum;

    
}