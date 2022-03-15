package bupt.edu.cn.web.pojo;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 表间关系（source -> target模式）
 */
@Data
@Table(name = "relavance")
@Entity
public class Relavance implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", insertable = false, nullable = false)
    private Integer id;

    @Column(name = "project_id")
    private Integer projectId;

    @Column(name = "work_id")
    private Integer workId;

    @Column(name = "source")
    private String source;

    @Column(name = "target")
    private String target;

    
}