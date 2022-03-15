package bupt.edu.cn.web.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 数据表关联视图（每一条代表一个div雪花）
 */
@Table(name = "data_view")
@Entity
@Data
public class DataView implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id")
    private Integer projectId;

    @Column(name = "work_id")
    private Integer workId;

    /**
     * 包含：表名、列名
     */
    @Column(name = "tables")
    private String tables;

    /**
     * div的宽高
     */
    @Column(name = "style")
    private String style;

    /**
     * 每个表格元素所处的位置（top、left）
     */
    @Column(name = "layout")
    private String layout;

    /**
     * 视图名称（预留）
     */
    @Column(name = "name")
    private String name;

    
}